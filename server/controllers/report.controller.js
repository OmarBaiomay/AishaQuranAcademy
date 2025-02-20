import Report from "../models/report.model.js";
import Classroom from "../models/classroom.model.js";

// ✅ Get all reports
export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 });
        res.status(200).json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Get a single report
export const getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ message: "Report not found" });
        res.status(200).json(report);
    } catch (error) {
        console.error("Error fetching report:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Create a report
export const createReport = async (req, res) => {
    const { classId, assessment, classActivity, homework } = req.body;

    if (!classId || !assessment || !classActivity || !homework) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const classroom = await Classroom.findOne({ "classes._id": classId })
            .populate("teacher", "fullName")
            .populate("student", "fullName");

        if (!classroom) {
            return res.status(404).json({ message: "Class not found" });
        }

        const newReport = new Report({
            classId,
            className: classroom.className,
            teacherId: classroom.teacher._id,
            teacherName: classroom.teacher.fullName,
            studentId: classroom.student._id,
            studentName: classroom.student.fullName,
            assessment,
            classActivity,
            homework,
        });

        await newReport.save();
        res.status(201).json({ message: "Report created successfully", report: newReport });
    } catch (error) {
        console.error("Error creating report:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Update a report
export const updateReport = async (req, res) => {
    try {
        const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!report) return res.status(404).json({ message: "Report not found" });
        res.status(200).json({ message: "Report updated successfully", report });
    } catch (error) {
        console.error("Error updating report:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Delete a report
export const deleteReport = async (req, res) => {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);
        if (!report) return res.status(404).json({ message: "Report not found" });
        res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
        console.error("Error deleting report:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
