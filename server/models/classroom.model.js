import mongoose from "mongoose";

// Class Schema for individual class details
const classSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
        enum: [
            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
        ],
    },
    time: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^(0?[1-9]|1[0-2]):[0-5][0-9]$/.test(v);
            },
            message: (props) => `${props.value} is not a valid time format! Use hh:mm.`,
        },
    },
    period: {
        type: String,
        required: true,
        enum: ["AM", "PM"],
    },
    date: {
        type: Date,
        required: true,
    },
    studentAttendance: {
        attended: { type: Boolean, default: false },
        time: { type: String, default: null },
    },
    teacherAttendance: {
        attended: { type: Boolean, default: false },
        time: { type: String, default: null },
    },
    zoomLink: {
        type: String,
        required: true,
    },
});

const classroomSchema = new mongoose.Schema(
    {
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        supervisor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        classTime: {
            day: {
                type: String,
                required: true,
                enum: [
                    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
                ],
            },
            hour: {
                type: String,
                required: true,
                validate: {
                    validator: function (v) {
                        return /^(0?[1-9]|1[0-2]):[0-5][0-9]$/.test(v);
                    },
                    message: (props) => `${props.value} is not a valid hour format! Use hh:mm.`,
                },
            },
            period: {
                type: String,
                required: true,
                enum: ["AM", "PM"],
            },
        },
        numberOfClassesPerMonth: {
            type: Number,
            required: true,
            default: 4, // Default to 4 classes per month
        },
        pricePerMonth: {
            type: Number,
            required: true,
            default: 8, // 8 USD per class by default
        },
        totalPricePerMonth: {
            type: Number,
            required: true,
        },
        classes: [classSchema], // Embedded array of classes
        isActive: {
            type: Boolean,
            default: true,
        },
        notes: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

// Calculate total price per month before saving
classroomSchema.pre("save", function (next) {
    this.totalPricePerMonth = this.numberOfClassesPerMonth * this.pricePerMonth;
    next();
});

const Classroom = mongoose.model("Classroom", classroomSchema);

export default Classroom;
