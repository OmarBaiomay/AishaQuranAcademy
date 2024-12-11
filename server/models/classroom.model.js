import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema(
    {
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the User model
            required: true,
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the User model
            required: true,
        },
        supervisor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the User model
            required: true,
        },
        classTime: {
            day: {
                type: String,
                required: true,
                enum: [
                    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
                ], // Valid days of the week
            },
            hour: {
                type: String,
                required: true,
                validate: {
                    validator: function (v) {
                        return /^([1-9]|1[0-2]):[0-5][0-9]$/.test(v); // Validates hour in hh:mm format
                    },
                    message: (props) => `${props.value} is not a valid hour format! Use hh:mm.`,
                },
            },
            period: {
                type: String,
                required: true,
                enum: ["AM", "PM"], // Restrict to "AM" or "PM"
            },
        },
        isActive: {
            type: Boolean,
            default: true, // Indicates whether the class is currently active
        },
        status: {
            type: String,
            enum: ["Scheduled", "In Progress", "Completed", "Cancelled"],
            default: "Scheduled",
        },
        createdOn: {
            type: Date,
            default: Date.now, // Automatically set the creation date
        },
        notes: {
            type: String,
            default: "", // Optional notes for the classroom
        },
    },
    { timestamps: true }
);

const Classroom = mongoose.model("Classroom", classroomSchema);

export default Classroom;
