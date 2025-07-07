import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from "@env";
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../redux/slice/loaderSlice';

export const postGoal = async ({ userId, title, status, description, frequency, targetDate }) => {
  try {
    const response = await axios.post(`${API_URL}/api/habbits`, {
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


export const updateGoal = async (goalId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/api/habbits/${goalId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating goal:', error?.response?.data?.message || error.message);
    return { error: error?.response?.data?.message || 'Something went wrong' };
  }
};

export const deleteGoal = async (goalId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/habbits/${goalId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting goal:', error?.response?.data?.message || error.message);
    return { error: error?.response?.data?.message || 'Something went wrong' };
  }
};


const fetchGoalsByUser = async (userId) => {
  const response = await axios.get(`${API_URL}/api/habbits/${userId}`);
  console.log('Response from fetch goals by user:', response.data);
  return response.data;
};
 
export const useGoalsByUser = (userId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['goals', userId],
    queryFn: () => fetchGoalsByUser(userId),
    enabled: !!userId, 
    onSuccess: () => dispatch(stopLoading()),
    onError: () => dispatch(stopLoading()),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};