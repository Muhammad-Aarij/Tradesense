import axios from 'axios';
import { API_URL } from "@env";


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


export const sendAffiliateRequest = async (userId) => {
    try {
        const response = await axios.post(`${API_URL}/api/affiliate/requests`, {
            userId: userId,
        });
        console.log('Affiliate request sent:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending affiliate request:', error.response?.data || error.message);
        throw error;
    }
};


export const getUserDetails = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/api/auth/users/${userId}`);
        console.log('User details:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching user details:', error.response?.data || error.message);
        throw error;
    }
};
