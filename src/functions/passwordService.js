import axios from "axios";
import { API_URL } from "@env"; // Ensure API_URL is in your .env file

// Function to send password reset email
const sendResetEmail = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/forget-password/email`, { email });
        return response.data;
    } catch (error) {
        console.error("Error sending password reset email:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Function to reset the password using a token
const resetPassword = async (token, newPassword) => {
    try {
        const response = await axios.patch(`${API_URL}/api/auth/forget-password/create/new`, {
            token,
            password: newPassword,
        });
        return response.data;
    } catch (error) {
        console.error("Error resetting password:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export { sendResetEmail, resetPassword };
