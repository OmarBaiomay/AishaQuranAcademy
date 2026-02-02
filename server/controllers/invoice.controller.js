import Invoice from '../models/invoice.model.js';
import Timesheet from '../models/timesheet.model.js';
import models from '../models/classroom.model.js';
import { generateInvoiceForClassroom } from '../helpers/invoiceHelper.js';
const { Classroom } = models;

// 🔁 GET /api/invoices
export const getAllInvoices = async (req, res) => {
  try {
    const { status, student, classroom, from, to, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (student) query.student = student;
    if (classroom) query.classroom = classroom;
    if (from || to) {
      query.issuedAt = {};
      if (from) query.issuedAt.$gte = new Date(from);
      if (to) query.issuedAt.$lte = new Date(to);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Invoice.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const invoices = await Invoice.find(query)
      .populate('student', 'fullName email')
      .populate('classroom', 'zoomLink teacher')
      .populate('timesheets')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      data: invoices,
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages,
    });
  } catch (error) {
    console.error('❌ Error fetching invoices:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// 📄 GET /api/invoices/:id
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('student', 'fullName email')
      .populate('classroom', 'zoomLink teacher')
      .populate('timesheets');

    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    res.status(200).json(invoice);
  } catch (error) {
    console.error('❌ Error fetching invoice:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 🧾 POST /api/invoices/generate/:classroomId
export const createInvoiceIfNeeded = async (req, res) => {
  try {
    const { classroomId } = req.params;
    const invoice = await generateInvoiceForClassroom(classroomId);

    if (!invoice) {
      return res.status(200).json({ message: 'No invoice needed. All sessions are paid.' });
    }

    res.status(201).json({ message: 'Invoice generated successfully ✅', invoice });
  } catch (error) {
    console.error('❌ Error generating invoice:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 💳 POST /api/invoices/mark-paid/:invoiceId
export const markInvoiceAsPaid = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await Invoice.findByIdAndUpdate(invoiceId, {
      status: 'Paid',
      paidAt: new Date()
    }, { new: true });

    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    await Timesheet.updateMany(
      { _id: { $in: invoice.timesheets } },
      { $set: { paymentStatus: 'Paid' } }
    );

    const classroom = await Classroom.findById(invoice.classroom);
    classroom.credits = classroom.numberOfClassesPerMonth;
    classroom.lastPaymentDate = new Date();
    await classroom.save();

    res.status(200).json({ message: 'Invoice marked as paid ✅', invoice });
  } catch (error) {
    console.error('❌ Error marking invoice as paid:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 🗑️ DELETE /api/invoices/:id
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    // Optionally reset timesheets to unpaid
    await Timesheet.updateMany(
      { _id: { $in: invoice.timesheets } },
      { $set: { paymentStatus: 'Unpaid' } }
    );

    res.status(200).json({ message: 'Invoice deleted and timesheets reset ✅' });
  } catch (error) {
    console.error('❌ Error deleting invoice:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const createManualInvoice = async (req, res) => {
  try {
    const { classroomId } = req.params;

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) return res.status(404).json({ message: "Classroom not found" });

    // ⏱️ Fetch all unpaid, attended timesheets not yet linked to an invoice
    const timesheets = await Timesheet.find({
      classroom: classroomId,
      attendance: "Attended",
      paymentStatus: { $ne: "Paid" }
    });

    if (!timesheets.length) {
      return res.status(400).json({ message: "No attended classes to bill" });
    }

    const pricePerHour = Number(classroom.pricePerclassPerMonth || 0);

    const totalAmount = timesheets.reduce((total, ts) => {
      const hours = ts.classDuration / 60;
      return total + hours * pricePerHour;
    }, 0);


    const invoice = await Invoice.create({
      classroom: classroom._id,
      student: classroom.student,
      timesheets: timesheets.map(t => t._id),
      amount: totalAmount,
      status: "Unpaid",
      issuedAt: new Date(),
      notes: "📝 Manually created by admin"
    });

    await Timesheet.updateMany(
      { _id: { $in: timesheets.map(t => t._id) } },
      { paymentStatus: "Invoiced" }
    );

    res.status(201).json({ message: "Manual invoice created successfully ✅", invoice });
  } catch (error) {
    console.error("❌ Error creating manual invoice:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};