import { DateTime } from "luxon";
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
        if (!teacher.availability || !Array.isArray(teacher.availability) || teacher.availability.length === 0) {
            return res.status(400).json({
                message: "The teacher does not have availability defined. Please update their availability.",
            });
        }

        const slot = teacher.availability.find(
            (slot) =>
                slot.day === day &&
                slot.hour === hour &&
                slot.period === period &&
                !slot.isBooked
        );

        if (!slot) {
            console.log("Teacher's availability:", teacher.availability);
            console.log("Requested class time:", { day, hour, period });
        
            return res.status(400).json({
                message: "The selected time slot is not available or already booked.",
            });
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


export const addClassToClassroom = async (req, res) => {
    const { classroomId } = req.params;
    const { day, time, period, zoomLink } = req.body;

    try {
        // Validate input
        if (!day || !time || !period || !zoomLink) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Find the classroom
        const classroom = await Classroom.findById(classroomId);

        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found." });
        }

        // Add the new class
        const newClass = { day, time, period, zoomLink };
        classroom.classes.push(newClass);

        await classroom.save();

        res.status(201).json({ message: "Class added to classroom successfully.", classroom });
    } catch (error) {
        console.error("Error adding class to classroom:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateClassAttendance = async (req, res) => {
    const { classroomId, classId } = req.params;
    const { studentAttendance, teacherAttendance } = req.body;

    try {
        // Find the classroom
        const classroom = await Classroom.findById(classroomId);

        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found." });
        }

        // Find the class
        const classItem = classroom.classes.id(classId);

        if (!classItem) {
            return res.status(404).json({ message: "Class not found." });
        }

        // Update attendance
        if (studentAttendance) {
            classItem.studentAttendance = studentAttendance;
        }
        if (teacherAttendance) {
            classItem.teacherAttendance = teacherAttendance;
        }

        await classroom.save();

        res.status(200).json({ message: "Attendance updated successfully.", classroom });
    } catch (error) {
        console.error("Error updating attendance:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getAllClasses = async (req, res) => {
    const { classroomId } = req.params;

    try {
        const classroom = await Classroom.findById(classroomId);

        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found." });
        }

        res.status(200).json(classroom.classes);
    } catch (error) {
        console.error("Error fetching classes:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const generateMonthlyClasses = async (req, res) => {
    const { classroomId } = req.params;

    try {
        // Find the classroom and populate related user roles
        const classroom = await Classroom.findById(classroomId)
            .populate("teacher")
            .populate("student")
            .populate("supervisor");

        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found." });
        }

        const { classTime, numberOfClassesPerMonth, teacher, student, supervisor } = classroom;

        if (!classTime) {
            return res.status(400).json({ message: "Classroom does not have classTime defined." });
        }

        const { day, hour, period } = classTime;

        // Get time zones for teacher, student, and supervisor
        const teacherTimeZone = teacher.timeZone || "UTC";
        const studentTimeZone = student.timeZone || "UTC";
        const supervisorTimeZone = supervisor.timeZone || "UTC";

        // Generate dates for the current month
        const today = DateTime.now().setZone(teacherTimeZone); // Base scheduling on teacher's time zone
        const year = today.year;
        const month = today.month;

        const classes = [];
        let count = 0;

        for (let date = 1; count < numberOfClassesPerMonth && date <= 31; date++) {
            const currentDate = DateTime.local(year, month, date, { zone: teacherTimeZone });

            // Check if the current date matches the specified day
            if (currentDate.toFormat("cccc") === day) {
                // Convert class time to DateTime in teacher's time zone
                const classDateTime = currentDate.set({
                    hour: period === "AM" ? parseInt(hour) : parseInt(hour) + 12,
                    minute: 0,
                });

                // Convert class time to student and supervisor time zones
                const studentClassTime = classDateTime.setZone(studentTimeZone);
                const supervisorClassTime = classDateTime.setZone(supervisorTimeZone);

                classes.push({
                    day,
                    time: classDateTime.toFormat("hh:mm a"), // Ensures the time is in hh:mm AM/PM format
                    period,
                    date: classDateTime.toJSDate(), // Save as JS Date object
                    zoomLink: `https://zoom.us/meeting/${classroomId}-${count + 1}`,
                    times: {
                        teacher: classDateTime.toFormat("hh:mm a z"),
                        student: studentClassTime.toFormat("hh:mm a z"),
                        supervisor: supervisorClassTime.toFormat("hh:mm a z"),
                    },
                });
                count++;
            }
        }

        // Add generated classes to the classroom
        classroom.classes = classroom.classes.concat(classes);

        await classroom.save();

        res.status(201).json({
            message: `${classes.length} classes generated for the month.`,
            classes,
        });
    } catch (error) {
        console.error("Error generating monthly classes:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
