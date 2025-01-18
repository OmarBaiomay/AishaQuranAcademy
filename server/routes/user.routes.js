import express from "express";
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateTeacherAvailability,
    getProfile,
    updateProfile,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// User Routes
router.post('/user', protectRoute, createUser); // Create a new user
router.get('/users', protectRoute, getUsers); // Get all users or filter by role
router.get('/user/:id', protectRoute, getUserById); // Get a specific user by ID
router.put('/user/:id', protectRoute, updateUser); // Update a user by ID
router.get('/profile/:id', protectRoute, getProfile); // Update a profile by ID
router.put('/profile/:id', protectRoute, updateProfile); // Update a Profile by ID
router.delete('/user/:id', protectRoute, deleteUser); // Delete a user by ID

// Update a specific availability slot for a teacher
router.put("/teacher/:teacherId/availability/:availabilityId", updateTeacherAvailability);

export default router;
