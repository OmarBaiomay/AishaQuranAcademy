import { sendNotification, sendNotificationToTopic } from "../services/NotificationService.js";

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
