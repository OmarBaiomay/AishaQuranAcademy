import { DateTime } from "luxon";
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
                return /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/.test(v); // Matches hh:mm AM/PM format
            },
            message: (props) => `${props.value} is not a valid time format! Use hh:mm AM/PM.`,
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
        classTimes: [
            {
                day: {
                    type: String,
                    required: true,
                },
                hour: {
                    type: String,
                    required: true,
                },
                period: {
                    type: String,
                    required: true,
                    enum: ["AM", "PM"],
                },
            },
        ],
        numberOfClassesPerMonth: {
            type: Number,
            required: true,
            default: 4,
        },
        pricePerMonth: {
            type: Number,
            required: true,
            default: 8,
        },
        totalPricePerMonth: {
            type: Number,
            required: true,
            default: 0,
        },
        classes: {
            type: Array,
            default: [],
        },
        notes: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

// Calculate total price before saving
classroomSchema.pre("validate", function (next) {
    if (this.numberOfClassesPerMonth && this.pricePerMonth) {
        this.totalPricePerMonth = this.numberOfClassesPerMonth * this.pricePerMonth;
    }
    next();
});

// // Post middleware to generate monthly classes
// classroomSchema.post("save", async function (doc, next) {
//     const classroom = this;

//     // Get current month and year
//     const now = DateTime.now();
//     const currentMonth = now.toFormat("yyyy-MM");

//     const totalTimes = classroom.classTimes.length;
//     const classesPerTime = Math.floor(classroom.numberOfClassesPerMonth / totalTimes);
//     const remainder = classroom.numberOfClassesPerMonth % totalTimes;

//     const newClasses = [];

//     classroom.classTimes.forEach(({ day, hour, period }, index) => {
//         let count = 0;
//         const classesToGenerate = classesPerTime + (index < remainder ? 1 : 0);

//         for (let date = 1; count < classesToGenerate && date <= now.daysInMonth; date++) {
//             const currentDate = DateTime.local(now.year, now.month, date);

//             if (currentDate.toFormat("cccc") === day) {
//                 newClasses.push({
//                     day,
//                     time: `${hour} ${period}`,
//                     date: currentDate.toJSDate(),
//                     zoomLink: `https://zoom.us/meeting/${classroom._id}-${newClasses.length + 1}`,
//                     month: currentMonth,
//                     period,
//                 });
//                 count++;
//             }
//         }
//     });

//     // Ensure generated classes match the required number
//     if (newClasses.length !== classroom.numberOfClassesPerMonth) {
//         throw new Error(
//             `Unable to generate the exact number of required classes (${classroom.numberOfClassesPerMonth}). Generated ${newClasses.length} classes.`
//         );
//     }

//     // Update classroom with generated classes
//     classroom.classes = newClasses;
//     await classroom.save();

//     next();
// });


const Classroom = mongoose.model("Classroom", classroomSchema);

export default Classroom;

