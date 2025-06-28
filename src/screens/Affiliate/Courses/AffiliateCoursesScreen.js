import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ImageBackground
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Header from '../../../components/Header';
import { bg } from '../../../assets/images';
import PurchasedCourseCard from '../../Courses/purchaseCourse/PurchaseCourseCard';
import { useEnrolledCourses } from '../../../functions/handleCourses';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { useSelector } from 'react-redux';
import { Buffer } from 'buffer'; 

const { width } = Dimensions.get('window');

const AffiliateCoursesScreen = () => {
    const { userToken, userId } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const { data: courses, isLoading, error } = useEnrolledCourses(userId);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(startLoading());
        const timeout = setTimeout(() => {
            if (!isLoading) dispatch(stopLoading());
        }, 1000);
        return () => clearTimeout(timeout);
    }, [isLoading]);

    const renderItem = ({ item }) => {
        const deepLinkUrl = `tradesense://course/${item._id}?token=${userToken}`;

        return (
            <PurchasedCourseCard
                course={{
                    ...item,
                    type: 'Affiliate',
                    url: deepLinkUrl,
                }}
                onPress={() => {
                    navigation.navigate('CourseEpisodes', {
                        courseId: item._id,
                        courseTitle: item.title,
                        courseImage: item.image,
                    });
                }}
            />
        );
    };
    return (
        <ImageBackground source={bg} style={styles.container}>
            <Header title="Affiliated Courses" />
            <FlatList
                data={courses}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#08131F',
        padding: 25,
        // paddingTop: 20,
    },
    listContainer: {
        paddingBottom: 120,
        // paddingVertical: 10,
        marginBottom: 100,
    }
});

export default AffiliateCoursesScreen;
