import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from "@env";
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../redux/slice/loaderSlice';

const fetchTopPicks = async (userId) => {
  const response = await axios.get(`${API_URL}/api/resources/recommend/${userId}`);
  // console.log('Top Picks Response:', response.data);
  return response.data;
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
  // console.log('Recommendations Response:', response.data);
  return response.data;
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
