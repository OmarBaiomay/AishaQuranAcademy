import admin from "../config/firebase.js"

/**
 * Sends a push notification to a specific device using FCM.
 * @param {string} token - The FCM token of the recipient device.
 * @param {string} title - The title of the notification.
 * @param {string} body - The message body.
 * @param {object} [data] - Additional data payload (optional).
 */
export const sendNotification = async (token, title, body, data = {}) => {
  const message = {
    notification: {
      title,
      body,
    },
    data, // Custom data payload (optional)
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent successfully:", response);
    return { success: true, response };
  } catch (error) {
    console.error("Error sending notification:", error);
    return { success: false, error };
  }
};

/**
 * Sends a push notification to multiple devices (Topic-based).
 * @param {string} topic - The topic name to which multiple devices are subscribed.
 * @param {string} title - The title of the notification.
 * @param {string} body - The message body.
 * @param {object} [data] - Additional data payload (optional).
 */
export const sendNotificationToTopic = async (topic, title, body, data = {}) => {
  const message = {
    notification: {
      title,
      body,
    },
    data,
    topic,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log(`Notification sent to topic '${topic}':`, response);
    return { success: true, response };
  } catch (error) {
    console.error(`Error sending notification to topic '${topic}':`, error);
    return { success: false, error };
  }
};

/**
 * Subscribes a device token to a topic.
 * @param {string} token - The FCM token of the device.
 * @param {string} topic - The topic name.
 */
export const subscribeToTopic = async (token, topic) => {
  try {
    await admin.messaging().subscribeToTopic(token, topic);
    console.log(`Subscribed token to topic: ${topic}`);
    return { success: true };
  } catch (error) {
    console.error("Error subscribing to topic:", error);
    return { success: false, error };
  }
};

/**
 * Unsubscribes a device token from a topic.
 * @param {string} token - The FCM token of the device.
 * @param {string} topic - The topic name.
 */
export const unsubscribeFromTopic = async (token, topic) => {
  try {
    await admin.messaging().unsubscribeFromTopic(token, topic);
    console.log(`Unsubscribed token from topic: ${topic}`);
    return { success: true };
  } catch (error) {
    console.error("Error unsubscribing from topic:", error);
    return { success: false, error };
  }
};
