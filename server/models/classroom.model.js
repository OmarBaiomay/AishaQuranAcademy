import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    day: { type: String, required: true },
    time: { type: String, required: true },
    period: { type: String, required: true, enum: ["AM", "PM"] },
    date: { type: Date, required: true },
    studentAttendance: { attended: { type: Boolean, default: false }, time: { type: String, default: null } },
    teacherAttendance: { attended: { type: Boolean, default: false }, time: { type: String, default: null } },
    studentFeedback: { type: String, default: null },
    teacherFeedback: { type: String, default: null },
    studentRating: { type: Number, default: 0 },
    studentHomework: { type: String, default: null },
    ClassActivity : { type: String, default: null },
    classStatus: { type: String, enum: ["Up Comming", "Complatd", "Student Absent", "Teacher Absent", "Student Excused", "Teacher Excused" ,"Make up Class", "Rescudualed"], default: "Up Comming" },
    paymentStatus: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
    payrollStatus: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
    rescadualedClassData:{ date: { type: Date, default: null }, time: { type: String, default: null }, period: { type: String, enum: ["AM", "PM"], default: null } },
});

const classroomSchema = new mongoose.Schema({
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    supervisor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["free_trial", "ongoing", "overdue_bill", "freeze", "suspended"], default: "free_trial" },
    lastPaymentDate: { type: Date, default: null },
    nextPaymentDate: { type: Date, default: null },
    zoomLink: { type: String, required: true }, 
    classTimes: [{ day: String, hour: String, period: String }],
    numberOfClassesPerMonth: { type: Number, default: 4 },
    calssDurationInMinutes: { type: String, enum: [30, 45, 60, 90, 120], default: 30},
    pricePerclassPerMonth: { type: Number, default: 8 },
    totalPricePerMonth: { type: Number, default: 0 },
    classes: [classSchema],
    notes: { type: String, default: "" },
}, { timestamps: true });

const Classroom = mongoose.model("Classroom", classroomSchema);
const Class = mongoose.model("Class", classSchema);

export { Classroom, Class };
