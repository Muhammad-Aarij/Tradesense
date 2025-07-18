import { API_URL } from "@env";

import axios from 'axios';

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


// hooks/useTradeRecords.js

import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { stopLoading } from '../redux/slice/loaderSlice';

export const useTradeRecords = (userId) => {
    console.log('Fetching trade records for user:', userId);
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
