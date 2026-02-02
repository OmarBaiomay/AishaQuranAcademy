import Invoice from '../models/invoice.model.js';
import Timesheet from '../models/timesheet.model.js';
import models from "../models/classroom.model.js";
const { Classroom } = models;

export const generateInvoiceForClassroom = async (classroomId) => {
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) throw new Error('Classroom not found');

  const lastDate = classroom.lastPaymentDate || new Date(0);

  // ✅ Only include attendance types that subtract credits and require payment
  const unpaidTimesheets = await Timesheet.find({
    classroom: classroomId,
    attendance: { $in: ['Attended', 'Student Absent'] },
    paymentStatus: 'Unpaid',
    date: { $gte: lastDate }
  }).sort({ date: 1 });

  if (unpaidTimesheets.length === 0) return null;

  const pricePerHour = Number(classroom.pricePerclassPerMonth || 0);

  const amount = unpaidTimesheets.reduce((total, ts) => {
    const hours = ts.classDuration / 60;
    return total + hours * pricePerHour;
  }, 0);


  const invoice = new Invoice({
    student: classroom.student,
    classroom: classroom._id,
    timesheets: unpaidTimesheets.map(ts => ts._id),
    amount,
    notes: "🤖 Created by AishaBoot"
  });

  await invoice.save();

  // 🟡 Mark as linked to an invoice (still unpaid)
  await Timesheet.updateMany(
    { _id: { $in: unpaidTimesheets.map(ts => ts._id) } },
    { $set: { paymentStatus: 'Unpaid' } }
  );

  console.log(`🧾 Invoice generated: ${unpaidTimesheets.length} classes × ${classroom.pricePerclassPerMonth} = $${amount}`);

  return invoice;
};
