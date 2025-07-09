import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import messaging from "@react-native-firebase/messaging";
import AppNavContainer from "./src/navigation";
import ConfirmationModal from "./src/components/ConfirmationModal";
import { ThemeProvider } from "./src/context/ThemeProvider";
import AuthProvider from "./src/context/AuthProvider";
import store from "./src/redux/store/store";

const queryClient = new QueryClient();

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const initialize = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          const fcmToken = await messaging().getToken();
          console.log("✅ FCM Token:", fcmToken);
        } else {
          console.log("🚫 Notification permission not granted.");
        }
      } catch (error) {
        console.error("🔥 Error during FCM setup:", error.message);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage?.notification) {
        setModalTitle(remoteMessage.notification.title || "New Notification");
        setModalMessage(remoteMessage.notification.body || "");
        setShowModal(true);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <ConfirmationModal
              isVisible={showModal}
              title={modalTitle}
              message={modalMessage}
              onClose={() => setShowModal(false)}
            />
            <AppNavContainer />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
