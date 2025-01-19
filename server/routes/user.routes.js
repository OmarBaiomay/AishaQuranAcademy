import express from "express";
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateUserAvailability,
    getProfile,
    updateProfile,
    addUserAvailability,
    getUserAvailability,
    deleteUserAvailability,
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

// Avaliblity Routs
router.put('/user/:userId/availability/:availabilityId', updateUserAvailability); // Update user Avaliblity
router.post('/user/:userId/availability', addUserAvailability); // Add availability for a user
router.get('/user/:userId/availability', getUserAvailability); // Get all availability for a user
router.delete('/user/:userId/availability/:availabilityId', deleteUserAvailability); // Delete a specific availability slot

export default router;
