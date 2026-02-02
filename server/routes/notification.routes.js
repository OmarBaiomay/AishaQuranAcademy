import express from "express";
import { sendPushNotification, sendTopicNotification, getUserNotifications, markNotificationRead, deleteNotification } from "../controllers/notificationController.js";
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/send-notification", sendPushNotification); // Send to a single device
router.post("/send-topic", sendTopicNotification); // Send to a topic

// Notification management routes
router.get('/my', protectRoute, getUserNotifications);
router.patch('/:id/read', protectRoute, markNotificationRead);
router.delete('/:id', protectRoute, deleteNotification);

export default router;
