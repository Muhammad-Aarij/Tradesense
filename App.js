import React, { useEffect, useState, useRef } from "react";
import { Platform, AppState } from "react-native"; // Import AppState
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
import Purchases from 'react-native-purchases';

const queryClient = new QueryClient();

const App = () => {
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const setupRevenueCat = async () => {
            // ✅ Enable debug logs first
            // Purchases.setDebugLogsEnabled(true);
            // ✅ Then configure RevenueCat
            await Purchases.configure({
                apiKey: Platform.select({
                    ios: 'appl_oUpJQhOOMgTrruGSdHIbPStHUNm',
                    android: 'goog_NoUVHlSMLZnJLTGBDglGNAvuYyK',
                }),
                // Optional: appUserID: 'user_id_123'
            });
        };

        setupRevenueCat();
    }, []);

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

                await getFCMToken();

                messaging().setBackgroundMessageHandler(async remoteMessage => {
                    console.log('📩 [Background] Message handled:', remoteMessage);
                });

                // This listener handles the case where the user taps a notification to open the app from the background
                const unsubscribeOpenedApp = messaging().onNotificationOpenedApp(remoteMessage => {
                    console.log('📲 App opened from background by notification:', remoteMessage);
                    if (remoteMessage?.notification) {
                        setModalTitle(remoteMessage.notification.title || "Notification");
                        setModalMessage(remoteMessage.notification.body || "");
                        setModalVisible(true);
                    }
                });

                // This listener handles the case where the app is opened from a quit state via a notification
                const remoteMessage = await messaging().getInitialNotification();
                if (remoteMessage) {
                    console.log('🚀 App opened from quit by notification:', remoteMessage);
                    setModalTitle(remoteMessage.notification.title || "Notification");
                    setModalMessage(remoteMessage.notification.body || "");
                    setModalVisible(true);
                }

                return () => {
                    unsubscribeOpenedApp();
                };

            } catch (error) {
                console.error("🔥 Initialization error:", error.message);
            }
        };

        initialize();
    }, []);

    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log("📨 [Foreground] Notification received:", remoteMessage);
            // Only show the modal if the app is in the active state (i.e., foreground)
            if (appState.current === 'active' && remoteMessage?.notification) {
                setModalTitle(remoteMessage.notification.title || "Notification");
                setModalMessage(remoteMessage.notification.body || "");
                setModalVisible(true);
            }
        });

        // Add a listener to track app state changes
        const subscription = AppState.addEventListener('change', nextAppState => {
            appState.current = nextAppState;
        });

        return () => {
            unsubscribe();
            subscription.remove();
        };
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