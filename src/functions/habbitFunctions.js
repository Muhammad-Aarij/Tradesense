import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from "@env";
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../redux/slice/loaderSlice';



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





export const createHabitLog = async ({ userId, habitId, status }) => {
  try {
    console.log('====================================');
    console.log("Log called", userId, habitId, status);
    console.log('====================================');
    const response = await axios.post(`${API_URL}/api/habitlogs`, {
      userId,
      habitId,
      status,
    });

    console.log("Log Response", response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating habit log:', error?.response?.data?.message || error.message);
    return { error: error?.response?.data?.message || 'Something went wrong' };
  }
};





export const fetchTodaysHabits = async (userId) => {
  console.log(userId);
  const { data } = await axios.get(`${API_URL}/api/habbits/${userId}`);
  console.log("Fetched Habit Data:", data); // <-- Add this

  const todayISO = new Date().toISOString().split('T')[0];

  return data.map(habit => {
    const hasTodayLog = habit.habitLogs?.some(log => {
      const logDate = new Date(log.date).toISOString().split('T')[0];
      return logDate === todayISO;
    });

    return {
      _id: habit._id,
      title: habit.title,
      description: habit.description,
      completedToday: hasTodayLog,
    };
  });
};

export const useTodaysHabits = (userId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['todaysHabits', userId],
    queryFn: () => fetchTodaysHabits(userId),
    enabled: !!userId,
    onSuccess: () => dispatch(stopLoading()),
    onError: () => dispatch(stopLoading()),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};




export const fetchHabitStats = async (userId) => {
  const { data } = await axios.get(`${API_URL}/api/habbits/stats/${userId}`);
  console.log("Fetched Habit Stats:", data); // For debugging

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

export const fetchHabitsChartData = async (userId) => {
  console.log('📊 [fetchHabitsChartData] Fetching logs for user:', userId);
  if (!userId) {
    console.warn('📊 [fetchHabitsChartData] userId is null or undefined. Skipping fetch.');
    return [];
  }

  try {
    const { data } = await axios.get(`${API_URL}/api/habitlogs/${userId}`);
    console.log('✅ [fetchHabitsChartData] Raw logs:', data);

    const logsByDate = data.reduce((acc, log) => {
      if (!log.date) return acc;
      const date = new Date(log.date).toISOString().split('T')[0];
      if (!acc[date]) acc[date] = 0;
      acc[date]++;
      return acc;
    }, {});

    const chartData = Object.entries(logsByDate).map(([date, count]) => ({
      label: date,
      value: count,
      fullDate: date,
      frontColor: '#3B82F6',
    }));

    chartData.sort((a, b) => new Date(a.label) - new Date(b.label));

    console.log('📊 [Chart Data] Ready to render:', chartData);
    return chartData;
  } catch (error) {
    console.error('❌ [fetchHabitsChartData] Error:', error.message || error);
    return [];
  }
};
export const useHabitsChartData = (userId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['habitsChartData', userId],
    queryFn: () => fetchHabitsChartData(userId),
    enabled: !!userId,
    refetchOnWindowFocus: true,
    retry: 1,
    onSuccess: (data) => {
      console.log('✅ [useHabitsChartData] Success - Data fetched:', data);
      dispatch(stopLoading());
    },
    onError: (error) => {
      console.error('❌ [useHabitsChartData] Error:', error.message || error);
      dispatch(stopLoading());
    },
  });
};
