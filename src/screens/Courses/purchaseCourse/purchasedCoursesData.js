import React, { useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ImageBackground,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { bg } from '../../../assets/images';
import Header from '../../../components/Header';
import PurchasedCourseCard from './PurchaseCourseCard';
import { useEnrolledCourses } from '../../../functions/handleCourses';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
const { height, width } = Dimensions.get('window');

const PurchasedCoursesScreen = () => {
    const navigation = useNavigation();
    const userData = useSelector(state => state.auth); // adapt if slice name differs
    const studentId = userData.userObject?._id;
    const dispatch = useDispatch();
    const { data: enrolledCourses, isLoading, error } = useEnrolledCourses(studentId);

    useEffect(() => {
        dispatch(startLoading());
        const timeout = setTimeout(() => {
            if (!isLoading) dispatch(stopLoading());
        }, 2000);
        return () => clearTimeout(timeout);
    }, [isLoading]);

    const renderItem = ({ item }) => (
        console.log(item.courseId, item.courseTitle, item.courseImage),
        < PurchasedCourseCard
            course={item}
            showplaybtn={false}
            showUrl={false}
            onPress={() => navigation.navigate('CourseEpisodesScreen', {
                courseId: item._id,
                courseTitle: item.title,
                courseImage: item.thumbnail
            })}
        />
    );

    return (
        <ImageBackground source={bg} style={styles.container}>
            <SafeAreaView>
                <Header title="Purchased Courses" />
                {error ? (
                    <View style={styles.centered}>
                        <Text style={{ color: 'white' }}>Error loading courses: {error.message}</Text>
                    </View>
                ) : (
                    <FlatList
                        data={enrolledCourses}
                        renderItem={renderItem}
                        keyExtractor={item => item._id}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#08131F', padding: 20, paddingBottom: height * 0.1 },
    listContainer: { paddingVertical: 10 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default PurchasedCoursesScreen;
