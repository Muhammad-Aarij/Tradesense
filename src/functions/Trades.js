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
