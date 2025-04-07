import express from "express";
import { processStudentPayment } from "../controllers/studentPayment.controller.js";

const router = express.Router();

router.post("/student-payments/:studentId", processStudentPayment);

export default router;
