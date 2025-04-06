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
    createFirstPassword,
    requestPasswordReset,
    resetPasswordWithToken,
    updateUserPassword,
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
    Password Routes
*/

// Create the first password for a user
router.post("/user/:userId/create-password", createFirstPassword);

// Request password reset
// This route is used when the user requests a password reset
// It sends an email with a reset link to the user
router.post("/user/request-password-reset", requestPasswordReset);

// Reset password with token
// This route is used when the user clicks the link in the password reset email
router.post("/user/reset-password-with-token", resetPasswordWithToken);

// Update user password
// This route is used to update the user's password after they have logged in
// It requires the user to be authenticated (protected route)
router.put("/user/:userId/password", protectRoute, updateUserPassword);



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