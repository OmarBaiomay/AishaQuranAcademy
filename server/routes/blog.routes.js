import express from "express";
import multer from "multer"; // For file uploads
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

// Configure Multer for image uploads
const upload = multer({ dest: "uploads/" });

// Blog routes
router.post("/blogs", upload.single("image"), protectRoute, createBlog); // Create a blog
router.get("/blogs", getAllBlogs); // Get all blogs
router.get("/blogs/:id", getBlogById); // Get a single blog by ID
router.put("/blogs/:id", upload.single("image"), protectRoute, updateBlog); // Update a blog
router.delete("/blogs/:id", protectRoute,deleteBlog); // Delete a blog

export default router;
