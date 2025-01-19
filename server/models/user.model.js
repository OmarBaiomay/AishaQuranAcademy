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
        fullName: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
            enum: ["Male", "Female"],
        },
        age: { 
            type: Number, 
            min: 0,
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
            default: "Student",
        },
        phone: {
            countryCode: {
                type: String,
                required: true,
            },
            number: {
                type: String,
                required: true,
                validate: {
                    validator: function (v) {
                        return /^\d+$/.test(v); // Validate that the phone number contains only digits
                    },
                    message: (props) => `${props.value} is not a valid phone number!`,
                },
            },
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

const User = mongoose.model("User", userSchema);

export default User;
