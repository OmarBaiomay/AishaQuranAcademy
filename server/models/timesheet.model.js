import mongoose from 'mongoose';

const timesheetSchema = new mongoose.Schema({
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
    classSession: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    day: { type: String, required: true },
    date: { type: Date, required: true },
    classDuration: { type: Number, required: true },
    classStatus: { type: String, enum: ["Up Comming", "Complatd", "Student Absent", "Teacher Absent", "Student Excused", "Teacher Excused", "Make up Class", "Rescudualed"], default: "Up Comming" },
    attendance: { type: String, enum: ["Attended", "Student Absent", "Teacher Absent", "Student Excused", "Teacher Excused", "Make up Class"], required: true },
    creditChange: { type: Number, default: 0 },
    classActivity: { type: String, default: "" },
    nextClassHW: { type: String, default: "" },
    assessment: { type: String, default: "" },
    teachersNotes: { type: String, default: "" },
    paymentAmount: { type: Number, default: 0 },
    payrollAmount: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ["Paid", "Unpaid", "Pending"], default: "Unpaid" },
    payrollStatus: { type: String, enum: ["Paid", "Unpaid", "Pending"], default: "Unpaid" }
}, { timestamps: true });

const Timesheet = mongoose.model('Timesheet', timesheetSchema);

export default Timesheet;
