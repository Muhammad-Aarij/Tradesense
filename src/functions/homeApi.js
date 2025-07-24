// src/hooks/useHome.js
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { startLoading, stopLoading } from '../redux/slice/loaderSlice';
import { API_URL } from "@env";

const fetchRecommendations = async (userId) => {
    const response = await axios.get(`${API_URL}/api/resources/random/${userId}`);
    // console.log("Home", response);
    return response.data;
};

export const useHome = (userId) => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['home', userId],
        queryFn: async () => {
            return fetchRecommendations(userId);
        },
        enabled: !!userId,
        onSuccess: () => {
            dispatch(stopLoading()); // ✅ Stop loading on success
        },
        onError: () => {
            dispatch(stopLoading()); // ❌ Stop loading on error
        },
        retry: 1,
        refetchOnWindowFocus: false,
    });

};
