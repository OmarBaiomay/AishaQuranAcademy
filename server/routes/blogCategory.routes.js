import express from "express";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  createTag,
  getAllTags,
  updateTag,
  deleteTag
} from "../controllers/blogCategory.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// 🌟 Categories Routes
router.post("/categories", protectRoute, createCategory);
router.get("/categories", getAllCategories);
router.put("/categories/:id", protectRoute, updateCategory);
router.delete("/categories/:id", protectRoute, deleteCategory);

// 🏷 Tags Routes
router.post("/tags", protectRoute, createTag);
router.get("/tags", getAllTags);
router.put("/tags/:id", protectRoute, updateTag);
router.delete("/tags/:id", protectRoute, deleteTag);

export default router;
