import React, { useEffect } from "react";
import { Alert, Platform } from "react-native";
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

        // Only initialize Firebase if properly configured
        try {
          // Initialize Firebase if not already initialized
          if (!firebase.apps.length) {
            await firebase.initializeApp();
            console.log("✅ Firebase initialized");
          }

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
        } catch (firebaseError) {
          console.warn("⚠️ Firebase not configured properly:", firebaseError.message);
          console.warn("📝 To fix: Add GoogleService-Info.plist to iOS project");
        }
      } catch (error) {
        console.error("🔥 Error during initialization:", error.message);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    // Only set up messaging listener if Firebase is available
    let unsubscribe = () => {};
    
    try {
      if (firebase.apps.length > 0) {
        unsubscribe = messaging().onMessage(async remoteMessage => {
          if (remoteMessage?.notification) {
            Alert.alert(
              remoteMessage.notification.title || "New Notification",
              remoteMessage.notification.body || ""
            );
          }
        });
      }
    } catch (error) {
      console.warn("⚠️ Could not set up Firebase messaging listener:", error.message);
    }

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
