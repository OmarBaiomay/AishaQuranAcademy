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

/* 
    User Routes 
*/

// Create a new user
router.post('/user', protectRoute, createUser);

// Get all users or filter by role
router.get('/users', protectRoute, getUsers); 

// Get a specific user by ID
router.get('/user/:id', protectRoute, getUserById); 

// Update a user by ID
router.put('/user/:id', protectRoute, updateUser); 

// Delete a user by ID
router.delete('/user/:id', protectRoute, deleteUser); 


/* 
    Availability Routes
*/

// Update user availability
router.put('/user/:userId/availability/:availabilityId', protectRoute, updateUserAvailability);

// Add availability for a user
router.post('/user/:userId/availability', protectRoute, addUserAvailability);

// Get all availability for a user
router.get('/user/:userId/availability', protectRoute, getUserAvailability);

// Delete a specific availability slot
router.delete('/user/:userId/availability/:availabilityId', protectRoute, deleteUserAvailability);

/* 
    FCM Token Routes
*/

// Add FCM token for a user
router.post("/user/:userId/fcm-tokens", protectRoute, addFCMToken);

// Remove FCM token for a user
router.delete("/user/:userId/fcm-tokens/:token", protectRoute, removeFCMToken);

export default router;