import axios from "axios";
import { API_URL } from "@env"; // Ensure you have API_URL set in your .env file

// Function to send OTP
const sendOTP = async (email, registration = true,) => {
    try {
        console.log("Sending OTP to email:", email, "Registration:", registration);
        const response = await axios.post(`${API_URL}/api/otp/sendOTP`, {
            email: email,
            registeration: registration,         
            forgetPassword: !registration
        });
        console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error sending OTP:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Function to verify OTP
const verifyOTP = async (email, code) => {
    try {
        console.log("Verifying OTP for email:", email, "with OTP:", code);
        const response = await axios.post(`${API_URL}/api/otp/verifyOTP`, { email, code });
        return response.data;
    } catch (error) {
        console.error("Error verifying OTP:", error.response ? error.response.data : error.message);
        throw error;
    }
};


export { sendOTP, verifyOTP };
