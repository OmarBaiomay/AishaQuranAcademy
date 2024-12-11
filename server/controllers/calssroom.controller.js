import Classroom from "../models/classroom.model.js";
import User from "../models/user.model.js";

export const createClassroom = async (req, res) => {
    const { teacherId, studentId, supervisorId, classTime, notes } = req.body;

    try {
        // Validate required fields
        if (!teacherId || !studentId || !supervisorId || !classTime) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const { day, hour, period } = classTime;

        // Validate classTime fields
        if (
            !day ||
            !hour ||
            !period ||
            !["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].includes(day) ||
            !/^([1-9]|1[0-2]):[0-5][0-9]$/.test(hour) ||
            !["AM", "PM"].includes(period)
        ) {
            return res
                .status(400)
                .json({ message: "Invalid classTime. Ensure valid day, hour, and period." });
        }

        // Fetch teacher, student, and supervisor from database
        const teacher = await User.findById(teacherId);
        const student = await User.findById(studentId);
        const supervisor = await User.findById(supervisorId);

        if (!teacher || !student || !supervisor) {
            return res.status(404).json({ message: "Teacher, Student, or Supervisor not found." });
        }

        // Ensure teacher role
        if (teacher.role !== "Teacher") {
            return res.status(400).json({ message: "The assigned teacher is not a valid Teacher role." });
        }

        // Check teacher's availability
        const slot = teacher.availability.find(
            (slot) =>
                slot.day === day &&
                slot.hour === hour &&
                slot.period === period &&
                !slot.isBooked
        );

        if (!slot) {
            return res
                .status(400)
                .json({ message: "The selected time slot is not available or already booked." });
        }

        // Create the new classroom
        const newClassroom = new Classroom({
            teacher: teacherId,
            student: studentId,
            supervisor: supervisorId,
            classTime,
            notes,
        });

        // Save the classroom
        const savedClassroom = await newClassroom.save();

        // Update teacher's availability
        slot.isBooked = true;
        slot.classroomId = savedClassroom._id;
        await teacher.save();

        res.status(201).json({
            message: "Classroom created successfully.",
            classroom: savedClassroom,
        });
    } catch (error) {
        console.error("Error in Create Classroom Controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// Get all classrooms
export const getClassrooms = async (req, res) => {
    try {
        const classrooms = await Classroom.find()
            .populate("teacher", "firstName lastName email")
            .populate("student", "firstName lastName email")
            .populate("supervisor", "firstName lastName email");

        res.status(200).json(classrooms);
    } catch (error) {
        console.error("Error fetching classrooms:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get a specific classroom by ID
export const getClassroomById = async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.id)
            .populate("teacher", "firstName lastName email")
            .populate("student", "firstName lastName email")
            .populate("supervisor", "firstName lastName email");

        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found." });
        }

        res.status(200).json(classroom);
    } catch (error) {
        console.error("Error fetching classroom:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update a classroom by ID
export const updateClassroom = async (req, res) => {
    const { teacherId, studentId, supervisorId, classTime, notes } = req.body;

    try {
        const classroom = await Classroom.findById(req.params.id);

        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found." });
        }

        // Update fields if provided
        if (teacherId) classroom.teacher = teacherId;
        if (studentId) classroom.student = studentId;
        if (supervisorId) classroom.supervisor = supervisorId;
        if (classTime) classroom.classTime = classTime;
        if (notes) classroom.notes = notes;

        await classroom.save();

        res.status(200).json({ message: "Classroom updated successfully.", classroom });
    } catch (error) {
        console.error("Error updating classroom:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete a classroom by ID
export const deleteClassroom = async (req, res) => {
    try {
        const classroom = await Classroom.findByIdAndDelete(req.params.id);

        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found." });
        }

        res.status(200).json({ message: "Classroom deleted successfully." });
    } catch (error) {
        console.error("Error deleting classroom:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};