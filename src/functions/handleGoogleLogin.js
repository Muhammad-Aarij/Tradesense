import axios from "axios";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { API_URL } from "@env";

GoogleSignin.configure({
    webClientId: "http://676593938687-l1o5s57r8mv16t9p2dsq4qk6hogpr36c.apps.googleusercontent.com"
});

const handleGoogleLogin = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();

        // Send token to backend API for authentication
        const response = await axios.get(`${API_URL}/api/auth/google`, {
            token: userInfo.idToken,
        });

        console.log("Google Login successful:", response.data);
        return response.data;
    } catch (error) {
        console.error("Google Login Error:", error);
        throw error;
    }
};

export default handleGoogleLogin;
