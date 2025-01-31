importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

firebase.initializeApp({
    apiKey: "AIzaSyB8owTj4S1_3hV9p_5_ahHxs6p8KNiqRAA",
    authDomain: "aisha-notify.firebaseapp.com",
    projectId: "aisha-notify",
    storageBucket: "aisha-notify.firebasestorage.app",
    messagingSenderId: "289805320736",
    appId: "1:289805320736:web:a74a10e7c2d52a95d73245",
    measurementId: "G-HMC1FSXMHV"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);
});
