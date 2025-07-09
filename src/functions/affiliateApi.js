import axios from 'axios';
import { API_URL } from "@env";
import { useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { startLoading, stopLoading } from '../redux/slice/loaderSlice';

export const trackAffiliateVisit = async ({ referrerUserId, courseId, type = "visited" }) => {
    try {
        console.log(`referrerUserId: ${referrerUserId}\ncourseId: ${courseId}\ntype: ${type}`);
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
        console.log(userId);
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
        const { affiliateCode, isAffiliate } = response.data.user;
        return { affiliateCode, isAffiliate };
    } catch (error) {
        console.error('Error fetching user details:', error.response?.data || error.message);
        throw error;
    }
};




const fetchAffiliateStats = async (userId) => {
    console.log(userId);
    const response = await axios.get(`${API_URL}/api/affiliate/${userId}`);
    console.log('Response from fetchAffiliateStats:', response.data);
    return response.data;
};

export const useAffiliateStats = (userId) => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['affiliateStats', userId],
        queryFn: () => fetchAffiliateStats(userId),
        enabled: !!userId,
        onSuccess: () => dispatch(stopLoading()),
        onError: () => dispatch(stopLoading()),
        retry: 1,
        refetchOnWindowFocus: false,
    });
};
