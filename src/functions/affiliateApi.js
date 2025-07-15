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
    console.log('++++++++++++++++++++++++++++', );
    try {
        console.log('++++++++++++++++++++++++++++', );
        console.log('Sending affiliate request for user:', userId);

        const response = await axios.post(`${API_URL}/api/affiliate/requests/${userId}`);

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

// GET: Fetch all payments
export const fetchPayments = async () => {
    try {
        const { data } = await axios.get(`${API_URL}/api/payment`);
        return data?.payments || [];
    } catch (error) {
        const message = error?.response?.data?.message || error.message;
        console.error('Error fetching payments:', message);
        throw new Error(message);
    }
};



export const usePayments = () => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['payments'],
        queryFn: fetchPayments,
        staleTime: 5 * 60 * 1000, // cache for 5 minutes
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
    console.log('====================================');
    console.log("Affiliate Id",userId);
    console.log('====================================');
  try {
    const response = await axios.get(`${API_URL}/api/affiliate/requests/${userId}`);
    console.log("Affiliate Status", response);
    return response.data; // Expecting an array like [{ status: "pending" }]
  } catch (error) {
    console.error('Error fetching affiliate request status:', error);
    throw error;
  }
};