import { sendNotification, sendNotificationToTopic } from "../services/NotificationService.js";
import Notification from '../models/notification.model.js';

/**
 * API Endpoint: Send notification to a single device.
 */
export const sendPushNotification = async (req, res) => {
  const { token, title, body, data } = req.body;

  if (!token || !title || !body) {
    return res.status(400).json({ error: "Missing required fields: token, title, body" });
  }

  const response = await sendNotification(token, title, body, data);
  res.status(response.success ? 200 : 500).json(response);
};

/**
 * API Endpoint: Send notification to a topic (multiple devices).
 */
export const sendTopicNotification = async (req, res) => {
  const { topic, title, body, data } = req.body;

  if (!topic || !title || !body) {
    return res.status(400).json({ error: "Missing required fields: topic, title, body" });
  }

  const response = await sendNotificationToTopic(topic, title, body, data);
  res.status(response.success ? 200 : 500).json(response);
};

// List notifications for the authenticated user
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: err.message });
  }
};

// Mark a notification as read
export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    if (!notification.read) {
      notification.read = true;
      notification.readAt = new Date();
      await notification.save();
    }
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark as read', error: err.message });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete notification', error: err.message });
  }
};
