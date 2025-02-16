import express from "express";
import {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
} from "../controllers/report.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ Fix: Ensure POST route is correctly defined
router.post("/reports", protectRoute, createReport);
router.get("/reports", protectRoute, getAllReports);
router.get("/reports/:id", protectRoute, getReportById);
router.put("/reports/:id", protectRoute, updateReport);
router.delete("/reports/:id", protectRoute, deleteReport);

export default router;
