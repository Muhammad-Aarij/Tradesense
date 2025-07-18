import axios from 'axios';
import { API_URL } from "@env";
import { useDispatch } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
        console.log('Sending affiliate request for user:', userId);

        const response = await axios.post(`${API_URL}/api/affiliate/requests`, { userId });

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





// POST: Create a new payment
export const createPayment = async ({ userId, type, amount, accountNumber }) => {
    const payload = { userId, type, amount, accountNumber };

    try {
        const { data } = await axios.post(`${API_URL}/api/payment`, payload);
        return data;
    } catch (error) {
        const message = error?.response?.data?.message || error.message;
        console.error('Error creating payment:', message);
        throw new Error(message);
    }
};

export const fetchPayments = async (userId) => {
    try {
        const { data } = await axios.get(`${API_URL}/api/payment/${userId}`);
        console.log("✅ Payments fetched:", data);
        return data?.payments || [];
    } catch (error) {
        const message = error?.response?.data?.message || error.message;
        console.error('❌ Error fetching payments:', message);
        throw new Error(message);
    }
};

export const usePayments = (userId) => {
    const dispatch = useDispatch();

    console.log("🟡 Fetching payments for userId:", userId);

    return useQuery({
        queryKey: ['payments', userId],
        queryFn: () => fetchPayments(userId), // ✅ call fetchPayments with userId explicitly
        enabled: !!userId, // ✅ Only fetch if userId is available
        staleTime: 5 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        onSuccess: () => dispatch(stopLoading()),
        onError: () => dispatch(stopLoading()),
    });
};
export const useCreatePayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPayment,
        onSuccess: () => {
            // 🚀 Automatically refetch payments list
            queryClient.invalidateQueries({ queryKey: ['payments'] });
        },
        onError: (error) => {
            console.error('Payment creation failed:', error.message);
        },
    });
};






export const fetchAffiliateRecords = async (userId) => {
    try {
        const { data } = await axios.get(`${API_URL}/api/affiliate/records/${userId}`);
        return data || [];
    } catch (error) {
        const message = error?.response?.data?.message || error.message;
        console.error('Error fetching affiliate records:', message);
        throw new Error(message);
    }
};

export const useAffiliateRecords = (userId) => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['affiliateRecords', userId],
        queryFn: () => fetchAffiliateRecords(userId),
        enabled: !!userId, // run only if userId is available
        staleTime: 5 * 60 * 1000, // cache for 5 minutes
        retry: 2,
        refetchOnWindowFocus: false,
        onSuccess: () => dispatch(stopLoading()),
        onError: () => dispatch(stopLoading()),
    });
};


export const getAffiliateRequestStatus = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/api/affiliate/requests/${userId}`);
        const data = response.data;

        if (Array.isArray(data) && data.length > 0) {
            // Sort by createdAt and return the latest
            return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        }

        return null;
    } catch (error) {
        console.error('Error fetching affiliate request status:', error?.response?.data || error.message);
        throw error;
    }
};



export const useAffiliateRequestStatus = (userId) => {
    return useQuery({
        queryKey: ['affiliateRequestStatus', userId],
        queryFn: () => getAffiliateRequestStatus(userId),
        enabled: !!userId, // run only when userId exists
        retry: 1,
        refetchOnWindowFocus: false,
    });
};
