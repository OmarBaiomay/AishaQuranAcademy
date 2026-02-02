import express from "express";
import { getAdminStats } from "../controllers/admin.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ Admin Dashboard Stats Route
router.get("/stats", protectRoute, getAdminStats);

export default router;
