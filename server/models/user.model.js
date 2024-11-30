import mongoose from "mongoose";
import axios from "axios"; // To fetch data from the API

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
            enum: ["Student", "Teacher", "Supervisor", "Administrator"], // Allowed roles
        },

        phone: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return /^[0-9]{10,15}$/.test(v); // Basic phone number validation
                },
                message: (props) => `${props.value} is not a valid phone number!`,
            },
        },

        country: {
            type: String,
            required: true,
        },

        countryCode: {
            type: String,
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

const user = mongoose.model("User", userSchema);

export default user;
