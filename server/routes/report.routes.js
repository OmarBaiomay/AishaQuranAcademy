import express from "express";
import {
    getAllReports,
    getReportById,
    createReport,
    updateReport,
    deleteReport
} from "../controllers/report.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ Get all reports
router.get("/reports", protectRoute, getAllReports);

// ✅ Get a single report
router.get("/reports/:id", protectRoute, getReportById);

// ✅ Create a new report
router.post("/reports", protectRoute, createReport);

// ✅ Update a report
router.put("/reports/:id", protectRoute, updateReport);

// ✅ Delete a report
router.delete("/reports/:id", protectRoute, deleteReport);

export default router;
