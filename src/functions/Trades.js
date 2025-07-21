import { API_URL } from "@env";
import axios from 'axios';

// Submit a new trade form
export const submitTradeForm = async (tradeData) => {
    try {
        const response = await axios.post(`${API_URL}/api/trading-form`, tradeData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Trade form submission failed:', error.response?.data || error.message);
        throw error;
    }
};

// Fetch all trade records for a user
export const fetchTradeRecords = async (userId) => {
    const { data } = await axios.get(`${API_URL}/api/trading-form/${userId}`);
    return data.map(trade => ({
        stockName: trade.stockName,
        _id: trade._id,
        tradeDate: trade.tradeDate,
        tradeType: trade.tradeType,
        setupName: trade.setupName,
        direction: trade.direction,
        entryPrice: trade.entryPrice,
        exitPrice: trade.exitPrice,
        quantity: trade.quantity,
        stopLoss: trade.stopLoss,
        takeProfitTarget: trade.takeProfitTarget,
        actualExitPrice: trade.actualExitPrice,
        result: trade.result,
        emotionalState: trade.emotionalState,
        notes: trade.notes,
        image: trade.image,
        createdAt: trade.createdAt,
    }));
};

// Fetch weekly profit/loss graph data
export const fetchWeeklyProfitLoss = async (userId) => {
    const response = await fetch(`${API_URL}/api/trading-form/graph/${userId}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data;
};
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { stopLoading } from '../redux/slice/loaderSlice';


// Custom hook to get trade records
export const useTradeRecords = (userId) => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['tradeRecords', userId],
        queryFn: () => fetchTradeRecords(userId),
        enabled: !!userId,
        onSuccess: () => dispatch(stopLoading()),
        onError: () => dispatch(stopLoading()),
        retry: 1,
        refetchOnWindowFocus: false,
    });
};

// Custom hook to get weekly profit/loss data
export const useWeeklyProfitLoss = (userId) => {
    return useQuery({
        queryKey: ['weeklyProfitLoss', userId],
        queryFn: () => fetchWeeklyProfitLoss(userId),
        enabled: !!userId,
        refetchOnWindowFocus: false,
    });
};

// Custom hook to submit a trade and auto-update both caches
export const useSubmitTrade = (userId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: submitTradeForm,
        onSuccess: () => {
            if (userId) {
                queryClient.invalidateQueries({ queryKey: ['tradeRecords', userId] });
                queryClient.invalidateQueries({ queryKey: ['weeklyProfitLoss', userId] });
            }
        },
    });
};
