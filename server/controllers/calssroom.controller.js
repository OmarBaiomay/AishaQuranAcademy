import { DateTime } from "luxon";
import models from "../models/classroom.model.js";
const { Classroom, Class } = models;
import User from "../models/user.model.js";
import mongoose from "mongoose";
import moment from "moment-timezone";


//   Function to update missing _id for classes
export const updateClassIdsForClasses = async (req, res) => {
    try {
        const classrooms = await Classroom.find();

        console.log(classrooms)

        let updatedCount = 0;

        for (const classroom of classrooms) {
            let updated = false;

            //   Fix: Use map() to update classes correctly
            classroom.classes = classroom.classes.map(cls => {
                if (!cls._id) {
                    cls._id = new mongoose.Types.ObjectId(); // Assign new ID
                    updated = true;
                }
                console.log(cls)
            });

            if (updated) {
                await classroom.save(); //   Force save with new _id values
                updatedCount++;
            }
        }

        return res.status(200).json({
            message: `  Updated ${updatedCount} classrooms with missing class IDs!`,
        });

    } catch (error) {
        console.error("Error updating class IDs:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const createClassroom = async (req, res) => {
  const {
    teacherId,
    studentId,
    supervisorId,
    classTimes,
    numberOfClassesPerMonth,
    notes,
    zoomLink,
    status = "free_trial",
    credits = 0,
    calssDurationInMinutes = 30,
    pricePerclassPerMonth = 8,
    totalPricePerMonth = 0,
  } = req.body;

  try {
    // ✅ Validate required fields
    if (!teacherId || !studentId || !supervisorId || !classTimes || !numberOfClassesPerMonth || !zoomLink) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const teacher = await User.findById(teacherId);
    const student = await User.findById(studentId);
    const supervisor = await User.findById(supervisorId);

    if (!teacher || teacher.role !== "Teacher") {
      return res.status(400).json({ message: "Invalid teacher ID or role." });
    }
    if (!student || student.role !== "Student") {
      return res.status(400).json({ message: "Invalid student ID or role." });
    }
    if (!supervisor || supervisor.role !== "Supervisor") {
      return res.status(400).json({ message: "Invalid supervisor ID or role." });
    }

    if (student.classroomId) {
      return res.status(400).json({ message: "This student is already assigned to a classroom." });
    }

    const availableSlots = teacher.availability.filter((slot) =>
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

    // ✅ Mark availability slots as booked
    availableSlots.forEach((slot) => {
      slot.isBooked = true;
    });

    // ✅ Create classroom
    const newClassroom = new Classroom({
      teacher: teacherId,
      student: studentId,
      supervisor: supervisorId,
      classTimes,
      numberOfClassesPerMonth,
      notes,
      zoomLink,
      status,
      credits,
      calssDurationInMinutes,
      pricePerclassPerMonth,
      totalPricePerMonth,
    });

    const savedClassroom = await newClassroom.save();

    // ✅ Link to student and teacher
    student.classroomId = savedClassroom._id;
    await student.save();

    availableSlots.forEach((slot) => {
      slot.classroomId = savedClassroom._id;
    });

    await teacher.save();

    res.status(201).json({
      message: "Classroom created successfully.",
      classroom: savedClassroom,
    });
  } catch (error) {
    console.error("❌ Error creating classroom:", error.message);
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
  const {
    teacherId,
    classTimes,
    notes,
    status,
    credits,
    calssDurationInMinutes,
    pricePerclassPerMonth,
    totalPricePerMonth,
    numberOfClassesPerMonth,
    zoomLink,
  } = req.body;

  try {
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found." });
    }

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "Teacher") {
      return res.status(400).json({ message: "Invalid teacher ID or role." });
    }

    // 🔓 Release previously booked times
    teacher.availability.forEach((slot) => {
      if (slot.classroomId?.toString() === classroomId) {
        slot.isBooked = false;
        slot.classroomId = null;
      }
    });

    // ✅ Validate & book new times
    const availableSlots = teacher.availability.filter((slot) =>
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

    // ✅ Book new slots
    availableSlots.forEach((slot) => {
      slot.isBooked = true;
      slot.classroomId = classroomId;
    });

    // 🛠️ Update classroom details
    classroom.teacher = teacherId;
    classroom.classTimes = classTimes;
    classroom.notes = notes || classroom.notes;
    classroom.status = status || classroom.status;
    classroom.credits = typeof credits === "number" ? credits : classroom.credits;
    classroom.calssDurationInMinutes = calssDurationInMinutes || classroom.calssDurationInMinutes;
    classroom.pricePerclassPerMonth = pricePerclassPerMonth || classroom.pricePerclassPerMonth;
    classroom.totalPricePerMonth = totalPricePerMonth || classroom.totalPricePerMonth;
    classroom.numberOfClassesPerMonth = numberOfClassesPerMonth || classroom.numberOfClassesPerMonth;
    classroom.zoomLink = zoomLink || classroom.zoomLink;

    await classroom.save();
    await teacher.save();

    res.status(200).json({
      message: "Classroom updated successfully.",
      classroom,
    });
  } catch (error) {
    console.error("❌ Error updating classroom:", error.message);
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
    const { day, time, period, date } = req.body;

    try {
        // Validate input
        if (!day || !time || !period || !date) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Find the classroom
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found." });
        }

        //   Add the new class WITHOUT zoomLink
        const newClass = { day, time, period, date };
        classroom.classes.push(newClass);

        await classroom.save();

        res.status(201).json({ message: "Class added to classroom successfully.", class: newClass });
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
    const { newDate, newStartTime, newEndTime } = req.body;

    try {
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) return res.status(404).json({ message: "Classroom not found." });

        const classToReschedule = classroom.classes.id(classId);
        if (!classToReschedule) return res.status(404).json({ message: "Class not found." });

        classToReschedule.date = newDate;
        classToReschedule.startTime = newStartTime;
        classToReschedule.endTime = newEndTime;

        await classroom.save();
        res.status(200).json({ message: "Class rescheduled successfully.", classroom });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

export const deleteClassFromClassroom = async (req, res) => {
    const { classroomId, classId } = req.params;

    try {
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found." });
        }

        // Filter out the class
        classroom.classes = classroom.classes.filter(cls => cls._id.toString() !== classId);

        await classroom.save();

        res.status(200).json({ message: "Class deleted successfully.", classroom });
    } catch (error) {
        console.error("Error deleting class:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// Fetch the upcoming class for a user

export const getUpcomingClass = async (req, res) => {
  const { userId } = req.params;

  try {
    // Convert userId to ObjectId for matching
    const classroom = await Classroom.findOne({
      $or: [
        { teacher: new mongoose.Types.ObjectId(userId) },
        { student: new mongoose.Types.ObjectId(userId) },
      ],
    })
      .populate("student", "fullName")
      .populate("teacher", "fullName");

    if (!classroom || !classroom.classes || classroom.classes.length === 0) {
      return res.status(404).json({ message: "No classes found." });
    }

    const now = new Date();
    const upcomingClass = classroom.classes
      .filter(
        (cls) =>
          new Date(cls.date) >= now &&
          (cls.classStatus === "Up Comming" || cls.classStatus === "Upcoming")
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

    if (!upcomingClass) {
      return res.status(404).json({ message: "No upcoming classes scheduled." });
    }

    return res.status(200).json({
      classId: upcomingClass._id,
      day: upcomingClass.day,
      date: upcomingClass.date,
      time: upcomingClass.time,
      period: upcomingClass.period,
      zoomLink: classroom.zoomLink,
      classStatus: upcomingClass.classStatus,
      studentName: classroom.student.fullName,
      teacherName: classroom.teacher.fullName,
      teacherAttendance: upcomingClass.teacherAttendance,
      studentAttendance: upcomingClass.studentAttendance,
    });
  } catch (error) {
    console.error("Error fetching upcoming class:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



//   Function to update classroom status
export const updateClassroomStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Allowed statuses
  const validStatuses = ["free_trial", "ongoing", "overdue_bill", "freeze", "suspended"];

  try {
    //   Validate status
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status provided." });
    }

    //   Find and update classroom
    const classroom = await Classroom.findByIdAndUpdate(
      id,
      { status },
      { new: true } //   Return updated classroom
    );

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found." });
    }

    res.status(200).json({
      message: "Classroom status updated successfully.",
      classroom,
    });
  } catch (error) {
    console.error("Error updating classroom status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeStudentFromClassroom = async (req, res) => {
    const { studentId } = req.params;

    try {
        const student = await User.findById(studentId);
        if (!student || student.role !== "Student") {
            return res.status(404).json({ message: "Student not found or invalid role." });
        }

        if (!student.classroomId) {
            return res.status(400).json({ message: "Student is not assigned to any classroom." });
        }

        const classroom = await Classroom.findById(student.classroomId);
        if (classroom) {
            classroom.student = null; // Remove student from classroom
            await classroom.save();
        }

        student.classroomId = null; // Remove classroom reference from student
        await student.save();

        res.status(200).json({ message: "Student removed from classroom successfully." });
    } catch (error) {
        console.error("Error removing student from classroom:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getStudentCalendarClasses = async (req, res) => {
  try {
    const studentId = req.params.id;

    // Fetch student time zone (e.g., "UTC+02:00")
    const student = await User.findById(studentId).select("timeZone fullName");
    const studentTimeZone = student?.timeZone || "UTC";

    const classrooms = await Classroom.find({ student: studentId })
      .populate("teacher", "fullName")
      .sort({ createdAt: 1 });

    if (!classrooms || classrooms.length === 0) {
      return res.status(200).json([]);
    }

    // Helper: convert a date to the student's time zone
    const convertToTimeZone = (date, timeZone) => {
      const utcDate = new Date(date);
      // Format with the desired time zone
      const formatted = new Intl.DateTimeFormat("en-US", {
        timeZone: "UTC",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(utcDate);

      // Adjust the UTC time using the offset from student.timeZone
      const offsetMatch = timeZone.match(/UTC([+-])(\d{2}):(\d{2})/);
      if (!offsetMatch) return utcDate;

      const sign = offsetMatch[1] === "+" ? 1 : -1;
      const hours = parseInt(offsetMatch[2], 10);
      const minutes = parseInt(offsetMatch[3], 10);
      const totalOffset = (hours * 60 + minutes) * sign;

      const localTime = new Date(utcDate.getTime() + totalOffset * 60000);
      return localTime;
    };

    const classEvents = classrooms.flatMap((classroom) =>
      classroom.classes.map((cls) => {
        const classStart = convertToTimeZone(cls.date, studentTimeZone);
        const duration = classroom.calssDurationInMinutes || 30;
        const classEnd = new Date(classStart.getTime() + duration * 60000);

        return {
          _id: cls._id,
          Subject: `${classroom.teacher.fullName} - Quran Class`,
          StartTime: classStart,
          EndTime: classEnd,
          Description: classroom.zoomLink || "Zoom Link not available",
          Day: cls.day,
          Status: cls.classStatus,
        };
      })
    );

    console.log(classEvents)

    return res.status(200).json(classEvents);
  } catch (error) {
    console.error("❌ Failed to fetch student classes:", error);
    return res.status(500).json({ message: "Error fetching student classes" });
  }
};