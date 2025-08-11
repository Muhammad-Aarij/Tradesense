import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from "@env";
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../redux/slice/loaderSlice';

const fetchTopPicks = async (userId) => {
  const response = await axios.get(`${API_URL}/api/resources/recommend/${userId}`);
  const picks = response.data;

  // Get half the length, rounded down
  const halfLength = Math.floor(picks.length / 2);

  // Return only the first half
  return picks.slice(0, halfLength);
};


export const useTopPicks = (userId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['topPicks', userId],
    queryFn: () => fetchTopPicks(userId),
    enabled: !!userId,
    onSuccess: () => dispatch(stopLoading()),
    onError: () => dispatch(stopLoading()),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

const fetchRecommendations = async (userId) => {
  const response = await axios.get(`${API_URL}/api/resources/recommend/${userId}`);
  const recommendations = response.data;

  // Calculate midpoint
  const halfIndex = Math.floor(recommendations.length / 2);

  // Return the second half
  return recommendations.slice(halfIndex);
};


export const useRecommendations = (userId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['recommendations', userId],
    queryFn: () => fetchRecommendations(userId),
    enabled: !!userId,
    onSuccess: () => dispatch(stopLoading()),
    onError: () => dispatch(stopLoading()),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

const fetchBundles = async (userId) => {

  const response = await axios.get(`${API_URL}/api/resources/bundle/${userId}`);
  // console.log('Bundles Response (JSON):', JSON.stringify(response.data, null, 2));
  return response.data;
};

export const useBundles = (userId) => {
  console.log(userId);
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['bundles', userId],
    queryFn: () => fetchBundles(userId),
    enabled: !!userId,
    onSuccess: () => dispatch(stopLoading()),
    onError: () => dispatch(stopLoading()),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

const fetchMusic = async (userId) => {
  const response = await axios.get(`${API_URL}/api/music`);
  console.log("Music Data", response.data);
  return response.data;
};


export const useMusic = (userId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['music', userId],
    queryFn: () => fetchMusic(userId),
    enabled: !!userId,
    onSuccess: () => dispatch(stopLoading()),
    onError: () => dispatch(stopLoading()),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};





export const fetchDailyThought = async () => {
  const { data } = await axios.get(`${API_URL}/api/resources/dailyThought`);
  return data;
};



export const useDailyThought = () => {
  return useQuery({
    queryKey: ['dailyThought'],
    queryFn: fetchDailyThought,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });
};