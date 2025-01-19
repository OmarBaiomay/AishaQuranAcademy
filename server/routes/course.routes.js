import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";

import upload from "../lib/multer.js"; // Import the u --pdated Multer configuration
import { protectRoute } from "../middleware/auth.middleware.js";


const router = express.Router();

// Create a new course
router.post("/courses", protectRoute, upload.single("image"), createCourse);

// Get all courses
router.get("/courses", getAllCourses);

// Get a single course by ID
router.get("/courses/:id", getCourseById);

// Update a course
router.put("/courses/:id", protectRoute, updateCourse);

// Delete a course
router.delete("/courses/:id", protectRoute, deleteCourse);

export default router;
