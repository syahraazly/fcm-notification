/* eslint-disable jsx-a11y/anchor-is-valid */
import { MessagePayload, onMessage } from "firebase/messaging";
import React, { useEffect, useState } from "react";
import "./App.css";
import { getFirebaseToken, messaging } from "./FirebaseConfig";


function App() {
  // const logo = require("./assets/sun.gif");

  const [open, setOpen] = useState(false);

  // To store notification data from firebase
  const [notificationPayload, setNotificationPayload] = useState(['']);

  // This is self invoking function that listen of the notification
  const onMessageListener = (async () => {
    const messagingResolve = await messaging;
    if (messagingResolve) {
      onMessage(messagingResolve, (payload) => {
        setNotificationPayload([{ data: payload, open: true }]);
        setTimeout(() => setNotificationPayload([{ open: false }]), 6000);
      });
    }
  })();

  const handleGetFirebaseToken = () => {
    getFirebaseToken().then((firebaseToken) => {
      if (firebaseToken) {
        console.log(firebaseToken);
      }
    });
  };

  // Need this handle FCM token generation when a user manually blocks or allows notification
  useEffect(() => {
    if (
      window.Notification?.permission === "granted"
    ) {
      handleGetFirebaseToken();
    }
  }, []);

  return (
    <div>
      <div className="App">
        {/* Used to notify user whether he has provided notification permissions or not */}
        {Notification.permission !== "granted" && (
          <div className="notification-banner">
            <span>The app needs permission to</span>
            <a
              href="#"
              className="notification-banner-link"
              onClick={handleGetFirebaseToken}
            >
              enable push notifications.
            </a>
          </div>
        )}
        <header>
          <h1 className="App-title">
            Web Push Notifications With React And Firebase
          </h1>
        </header>
        <div>
          <button
            className="Button"
            onClick={() => {
              setOpen(true);
              setTimeout(() => setOpen(false), 6000);
            }}
          >
            Show Web Push Notification
          </button>
        </div>

        {/* Rendering  Notification from firebase */}

        {notificationPayload.map((notification) => {
          return (
            <>
              {notification?.open && (
                <div className="notification">
                  <div className="push-notification-title">
                    <h1>{notification?.data?.notification?.title}</h1>
                    {/* <button
                      className="close-button"
                      onClick={() => 
                        setNotificationPayload([{ open: false }]);
                      }
                    >
                      X
                    </button> */}
                  </div>
                  <div>
                    <h1 className="push-notification-text">
                      {notification?.data?.notification?.body}
                    </h1>
                  </div>
                </div>
              )}
            </>
          );
        })}

        {/* Rendering Demo Notification */}

        {open && (
          <div
            className="notification"
            onClick={() => {
              setOpen(false);
            }}
          >
            <div className="push-notification-title">
              <h1>New Message</h1>
              <button
                className="close-button"
                onClick={() => {
                  setOpen(false);
                }}
              >
                X
              </button>
            </div>
            <div>
              <h1 className="push-notification-text">
                Hello Welcome, Today you will learn how to use
                firebase-notifications
              </h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;