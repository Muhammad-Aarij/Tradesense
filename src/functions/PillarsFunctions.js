import axios from "axios";
import { API_URL } from "@env";
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { stopLoading } from '../redux/slice/loaderSlice';

const fetchAllPillars = async () => {
    const response = await axios.get(`${API_URL}/api/pillars/categories/`);
    return response.data;
};

export const useAllPillars = () => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['pillars'],
        queryFn: fetchAllPillars,
        onSuccess: () => dispatch(stopLoading()),
        onError: () => dispatch(stopLoading()),
        retry: 1,
        refetchOnWindowFocus: false,
    });
};

const fetchResources = async ({ queryKey }) => {
    const [_key, name, category, type] = queryKey;
    const response = await axios.get(`${API_URL}/api/resources`, {
        params: { name, category, type },
    });
    // console.log("Resources", response.data);
    return response.data;
};

export const useResources = ({ name, category, type }) => {
    console.log(name, category, type);
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['resources', name, category, type],
        queryFn: fetchResources,
        onSuccess: () => dispatch(stopLoading()),
        onError: () => dispatch(stopLoading()),
        enabled: !!name && !!category && !!type,
        retry: 1,
        refetchOnWindowFocus: false,
    });
};