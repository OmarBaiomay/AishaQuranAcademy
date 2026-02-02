import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  toggleBlogPublish,
  getBlogBySlug,
  getRelatedBlogs,
  getPopularBlogs,
  incrementBlogView,
  getBlogArchives,
  getBlogViewAnalytics, // ✅ new
} from "../controllers/blog.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// 🔓 Public routes
router.get('/blogs', getAllBlogs);
router.get("/blogs/slug/:slug", getBlogBySlug);
router.post("/blogs/view/:slug", incrementBlogView);
router.get("/blogs/popular", getPopularBlogs);
router.get("/blogs/archives", getBlogArchives);
router.get("/blogs/views/analytics", getBlogViewAnalytics);

router.get('/blogs/:id', getBlogById);
router.get("/blogs/related/:id", getRelatedBlogs);


// 🔒 Protected routes
router.post('/blogs/create', protectRoute, createBlog);
router.post('/blogs/create-from-make', createBlog);
router.put('/blogs/:id', protectRoute, updateBlog);
router.patch('/blogs/toggle-publish/:id', protectRoute, toggleBlogPublish); // ✅ NEW
router.delete('/blogs/delete/:id', protectRoute, deleteBlog);

export default router;
