import axios from 'axios';
import { API_URL } from "@env";

// Replace this with your actual base URL or import from your config

export const trackAffiliateVisit = async ({ referrerUserId, courseId, type = "visited" }) => {
    try {
        const response = await axios.post(`${API_URL}/api/affiliate`, {
            referrerUserId,
            courseId,
            type
        });
        return response.data;
    } catch (error) {
        console.error('Affiliate tracking failed:', error.response?.data || error.message);
        return { error: true, details: error.response?.data || error.message };
    }
};
