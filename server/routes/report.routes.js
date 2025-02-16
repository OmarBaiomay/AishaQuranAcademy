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

// Create a new report
router.post("/reports", protectRoute, createReport);

// Get all reports
router.get("/reports", protectRoute, getAllReports);

// Get a specific report by ID
router.get("/reports/:id", protectRoute, getReportById);

// Update a report
router.put("/reports/:id", protectRoute, updateReport);

// Delete a report
router.delete("/reports/:id", protectRoute, deleteReport);

export default router;
