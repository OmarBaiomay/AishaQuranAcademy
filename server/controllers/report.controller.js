import Report from "../models/report.model.js";
import Classroom from "../models/classroom.model.js";
import User from "../models/user.model.js";

<<<<<<< HEAD
// Create a new report
export const createReport = async (req, res) => {
  const { classId, content } = req.body;
  try {
    const classroom = await Classroom.findById(classId).populate("teacher").populate("student");

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
=======
// Create a new report for a specific class
export const createReport = async (req, res) => {
  const { classId, content } = req.body;
  try {
    const classroom = await Classroom.findOne({ "classes._id": classId }).populate("teacher student");

    if (!classroom) {
      return res.status(404).json({ message: "Class not found" });
    }

    const classData = classroom.classes.find((cls) => cls._id.toString() === classId);

    if (!classData) {
      return res.status(404).json({ message: "Class not found inside the classroom" });
>>>>>>> d7096a9828ddc98a17cf45e43b20c93b2602ba68
    }

    const newReport = new Report({
      classId,
<<<<<<< HEAD
      classroomName: `${classroom.student.fullName} & ${classroom.teacher.fullName}'s Class`,
      teacherId: classroom.teacher._id,
      teacherName: classroom.teacher.fullName,
=======
      className: `${classData.day} - ${classData.time}`,
      teacherId: classroom.teacher._id,
      teacherName: classroom.teacher.fullName,
      studentId: classroom.student._id,
      studentName: classroom.student.fullName,
>>>>>>> d7096a9828ddc98a17cf45e43b20c93b2602ba68
      content,
    });

    const savedReport = await newReport.save();

    res.status(201).json({ message: "Report created successfully", report: savedReport });
  } catch (error) {
    console.error("Error creating report:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all reports
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a specific report by ID
export const getReportById = async (req, res) => {
  const { id } = req.params;
  try {
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    console.error("Error fetching report:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a report by ID
export const updateReport = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.content = content;
    await report.save();

    res.status(200).json({ message: "Report updated successfully", report });
  } catch (error) {
    console.error("Error updating report:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a report by ID
export const deleteReport = async (req, res) => {
  const { id } = req.params;

  try {
    const report = await Report.findByIdAndDelete(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
