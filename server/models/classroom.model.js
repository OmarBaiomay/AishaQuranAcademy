import { DateTime } from "luxon";
import mongoose from "mongoose";

// Class Schema for individual class details
const classSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    day: { type: String, required: true },
    time: { type: String, required: true },
    period: { type: String, required: true, enum: ["AM", "PM"] },
    date: { type: Date, required: true },
    studentAttendance: { attended: { type: Boolean, default: false }, time: { type: String, default: null } },
    teacherAttendance: { attended: { type: Boolean, default: false }, time: { type: String, default: null } },
    zoomLink: { type: String, required: true },
});

const classroomSchema = new mongoose.Schema({
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    supervisor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["free_trial", "ongoing", "overdue_bill", "freeze", "suspended"], default: "free_trial" },
    lastPaymentDate: { type: Date, default: null },
    nextPaymentDate: { type: Date, default: null },
    classTimes: [{ day: String, hour: String, period: String }],
    numberOfClassesPerMonth: { type: Number, default: 4 },
    pricePerMonth: { type: Number, default: 8 },
    totalPricePerMonth: { type: Number, default: 0 },
    classes: [classSchema],
    notes: { type: String, default: "" },
}, { timestamps: true });

const Classroom = mongoose.model("Classroom", classroomSchema);
export default Classroom;
