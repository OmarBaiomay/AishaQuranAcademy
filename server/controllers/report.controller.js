import Report from "../models/report.model.js";
import Classroom from "../models/classroom.model.js";
import User from "../models/user.model.js";

// Create a new report for a specific class
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
          return res.status(404).json({ message: "Class not found inside any classroom." });
      }

      const classData = classroom.classes.find(cls => cls._id.toString() === classId);

      if (!classData) {
          return res.status(404).json({ message: "Class not found." });
      }

      const newReport = new Report({
          classId,
          className: `${classData.day} - ${classData.time}`,
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
  const { classId, content } = req.body;

  if (!classId) {
      return res.status(400).json({ message: "Class ID is required." });
  }

  try {
      const report = await Report.findById(id);
      if (!report) {
          return res.status(404).json({ message: "Report not found" });
      }

      report.content = content;
      report.classId = classId; // ✅ Ensure classId is updated
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
