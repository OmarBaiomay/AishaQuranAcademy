import express from "express";
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateUserAvailability,
    addUserAvailability,
    getUserAvailability,
    deleteUserAvailability,
    addFCMToken,
    removeFCMToken,
} from "../controllers/user.controller.js"; // Import the new controller functions
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// User Routes
router.post('/user', protectRoute, createUser); // Create a new user
router.get('/users', protectRoute, getUsers); // Get all users or filter by role
router.get('/user/:id', protectRoute, getUserById); // Get a specific user by ID
router.put('/user/:id', protectRoute, updateUser); // Update a user by ID
router.delete('/user/:id', protectRoute, deleteUser); // Delete a user by ID

// Availability Routes
router.put('/user/:userId/availability/:availabilityId', protectRoute, updateUserAvailability); // Update user availability
router.post('/user/:userId/availability', protectRoute, addUserAvailability); // Add availability for a user
router.get('/user/:userId/availability', protectRoute, getUserAvailability); // Get all availability for a user
router.delete('/user/:userId/availability/:availabilityId', protectRoute, deleteUserAvailability); // Delete a specific availability slot

// FCM Token Routes
router.post('/user/:userId/fcm-tokens',protectRoute, addFCMToken); // Add an FCM token for a user
router.delete('/user/:userId/fcm-tokens/:token',protectRoute, removeFCMToken); // Remove an FCM token for a user

export default router;