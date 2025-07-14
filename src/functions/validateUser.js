import axios from 'axios';
import { API_URL } from "@env";

const validateUser = async (email, phone) => {
    try {
        console.log("Validating user with email:", email, "and phone:", phone);
        const response = await axios.post(`${API_URL}/api/auth/validate-user`, {
            email,
            phone,
        });
        return response.data;
    } catch (error) {
        console.error("User validation error:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export default validateUser; 