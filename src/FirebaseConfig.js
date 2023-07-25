import { initializeApp } from "firebase/app";
import { getToken, getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDYX3kc9r_lN3i3bCQpK0MdBCYvyzD5bQo",
  authDomain: "notif-web-f9024.firebaseapp.com",
  projectId: "notif-web-f9024",
  storageBucket: "notif-web-f9024.appspot.com",
  messagingSenderId: "5655990252",
  appId: "1:5655990252:web:576e41a2fc2a9155aa7ac9",
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
              "BOTlY1i3cmIdDeGQlxo5b1TM2QOQFwrej_lvY8fAn291gxOGmTVNDI6UJnC4aLGb5FM-Z0AqrLo1EncYCYTR4S0",
            serviceWorkerRegistration,
          })
        );
      });
    }
  } catch (error) {
    console.log("An error occurred while retrieving token. ", error);
  }
};


