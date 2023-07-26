import { initializeApp } from "firebase/app";
import { getToken, getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBNVKx5zdkoxR1gKh27FHoquD1jpWCRaNE",
  authDomain: "fcm-notification-dfa80.firebaseapp.com",
  projectId: "fcm-notification-dfa80",
  storageBucket: "fcm-notification-dfa80.appspot.com",
  messagingSenderId: "683829518327",
  appId: "1:683829518327:web:487821eae6a5e5dd3998f2",
};

export const firebaseApp = initializeApp(firebaseConfig);

export const messaging = getMessaging(firebaseApp);

// getOrRegisterServiceWorker function is used to try and get the service worker if it exists, otherwise it will register a new one.
export const getOrRegisterServiceWorker = () => {
  if (
    "serviceWorker" in navigator &&
    typeof window.navigator.serviceWorker !== "undefined"
  ) {
    return window.navigator.serviceWorker
      .getRegistration("/firebase-push-notification-scope")
      .then((serviceWorker) => {
        if (serviceWorker) return serviceWorker;
        return window.navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
          {
            scope: "/firebase-push-notification-scope",
          }
        );
      });
  }
  throw new Error("The browser doesn`t support service worker.");
};

// getFirebaseToken function generates the FCM token
export const getFirebaseToken = async () => {
  try {
    const messagingResolve = await messaging;
    if (messagingResolve) {
      return getOrRegisterServiceWorker().then((serviceWorkerRegistration) => {
        return Promise.resolve(
          getToken(messagingResolve, {
            vapidKey:
              "BP_5XqVDBFuyNEiv6Y6D0xieUTNpjlave6mRvemPTHrNMdC67BCC9DeuQkGrPfAHlDBcFfYFgnxUJehH2yYYgIM",
            serviceWorkerRegistration,
          })
        );
      });
    }
  } catch (error) {
    console.log("An error occurred while retrieving token. ", error);
  }
};


