import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyB8owTj4S1_3hV9p_5_ahHxs6p8KNiqRAA",
    authDomain: "aisha-notify.firebaseapp.com",
    projectId: "aisha-notify",
    storageBucket: "aisha-notify.firebasestorage.app",
    messagingSenderId: "289805320736",
    appId: "1:289805320736:web:a74a10e7c2d52a95d73245",
    measurementId: "G-HMC1FSXMHV"
};

const vapidkay = "BLPRb5zGfRnyF-8USZOZsY75vTXWCkGfcOMbbv4dl3oQ4zgccp7-D8DcXy4CA3nhvV2Z7WrVTC9BXxypwhhdd0A";

const app = initializeApp(firebaseConfig)

const messaging = getMessaging(app);

export const requestFCMToken = async () => {
    return Notification.requestPermission()
    .then((permission) => {
        if(permission == "granted"){
            return getToken(messaging, {vapidkay})
        }else{
            throw new Error("Notification Not Granted");
        }
    })
    .catch((err) => {
        console.error("Error getting FCM token : ", err)
        throw err;
    })  
}