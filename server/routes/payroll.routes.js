import express from 'express';
import { createPayrollManually, markPayrollAsPaid, getAllPayrolls, getPayrollById, deletePayroll } from '../controllers/payroll.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// 💸 Generate payroll manually for a teacher
router.post('/generate/:teacherId', protectRoute, createPayrollManually);

// ✅ Mark a payroll as paid
router.post('/mark-paid/:payrollId', protectRoute, markPayrollAsPaid);

// 📄 Get all payrolls
router.get('/', protectRoute, getAllPayrolls);

// 📄 Get one payroll by ID
router.get('/:id', protectRoute, getPayrollById);

// ❌ Delete a payroll
router.delete('/:id', protectRoute, deletePayroll);

export default router;
