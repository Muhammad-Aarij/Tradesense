import axios from 'axios';
import { API_URL } from "@env";

const registerUser = async (userData) => {
    try {
        // console.log("Registering user with data:", userData);
        const response = await axios.post(`${API_URL}/api/auth/register`, userData);
        return response.data;
    } catch (error) {
        console.error("Registration Error:", error.response ? error.response.data : error.message);
        return null;
    }
};

export default registerUser;
