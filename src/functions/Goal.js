import axios from 'axios';
import { API_URL } from '@env';

export const postGoal = async ({ userId, title, status, description, frequency, targetDate }) => {
  try {
    const response = await axios.post(`${API_URL}/api/goals`, {
      userId,
      title,
      status,
      description,
      frequency,
      targetDate,
    });

    console.log('Response from create goal:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating goal:', error?.response?.data?.message || error.message);
    return { error: error?.response?.data?.message || 'Something went wrong' };
  }
};
