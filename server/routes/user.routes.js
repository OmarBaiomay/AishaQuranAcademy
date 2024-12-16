import express from "express";
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateTeacherAvailability,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// User Routes
router.post('/user', protectRoute, createUser); // Create a new user
router.get('/user', protectRoute, getUsers); // Get all users
router.get('/user/:id', protectRoute, getUserById); // Get a specific user by ID
router.put('/user/:id', protectRoute, updateUser); // Update a user by ID
router.delete('/user/:id', protectRoute, deleteUser); // Delete a user by ID

// Update a specific availability slot for a teacher
router.put("/teacher/:teacherId/availability/:availabilityId", updateTeacherAvailability);


export default router;
