
import axios from 'axios';
import { API_URL } from "@env"; // Ensure API_URL is in your .env file

// 1. Add a new mood
export const postMood = async ({ userId, mood }) => {
  // Corrected: Log the actual parameters being passed, not an undefined 'data' variable.
  console.log("Calling postMoodData with userId:", userId, "and mood:", mood);

  try {
    const response = await axios.post(`${API_URL}/api/mood`, { userId, mood });
    console.log("Response from post mood data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error posting mood:", error.response?.data || error.message);
    throw error; // Re-throw the error for the calling hook to handle
  }
};



// 2. Get the latest mood entry for a user
export const getLatestMood = async (userId) => {
  const response = await axios.get(`${API_URL}/api/mood/${userId}`);
  const moods = response.data;
  // console.log('Latest moods:', moods); // Debug log to check fetched moods
  return moods.length ? moods[moods.length - 1] : null;
};


export const getAllMoods = async (userId) => {
  const response = await axios.get(`${API_URL}/api/mood/${userId}`);
  const moods = response.data;
  // console.log('All moods:', moods);
  return moods || [];
};

// 3. Update a mood by moodId
export const updateMoodById = async ({ moodId, mood }) => {
  const response = await axios.patch(`${API_URL}/api/mood/${moodId}`, { mood });
  return response.data;
};




// hooks/useMood.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ⏳ 10 hours in ms
const TEN_HOURS = 10 * 60 * 60 * 1000;



export const useAllMoods = (userId) => {
  return useQuery({
    queryKey: ['all-moods', userId],
    queryFn: () => getAllMoods(userId),
    enabled: !!userId,
    staleTime: TEN_HOURS,
    cacheTime: TEN_HOURS,
  });
};
// 1. Hook to get latest mood
export const useUserMood = (userId) => {
  return useQuery({
    queryKey: ['user-mood', userId],
    queryFn: () => getLatestMood(userId),
    enabled: !!userId,
    staleTime: TEN_HOURS,
    cacheTime: TEN_HOURS,
  });
};

// 2. Hook to post a new mood
export const usePostMood = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postMood,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['user-mood', variables.userId]);
    },
  });
};

// 3. Hook to update an existing mood
export const useUpdateMood = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMoodById,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['user-mood', variables.userId]);
    },
  });
};
