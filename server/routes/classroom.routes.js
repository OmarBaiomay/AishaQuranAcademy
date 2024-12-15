import express from "express";
import {
    createClassroom,
    getClassrooms,
    getClassroomById,
    updateClassroom,
    deleteClassroom,
    addClassToClassroom,
    updateClassAttendance,
    getAllClasses,
    generateMonthlyClasses,
    
} from "../controllers/calssroom.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Classroom Routes
router.post('/classroom', protectRoute, createClassroom); // Create a new classroom
router.get('/classroom', protectRoute, getClassrooms); // Get all classrooms
router.get('/classroom/:id', protectRoute, getClassroomById); // Get a specific classroom by ID
router.put('/classroom/:id', protectRoute, updateClassroom); // Update a classroom by ID
router.delete('/classroom/:id', protectRoute, deleteClassroom); // Delete a classroom by ID


router.post('/classroom/:classroomId/classes', protectRoute, addClassToClassroom); // Add a class
router.put('/classroom/:classroomId/classes/:classId', protectRoute, updateClassAttendance); // Update class attendance
router.get('/classroom/:classroomId/classes', protectRoute, getAllClasses); // Get all classes for a classroom
router.post('/classroom/:classroomId/generate-classes', protectRoute, generateMonthlyClasses);


export default router;
