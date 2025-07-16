import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from "@env";
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../redux/slice/loaderSlice';
import { useQueryClient } from '@tanstack/react-query';


export const postHabit = async ({ userId, title, description, type, status, targetDate }) => {
  try {
    const response = await axios.post(`${API_URL}/api/habbits`, {
      userId,
      title,
      description,
      type,
      targetDate,
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




export const useCreateHabitLog = () => {
  const queryClient = useQueryClient();

  const logHabit = async ({ userId, habitId, status = "completed" }) => {
    try {
      const response = await axios.post(`${API_URL}/api/habitlogs`, {
        userId,
        habitId,
        status,
      });

      queryClient.invalidateQueries({ queryKey: ['todaysHabits', userId] });
      return response.data;
    } catch (error) {
      console.error('Error creating habit log:', error?.response?.data?.message || error.message);
      return { error: error?.response?.data?.message || 'Something went wrong' };
    }
  };

  return logHabit;
};



// Utility to get YYYY-MM-DD in UTC
const getUTCDateString = (date = new Date()) =>
  new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()).toISOString().split('T')[0];

export const fetchTodaysHabits = async (userId) => {
  const { data } = await axios.get(`${API_URL}/api/habbits/${userId}`);

  const todayUTC = getUTCDateString(); // 'YYYY-MM-DD'

  return data
    .filter(habit => !habit.isDeleted)
    .map(habit => {
      const hasTodayLog = habit.habitLogs?.some(log => {
        const logDateUTC = getUTCDateString(new Date(log.date));
        return logDateUTC === todayUTC;
      });

      return {
        _id: habit._id,
        title: habit.title,
        description: habit.description,
        type: habit.type,
        progress: habit.progress,
        isChecked: habit.isChecked,
        completedToday: habit.isChecked,
        expectedCount: habit.expectedCount,
        completedCount: habit.completedCount,
      };
    });
};


export const useTodaysHabits = (userId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['todaysHabits', userId],
    queryFn: () => fetchTodaysHabits(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 60 * 6, // 6 hours
    cacheTime: 1000 * 60 * 60 * 12, // 12 hours
    onSuccess: () => dispatch(stopLoading()),
    onError: () => dispatch(stopLoading()),
    refetchOnWindowFocus: false,
    retry: 1,
  });
};



export const fetchHabitStats = async (userId) => {
  const { data } = await axios.get(`${API_URL}/api/habbits/stats/${userId}`);
  // console.log("Fetched Habit Stats:", data); // For debugging

  // You can add transformation logic here if needed
  return {
    total: data.total || 0,
    completed: data.completed || 0,
    pending: data.pending || 0,
    streak: data.streak || 0,
  };
};

export const useHabitStats = (userId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['habitStats', userId],
    queryFn: () => fetchHabitStats(userId),
    enabled: !!userId,
    onSuccess: () => dispatch(stopLoading()),
    onError: () => dispatch(stopLoading()),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};




export const fetchHabitLogs = async (userId) => {
  const { data } = await axios.get(`${API_URL}/api/habitlogs/${userId}`);
  // console.log('Fetched Habit Logs:', data); // For debugging

  // Optionally transform logs (e.g., sort by date or group by habit)
  const sortedLogs = data.sort((a, b) => new Date(b.date) - new Date(a.date));

  return sortedLogs;
};


export const useHabitLogs = (userId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['habitLogs', userId],
    queryFn: () => fetchHabitLogs(userId),
    enabled: !!userId,
    onSuccess: () => dispatch(stopLoading()),
    onError: () => dispatch(stopLoading()),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};



