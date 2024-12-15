import mongoose from "mongoose";
import axios from "axios"; // To fetch data from the API

const availabilitySchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
        enum: [
            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
        ], // Restrict to valid days of the week
    },
    hour: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^(0?[1-9]|1[0-2]):[0-5][0-9]$/.test(v); // Validates hour in hh:mm format (supports 02:00 and 2:00)
            },
            message: (props) => `${props.value} is not a valid hour format! Use hh:mm.`,
        },
    },
    period: {
        type: String,
        required: true,
        enum: ["AM", "PM"], // Restrict to "AM" or "PM"
    },
    isBooked: {
        type: Boolean,
        default: false,
    },
    classroomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classroom", // Reference to the Classroom model
        default: null, // Null if not booked
    },
});

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        profilePic: {
            type: String,
            default: "",
        },
        role: {
            type: String,
            required: true,
            enum: ["Student", "Teacher", "Supervisor", "Administrator"],
        },
        phone: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        timeZone: {
            type: String,
            required: true,
            default: "UTC", // Default to UTC
        },

        availability: {
            type: [availabilitySchema],
            default: [], // Default to an empty array
        },
    },
    { timestamps: true }
);

// Middleware to fetch country codes dynamically
userSchema.pre("save", async function (next) {
    if (!this.isModified("country")) return next();

    try {
        // Fetch country codes from external API
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countries = response.data;

        // Map the countries to find the matching one
        const countryData = countries.find(
            (country) => country.name.common.toLowerCase() === this.country.toLowerCase()
        );

        if (!countryData) {
            return next(new Error("Invalid country selected."));
        }

        this.countryCode = countryData.idd?.root + (countryData.idd?.suffixes?.[0] || "");
        if (!this.countryCode) {
            return next(new Error("Country code not available for the selected country."));
        }

        next();
    } catch (error) {
        next(new Error("Failed to fetch country codes. Please try again later."));
    }
});

const User = mongoose.model("User", userSchema);

export default User;
