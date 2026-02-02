import express from 'express';
import {
  getAllInvoices,
  getInvoiceById,
  createInvoiceIfNeeded,
  markInvoiceAsPaid,
  deleteInvoice,
  createManualInvoice
} from '../controllers/invoice.controller.js';

const router = express.Router();

// 🔁 Get all invoices (with filters)
router.get('/', getAllInvoices);

// 📄 Get single invoice
router.get('/:id', getInvoiceById);

// 🧾 Generate invoice for a classroom
router.post('/generate/:classroomId', createInvoiceIfNeeded);
router.post('/manual/:classroomId', createManualInvoice);

// 💳 Mark invoice as paid
router.post('/mark-paid/:invoiceId', markInvoiceAsPaid);

// 🗑️ Optional: Delete invoice
router.delete('/:id', deleteInvoice);

export default router;
