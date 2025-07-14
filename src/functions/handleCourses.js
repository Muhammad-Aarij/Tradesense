import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../redux/slice/loaderSlice';
import { API_URL } from "@env";

const fetchCourses = async () => {
    const { data } = await axios.get(`${API_URL}/api/courses`);
    return data.map(course => ({
        _id: course._id,
        title: course.title,
        price: course.price,
        thumbnail: course.thumbnail,
        description: course.description,
        duration: course.duration,
        averageRating: course.averageRating,
        isPremium: course.isPremium,
        instructorName: course.instructor?.name,
        instructorExperienceLevel: course.instructor?.experienceLevel
    }));
};

export const useCourses = () => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['courses'],
        queryFn: fetchCourses,
        onSuccess: () => dispatch(stopLoading()),
        onError: () => dispatch(stopLoading()),
        retry: 1,
        refetchOnWindowFocus: false
    });
};




const fetchCourseDetail = async (courseId) => {
    const { data } = await axios.get(`${API_URL}/api/courses/${courseId}`);
    return {
        Courseid: data._id,
        title: data.title,
        thumbnail: data.thumbnail,
        duration: data.duration,
        description: data.description,
        isPremium: data.isPremium,
        plans: data.plans || [],
        instructorName: data.instructor?.name,
        instructorExperienceLevel: data.instructor?.experienceLevel,
        courseModules: data.courseModules || []
    };
};

export const useCourseDetail = (courseId) => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['courseDetail', courseId],
        queryFn: () => fetchCourseDetail(courseId),
        enabled: !!courseId,
        // onSuccess: () => dispatch(stopLoading()),
        // onError: () => dispatch(stopLoading()),
        retry: 1,
        refetchOnWindowFocus: false
    });
};



export const enrollInCourse = async ({ studentId, courseId, plan }) => {
    try {
        console.log('Enrolling with:', studentId, courseId, plan); // ✅ Debug log
        // console.log('====================================');
        const response = await axios.post(`${API_URL}/api/enrollments`, {
            studentId,
            courseId,
            plan,
        });

        console.log("Enrollment response:", response.data);

        return response.data; // You can return or handle the enrollment confirmation here
    } catch (error) {
        console.error('Enrollment failed:', error.response?.data || error.message);
        throw error;
    }
};





const fetchEnrolledCourses = async (studentId) => {
    const { data } = await axios.get(`${API_URL}/api/enrollments/${studentId}`);
    return data.map((enrollment) => ({
        _id: enrollment.course._id,
        title: enrollment.course.title,
        thumbnail: enrollment.course.thumbnail,
        description: enrollment.course.description,
        averageRating: enrollment.averageRating,
        isPremium: enrollment.course.isPremium,
        instructorName: enrollment.instructor?.name,
        instructorExperienceLevel: enrollment.instructor?.experienceLevel,
        status: enrollment.status,
        duration: enrollment.duration,
        paymentStatus: enrollment.paymentStatus,
        enrolledAt: enrollment.enrolledAt,
        plan: enrollment.plan,
    }));
};

export const useEnrolledCourses = (studentId) => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['enrolledCourses', studentId],
        queryFn: () => fetchEnrolledCourses(studentId),
        enabled: !!studentId,
        onSuccess: () => dispatch(stopLoading()),
        onError: () => dispatch(stopLoading()),
        retry: 1,
        refetchOnWindowFocus: false,
    });
};



export const addToFavorites = async ({ userId, itemId, itemType }) => {
    // console.log('Adding to favorites:', userId, itemId, itemType); 
    try {
        const response = await fetch(`${API_URL}/api/favorites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, itemId, itemType }),
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to add to favorites');
        }

        return result;
    } catch (error) {
        console.error('Error adding to favorites:', error.message);
        return { error: error.message };
    }
};


export const deleteFavorite = async (favoriteId) => {
    try {
        const response = await fetch(`${API_URL}/api/favorites/${favoriteId}`, {
            method: 'DELETE',
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to remove favorite');
        }

        return result;
    } catch (error) {
        console.error('Error removing favorite:', error.message);
        return { error: error.message };
    }
};
