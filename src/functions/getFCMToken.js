import messaging from "@react-native-firebase/messaging";

export const getFCMToken = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const fcmToken = await messaging().getToken();
      console.log("✅ FCM Token:\n", fcmToken);
      return fcmToken;
    } else {
      console.log("🚫 Notification permission not granted.");
      return null;
    }
  } catch (error) {
    console.error("🔥 FCM token error:", error.message);
    return null;
  }
};
