import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../redux/slice/loaderSlice';
import { API_URL } from "@env";
import { userBlue } from '../assets/images';


const fetchCourses = async () => {
console.log("Fetching courses from API:", API_URL);
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
        instructorImage: course.instructor?.profilePic,
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
    console.log("Fetch COurse Detail Data of Instructor:", data.instructor);
    return {
        Courseid: data._id,
        title: data.title,
        thumbnail: data.thumbnail,
        duration: data.duration,
        description: data.description,
        isPremium: data.isPremium,
        plans: data.plans || [],
        courseModules: data.courseModules || [],
        instructorName: data.instructor?.name,
        instructorImage: data.instructor?.profilePic ,
        instructorInfo: data.instructor?.email,
        instructorDescription: data.instructor?.description,
        instructorExperienceLevel: data.instructor?.experienceLevel,
        instructorLinks: {
            github: data.instructor?.links?.github || '',
            linkedin: data.instructor?.links?.linkedin || '',
            portfolio: data.instructor?.links?.portfolio || '',
            instagram: data.instructor?.links?.instagram || '',
            facebook: data.instructor?.links?.facebook || '',
            twitter: data.instructor?.links?.twitter || ''
        }
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
        duration: enrollment.course.duration,
        paymentStatus: enrollment.paymentStatus,
        enrolledAt: enrollment.enrolledAt,
        plan: enrollment.plan,
    }));
};

export const useEnrolledCourses = (studentId) => {
    const dispatch = useDispatch();
    console.log('====================================');
    console.log(studentId);
    console.log('====================================');
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
