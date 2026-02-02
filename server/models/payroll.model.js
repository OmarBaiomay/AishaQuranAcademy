import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timesheets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Timesheet' }],
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
  issuedAt: { type: Date, default: Date.now },
  paidAt: { type: Date, default: null },
  notes: { type: String, default: '' }
}, { timestamps: true });

const Payroll = mongoose.model('Payroll', payrollSchema);
export default Payroll;
