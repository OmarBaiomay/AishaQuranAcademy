import Payroll from '../models/payroll.model.js';
import Timesheet from '../models/timesheet.model.js';
import models from "../models/classroom.model.js";
import User from '../models/user.model.js'; 

// 📌 Create payroll manually for a teacher
export const createPayrollManually = async (req, res) => {
  try {
    const { teacherId } = req.params;

    // 🧾 Fetch all unpaid timesheets that need to be included
    const unpaidTimesheets = await Timesheet.find({
      payrollStatus: 'Unpaid',
      attendance: { $in: ['Attended', 'Student Absent'] }
    }).populate('classroom');

    // 🎯 Filter timesheets for this specific teacher
    const teacherTimesheets = unpaidTimesheets.filter(
      ts => ts.classroom?.teacher?.toString() === teacherId
    );

    if (!teacherTimesheets.length) {
      return res.status(200).json({ message: 'No unpaid timesheets for this teacher.' });
    }

    // 👤 Fetch teacher info to get their salary rate
    const teacher = await User.findById(teacherId);
    if (!teacher) throw new Error('Teacher not found');

    const salaryRate = Number(teacher.salaryRate || 0); // 💵 Hourly rate

    // 💰 Calculate total payroll amount
    const amount = teacherTimesheets.reduce((total, ts) => {
      const hours = ts.classDuration / 60;
      return total + (hours * salaryRate);
    }, 0);

    // 🧾 Create payroll document
    const payroll = new Payroll({
      teacher: teacherId,
      timesheets: teacherTimesheets.map(ts => ts._id),
      amount,
      notes: "Generated Manually"
    });

    await payroll.save();

    // 🔄 Mark timesheets as linked to a payroll
    await Timesheet.updateMany(
      { _id: { $in: teacherTimesheets.map(ts => ts._id) } },
      { $set: { payrollStatus: 'Pending' } } // You can use another status if preferred
    );

    res.status(201).json({ message: 'Payroll generated successfully ✅', payroll });

  } catch (error) {
    console.error('❌ Error generating payroll:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ✅ Mark payroll as paid
export const markPayrollAsPaid = async (req, res) => {
  try {
    const { payrollId } = req.params;

    const payroll = await Payroll.findByIdAndUpdate(
      payrollId,
      { status: 'Paid', paidAt: new Date() },
      { new: true }
    );

    if (!payroll) return res.status(404).json({ message: 'Payroll not found' });

    await Timesheet.updateMany(
      { _id: { $in: payroll.timesheets } },
      { $set: { payrollStatus: 'Paid' } }
    );

    res.status(200).json({ message: 'Payroll marked as paid ✅', payroll });
  } catch (error) {
    console.error('❌ Error marking payroll as paid:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 📄 Get all payrolls
export const getAllPayrolls = async (req, res) => {
  try {
    const { status, teacher, from, to, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (teacher) query.teacher = teacher;
    if (from || to) {
      query.issuedAt = {};
      if (from) query.issuedAt.$gte = new Date(from);
      if (to) query.issuedAt.$lte = new Date(to);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Payroll.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const payrolls = await Payroll.find(query)
      .populate('teacher', 'fullName email')
      .populate('timesheets')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      data: payrolls,
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages,
    });

  } catch (error) {
    console.error('❌ Error fetching payrolls:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 🔍 Get one payroll by ID
export const getPayrollById = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id)
      .populate('teacher', 'fullName email')
      .populate('timesheets');

    if (!payroll) return res.status(404).json({ message: 'Payroll not found' });

    res.status(200).json(payroll);
  } catch (error) {
    console.error('❌ Error fetching payroll:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 🗑️ Delete a payroll
export const deletePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndDelete(req.params.id);
    if (!payroll) return res.status(404).json({ message: 'Payroll not found' });

    await Timesheet.updateMany(
      { _id: { $in: payroll.timesheets } },
      { $set: { payrollStatus: 'Unpaid' } }
    );

    res.status(200).json({ message: 'Payroll deleted and timesheets reset ✅' });
  } catch (error) {
    console.error('❌ Error deleting payroll:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
