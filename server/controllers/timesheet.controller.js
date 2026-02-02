import mongoose from 'mongoose';
import Timesheet from '../models/timesheet.model.js';
import models from "../models/classroom.model.js";
const { Classroom } = models;
import { generateInvoiceForClassroom } from '../helpers/invoiceHelper.js';

// ✅ Helper: Calculate Credit Change
const calculateCreditChange = (attendance) => {
  switch (attendance) {
    case 'Student Absent':
    case 'Attended':
    case 'Make up Class':
      return -1;
    case 'Student Excused':
    case 'Teacher Excused':
    case 'Teacher Absent':
    default:
      return 0;
  }
};

// ✅ Controller: Add Timesheet Entry
export const addTimesheetEntry = async (req, res) => {
  try {
    const { class_id, classSessionId } = req.params; // ✅ updated to match your route
    console.log(req.params);
    const {
      day,
      date,
      classDuration, // e.g. 30, 45, 60
      classStatus,
      attendance,
      classActivity,
      nextClassHW,
      assessment,
      teachersNotes,
      paymentStatus = "Unpaid",  // ✅ default to Unpaid if not provided
      payrollStatus = "Unpaid"   // ✅ default to Unpaid if not provided
    } = req.body;

    // 🔍 Validate & Fetch classroom
    const classroom = await Classroom.findById(class_id);
    if (!classroom) return res.status(404).json({ message: 'Classroom not found' });

    // ✅ Validate classSessionId exists inside classroom.classes[]
    const matchedClass = classroom.classes.find(cls => cls._id.toString() === classSessionId);
    if (!matchedClass) {
      return res.status(400).json({ message: 'Invalid classSessionId. Class not found in classroom.' });
    }

    const rate = Number(classroom.pricePerclassPerMonth || 0);
    const durationMinutes = Number(classDuration);
    const durationFactor = durationMinutes / 60;

    // 🧮 Calculate amounts
    const calculatedPayment = durationFactor * rate;
    const calculatedPayroll = durationFactor * rate;

    // ➖ Subtract credit if needed
    const creditChange = calculateCreditChange(attendance);
    if (classroom.credits + creditChange < 0) {
      return res.status(400).json({ message: 'Insufficient credits for this action' });
    }
    classroom.credits += creditChange;
    await classroom.save();

    // 📝 Create timesheet entry
    const newTimesheetEntry = new Timesheet({
      classroom: new mongoose.Types.ObjectId(class_id),
      classSession: new mongoose.Types.ObjectId(classSessionId),
      day,
      date,
      classDuration: durationMinutes,
      classStatus,
      attendance,
      creditChange,
      classActivity,
      nextClassHW,
      assessment,
      teachersNotes,
      paymentAmount: calculatedPayment,
      payrollAmount: calculatedPayroll,
      paymentStatus,
      payrollStatus
    });

    await newTimesheetEntry.save();

    // 🧾 Auto-generate invoice if credits are now 0
    if (classroom.credits === 0) {
      await generateInvoiceForClassroom(classroom._id);
    }

    return res.status(201).json({
      message: 'Timesheet entry added successfully ✅',
      data: newTimesheetEntry
    });

  } catch (error) {
    console.error('❌ Error adding timesheet entry:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


// ✅ Controller: Get Timesheets by Class Session
export const getTimesheetsByClassSession = async (req, res) => {
  try {
    const { classSessionId } = req.params;

    const timesheets = await Timesheet.find({ classSession: classSessionId })
      .sort({ date: -1 });

    res.status(200).json(timesheets);
  } catch (error) {
    console.error('❌ Error fetching timesheets for class session:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// ✏️ Update Timesheet Entry
export const updateTimesheetEntry = async (req, res) => {
  try {
    const { timesheetId } = req.params;
    const updates = req.body;

    const existing = await Timesheet.findById(timesheetId);
    if (!existing) return res.status(404).json({ message: 'Timesheet not found' });

    Object.assign(existing, updates);
    await existing.save();

    res.status(200).json({
      message: 'Timesheet updated successfully ✅',
      data: existing
    });

  } catch (error) {
    console.error('❌ Error updating timesheet:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

