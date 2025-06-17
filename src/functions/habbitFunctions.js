import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from "@env";
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../redux/slice/loaderSlice';



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



export const updateHabit = async (habitId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/api/habbits/${habitId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating habit:', error?.response?.data?.message || error.message);
    return { error: error?.response?.data?.message || 'Something went wrong' };
  }
};

export const deleteHabit = async (habitId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/habbits/${habitId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting habit:', error?.response?.data?.message || error.message);
    return { error: error?.response?.data?.message || 'Something went wrong' };
  }
};


const fetchHabitByUser = async (userId) => {
  const response = await axios.get(`${API_URL}/api/habbits/${userId}`);
  // console.log('Response from fetch Habit by user:', response.data);
  return response.data;
};

export const useHabitByUser = (userId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['Habit', userId],
    queryFn: () => fetchHabitByUser(userId),
    enabled: !!userId, 
    onSuccess: () => dispatch(stopLoading()),
    onError: () => dispatch(stopLoading()),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};