import express from "express";
import {
    updateClassIdsForClasses,
    createClassroom,
    getClassrooms,
    getClassroomById,
    updateClassroom,
    deleteClassroom,
    addClassToClassroom,
    updateClassAttendance,
    getAllClasses,
    generateMonthlyClasses,
    rescheduleClass,
    getUpcomingClass,
    updateClassroomStatus,
    deleteClassFromClassroom,
    removeStudentFromClassroom,
    getStudentCalendarClasses,
} from "../controllers/calssroom.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get('/classroom/update-class-ids', protectRoute, updateClassIdsForClasses);

// Classroom Routes
router.post('/classroom', protectRoute, createClassroom); // Create a new classroom
router.get('/classroom', protectRoute, getClassrooms); // Get all classrooms
router.get('/classroom/:id', protectRoute, getClassroomById); // Get a specific classroom by ID
router.put('/classroom/:id', protectRoute, updateClassroom); // Update a classroom by ID
router.delete('/classroom/:classroomId', protectRoute, deleteClassroom); // Delete a classroom by ID
router.put('/user/:studentId/remove-classroom', protectRoute, removeStudentFromClassroom);


router.post('/classroom/:classroomId/classes', protectRoute, addClassToClassroom); // Add a class
router.put('/classroom/:classroomId/classes/:classId', protectRoute, updateClassAttendance); // Update class attendance
router.get('/classroom/:classroomId/classes', protectRoute, getAllClasses); // Get all classes for a classroom
router.post('/classroom/:classroomId/generate-monthly-classes', protectRoute, generateMonthlyClasses);
router.put('/classroom/:classroomId/class/:classId/reschedule', protectRoute, rescheduleClass);

router.get('/classes/upcoming/:userId', getUpcomingClass); // UpComing Calss

router.put('/classroom/:id/status', protectRoute, updateClassroomStatus);
router.delete('/classroom/:classroomId/classes/:classId', protectRoute, deleteClassFromClassroom); // Delete a class


router.get('/student/:id/classes', getStudentCalendarClasses);

export default router;
