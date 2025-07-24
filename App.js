import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import store from "./src/redux/store/store";
import { Provider } from "react-redux";
import AppNavContainer from "./src/navigation";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from "@env";
import { ThemeProvider } from "./src/context/ThemeProvider";
import AuthProvider from "./src/context/AuthProvider";
import firebase from "@react-native-firebase/app";
import messaging from "@react-native-firebase/messaging";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ConfirmationModal from './src/components/ConfirmationModal';
import { notificationIcon } from "./src/assets/images";
import { getFCMToken } from "./src/functions/getFCMToken";

const queryClient = new QueryClient();

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const initialize = async () => {
      try {
        GoogleSignin.configure({
          webClientId: GOOGLE_WEB_CLIENT_ID,
          iosClientId: GOOGLE_IOS_CLIENT_ID,
          scopes: ["profile", "email"],
        });

        if (!firebase.apps.length) {
          await firebase.initializeApp();
          console.log("✅ Firebase initialized");
        }

        await getFCMToken(); // ✅ Extracted function


        messaging().setBackgroundMessageHandler(async remoteMessage => {
          console.log('📩 [Background] Message handled:', remoteMessage);
        });

        messaging().onNotificationOpenedApp(remoteMessage => {
          console.log('📲 App opened from background by notification:', remoteMessage);
          if (remoteMessage?.notification) {
            setModalTitle(remoteMessage.notification.title || "Notification");
            setModalMessage(remoteMessage.notification.body || "");
            setModalVisible(true);
          }
        });

        messaging()
          .getInitialNotification()
          .then(remoteMessage => {
            if (remoteMessage) {
              console.log('🚀 App opened from quit by notification:', remoteMessage);
              setModalTitle(remoteMessage.notification.title || "Notification");
              setModalMessage(remoteMessage.notification.body || "");
              setModalVisible(true);
            }
          });

      } catch (error) {
        console.error("🔥 Initialization error:", error.message);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("📨 [Foreground] Notification received:", remoteMessage);
      if (remoteMessage?.notification) {
        setModalTitle(remoteMessage.notification.title || "Notification");
        setModalMessage(remoteMessage.notification.body || "");
        setModalVisible(true);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            {modalVisible &&
              <ConfirmationModal
                title={modalTitle}
                message={modalMessage}
                icon={notificationIcon}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
              />}
            <AppNavContainer />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
