import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
  timesheets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Timesheet' }],
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
  issuedAt: { type: Date, default: Date.now },
  paidAt: { type: Date, default: null },
  notes: { type: String, default: '' }
}, { timestamps: true });

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
