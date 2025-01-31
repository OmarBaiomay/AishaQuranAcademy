import express from "express";
import { sendPushNotification, sendTopicNotification } from "../controllers/notificationController.js";

const router = express.Router();

router.post("/send-notification", sendPushNotification); // Send to a single device
router.post("/send-topic", sendTopicNotification); // Send to a topic

export default router;
