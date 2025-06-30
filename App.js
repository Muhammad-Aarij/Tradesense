import React, { useEffect } from "react";
import { Alert } from "react-native";
import store from "./src/redux/store/store";
import { Provider } from "react-redux";
import AppNavContainer from "./src/navigation";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from "@env";
import { ThemeProvider } from "./src/context/ThemeProvider";
import AuthProvider from "./src/context/AuthProvider";
import messaging from "@react-native-firebase/messaging";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const initialize = async () => {
      try {
        // Google Sign-In config
        GoogleSignin.configure({
          webClientId: GOOGLE_WEB_CLIENT_ID,
          iosClientId: GOOGLE_IOS_CLIENT_ID,
          scopes: ["profile", "email"],
        });

        // Request push notification permission
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          const fcmToken = await messaging().getToken();
          console.log("✅ FCM Token:", fcmToken);
          // You can store/send token to backend here
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
        Alert.alert(
          remoteMessage.notification.title || "New Notification",
          remoteMessage.notification.body || ""
        );
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <AppNavContainer />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
