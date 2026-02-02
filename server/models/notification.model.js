import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // e.g., 'chat', 'system', etc.
  title: { type: String, required: true },
  body: { type: String, required: true },
  data: { type: Object, default: {} }, // Additional payload (e.g., chat message info)
  read: { type: Boolean, default: false },
  readAt: { type: Date, default: null },
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification; 