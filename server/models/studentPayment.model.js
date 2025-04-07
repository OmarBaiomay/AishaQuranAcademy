import mongoose from "mongoose";

const studentPaymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  classIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true }],
  totalAmount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  method: { type: String, enum: ["Manual", "PayPal", "Stripe"], default: "Manual" },
  status: { type: String, enum: ["Paid", "Pending"], default: "Paid" },
}, { timestamps: true });

const StudentPayment = mongoose.model("StudentPayment", studentPaymentSchema);
export default StudentPayment;
