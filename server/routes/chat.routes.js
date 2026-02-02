import express from 'express';
import { 
  getClassroomMessages,
  getUnreadCount,
  getLastMessage,
  markClassroomAsRead,
  getUserClassrooms,
  getChatStats
} from '../controllers/chat.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// 🔥 IMPORTANT: All routes MUST use protectRoute middleware
router.get('/chat/:classroomId/messages', protectRoute, getClassroomMessages);
router.get('/chat/:classroomId/unread-count', protectRoute, getUnreadCount);
router.get('/chat/:classroomId/last-message', protectRoute, getLastMessage);
router.put('/chat/:classroomId/mark-read', protectRoute, markClassroomAsRead);
router.get('/chat/classrooms', protectRoute, getUserClassrooms);
router.get('/chat/stats', protectRoute, getChatStats);

export default router;