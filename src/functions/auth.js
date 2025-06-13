import axios from "axios";
import { API_URL } from "@env";
const loginApi = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/login`, {
            email,
            password,
        });
        console.log("Login successful:", response.data);
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};

export default loginApi;
