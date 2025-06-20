import axios from 'axios';
import { API_URL } from "@env";

export const getConfig = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/config`);
    console.log('Config fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching config:', error.response?.data || error.message);
    throw error;
  }
};
