import axios from 'axios';
import { API_URL } from '@env';

export const getUserNotifications = async (userId) => {
  const response = await axios.get(`${API_URL}/api/notifications/${userId}`);
  return response.data.notifications;
};
