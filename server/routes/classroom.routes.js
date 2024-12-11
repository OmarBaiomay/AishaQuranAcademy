import express from "express";
import {
    createClassroom,
    getClassrooms,
    getClassroomById,
    updateClassroom,
    deleteClassroom,
} from "../controllers/calssroom.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Classroom Routes
router.post('/classroom', protectRoute, createClassroom); // Create a new classroom
router.get('/classroom', protectRoute, getClassrooms); // Get all classrooms
router.get('/classroom/:id', protectRoute, getClassroomById); // Get a specific classroom by ID
router.put('/classroom/:id', protectRoute, updateClassroom); // Update a classroom by ID
router.delete('/classroom/:id', protectRoute, deleteClassroom); // Delete a classroom by ID

export default router;
