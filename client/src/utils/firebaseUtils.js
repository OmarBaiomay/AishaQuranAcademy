import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getMessaging,
  getToken,
  isSupported,
} from "firebase/messaging";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB8owTj4S1_3hV9p_5_ahHxs6p8KNiqRAA",
  authDomain: "aisha-notify.firebaseapp.com",
  projectId: "aisha-notify",
  storageBucket: "aisha-notify.firebasestorage.app",
  messagingSenderId: "289805320736",
  appId: "1:289805320736:web:a74a10e7c2d52a95d73245",
  measurementId: "G-HMC1FSXMHV",
};

const vapidKey =
  "BLPRb5zGfRnyF-8USZOZsY75vTXWCkGfcOMbbv4dl3oQ4zgccp7-D8DcXy4CA3nhvV2Z7WrVTC9BXxypwhhdd0A";

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Only use messaging if supported
let messaging;
const messagingPromise = isSupported()
  .then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
      return messaging;
    } else {
      console.warn("Firebase Messaging is not supported in this browser.");
      return null;
    }
  })
  .catch((err) => {
    console.error("Error checking Firebase messaging support:", err);
    return null;
  });

// ✅ Export safe token request function
export const requestFCMToken = async () => {
  try {
    const supportedMessaging = await messagingPromise;
    if (!supportedMessaging) throw new Error("Messaging not supported");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Notification permission not granted");
    }

    const token = await getToken(supportedMessaging, { vapidKey });
    return token;
  } catch (err) {
    console.error("Error getting FCM token:", err);
    throw err;
  }
};
