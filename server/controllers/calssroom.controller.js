import { DateTime } from "luxon";
import Classroom from "../models/classroom.model.js";
import User from "../models/user.model.js";


export const createClassroom = async (req, res) => {
    const { teacherId, studentId, supervisorId, classTimes, numberOfClassesPerMonth, notes } = req.body;

    try {
        // Validate required fields
        if (!teacherId || !studentId || !supervisorId || !classTimes || !numberOfClassesPerMonth) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const teacher = await User.findById(teacherId);

        if (!teacher || teacher.role !== "Teacher") {
            return res.status(400).json({ message: "Invalid teacher ID or role." });
        }

        // Validate and book the teacher's available times
        const availableSlots = teacher.availability.filter(
            (slot) =>
                classTimes.some(
                    (time) =>
                        time.day === slot.day &&
                        time.hour === slot.hour &&
                        time.period === slot.period &&
                        !slot.isBooked
                )
        );

        if (availableSlots.length !== classTimes.length) {
            return res.status(400).json({
                message: "Some or all of the requested times are not available.",
            });
        }

        // Book the requested slots
        availableSlots.forEach((slot) => {
            slot.isBooked = true;
        });

        // Create the classroom
        const newClassroom = new Classroom({
            teacher: teacherId,
            student: studentId,
            supervisor: supervisorId,
            classTimes,
            numberOfClassesPerMonth,
            notes,
        });

        const savedClassroom = await newClassroom.save();

        // Link the classroom to the teacher's availability
        availableSlots.forEach((slot) => {
            slot.classroomId = savedClassroom._id;
        });

        await teacher.save();

        res.status(201).json({
            message: "Classroom created successfully.",
            classroom: savedClassroom,
        });
    } catch (error) {
        console.error("Error creating classroom:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get all classrooms
export const getClassrooms = async (req, res) => {
    try {
        const classrooms = await Classroom.find()
            .populate("teacher", "fullName email phone country timeZone")
            .populate("student", "fullName email phone country timeZone")
            .populate("supervisor", "fullName email phone country timeZone");

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
            .populate("teacher", "fullName email phone country timeZone")
            .populate("student", "fullName email phone country timeZone")
            .populate("supervisor", "fullName email phone country timeZone");

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
    const { classroomId } = req.params;
    const { teacherId, classTimes, notes } = req.body;

    try {
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found." });
        }

        const teacher = await User.findById(teacherId);

        if (!teacher || teacher.role !== "Teacher") {
            return res.status(400).json({ message: "Invalid teacher ID or role." });
        }

        // Release previously booked times
        teacher.availability.forEach((slot) => {
            if (slot.classroomId?.toString() === classroomId) {
                slot.isBooked = false;
                slot.classroomId = null;
            }
        });

        // Validate and book new times
        const availableSlots = teacher.availability.filter(
            (slot) =>
                classTimes.some(
                    (time) =>
                        time.day === slot.day &&
                        time.hour === slot.hour &&
                        time.period === slot.period &&
                        !slot.isBooked
                )
        );

        if (availableSlots.length !== classTimes.length) {
            return res.status(400).json({
                message: "Some or all of the requested times are not available.",
            });
        }

        availableSlots.forEach((slot) => {
            slot.isBooked = true;
            slot.classroomId = classroomId;
        });

        // Update classroom details
        classroom.classTimes = classTimes;
        classroom.notes = notes || classroom.notes;

        await classroom.save();
        await teacher.save();

        res.status(200).json({
            message: "Classroom updated successfully.",
            classroom,
        });
    } catch (error) {
        console.error("Error updating classroom:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete a classroom by ID
export const deleteClassroom = async (req, res) => {
    const { classroomId } = req.params;

    try {
        const classroom = await Classroom.findById(classroomId);

        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found." });
        }

        const teacher = await User.findById(classroom.teacher);

        if (teacher) {
            // Unbook associated times
            teacher.availability.forEach((slot) => {
                if (slot.classroomId?.toString() === classroomId) {
                    slot.isBooked = false;
                    slot.classroomId = null;
                }
            });

            await teacher.save();
        }

        // Delete the classroom
        await Classroom.findByIdAndDelete(classroomId);

        res.status(200).json({
            message: "Classroom deleted successfully and availability updated.",
        });
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
        // Find the classroom
        const classroom = await Classroom.findById(classroomId);

        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found." });
        }

        const { classTimes, numberOfClassesPerMonth, classes } = classroom;

        if (!classTimes || classTimes.length === 0) {
            return res.status(400).json({ message: "Classroom does not have classTimes defined." });
        }

        // Get current month and year
        const now = DateTime.now();
        const currentMonth = now.toFormat("yyyy-MM");

        // Check if classes for the current month already exist
        const existingClasses = classes.filter((cls) => cls.month === currentMonth);

        if (existingClasses.length > 0) {
            return res.status(400).json({
                message: "Monthly classes for the current month have already been created.",
            });
        }

        // Distribute the required number of classes across the available classTimes
        const totalTimes = classTimes.length;
        const classesPerTime = Math.floor(numberOfClassesPerMonth / totalTimes);
        const remainder = numberOfClassesPerMonth % totalTimes; // Extra classes to distribute

        const newClasses = [];
        classTimes.forEach(({ day, hour, period }, index) => {
            // Calculate how many classes to generate for this specific classTime
            const classesToGenerate = classesPerTime + (index < remainder ? 1 : 0); // Distribute remainder

            let count = 0;
            for (let date = 1; count < classesToGenerate && date <= now.daysInMonth; date++) {
                const currentDate = DateTime.local(now.year, now.month, date);

                // Check if the current date matches the specified day
                if (currentDate.toFormat("cccc") === day) {
                    newClasses.push({
                        day,
                        time: `${hour} ${period}`, // Format: hh:mm AM/PM
                        date: currentDate.toJSDate(),
                        zoomLink: `https://zoom.us/meeting/${classroomId}-${newClasses.length + 1}`,
                        month: currentMonth,
                        period,
                    });
                    count++;
                }
            }
        });

        // Ensure the total number of classes matches `numberOfClassesPerMonth`
        if (newClasses.length !== numberOfClassesPerMonth) {
            return res.status(500).json({
                message: `Unable to generate the exact number of required classes (${numberOfClassesPerMonth}). Generated ${newClasses.length} classes.`,
            });
        }

        // Add generated classes to the classroom
        classroom.classes = classroom.classes.concat(newClasses);

        await classroom.save();

        res.status(201).json({
            message: `${newClasses.length} classes generated for the month.`,
            classes: newClasses,
        });
    } catch (error) {
        console.error("Error generating monthly classes:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const rescheduleClass = async (req, res) => {
    const { classroomId, classId } = req.params;

    try {
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
        return res.status(404).json({ message: "Classroom not found." });
        }

        // Use find instead of id
        const classItem = classroom.classes.find((cls) => cls._id.toString() === classId);
        if (!classItem) {
        return res.status(404).json({ message: "Class not found." });
        }

        // Logic to reschedule the class
        classItem.date = new Date(); // Example: Reschedule to the current date
        await classroom.save();

        res.status(200).json({ message: "Class rescheduled successfully.", classItem });
    } catch (error) {
        console.error("Error rescheduling class:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

  