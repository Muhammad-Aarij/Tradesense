import axios from 'axios';
import { API_URL } from '@env';

export const postHabit = async ({ userId, title, description, type, status }) => {
  try {
    const response = await axios.post(`${API_URL}/api/habbits`, {
      userId,
      title,
      description,
      type,
      status,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating habit:', error?.response?.data?.message || error.message);
    return { error: error?.response?.data?.message || 'Something went wrong' };
  }
};
