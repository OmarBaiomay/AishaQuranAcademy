import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderRole: { type: String, enum: ['Student', 'Teacher', 'Supervisor', 'Administrator'], required: true },
  message: { type: String, default: '' },
  type: { type: String, enum: ['text', 'file', 'audio'], default: 'text' },
  fileUrl: { type: String, default: '' }, // For file/audio messages
  deliveredTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who received the message
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who read the message
  createdAt: { type: Date, default: Date.now }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage; 