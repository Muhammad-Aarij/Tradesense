import React, { useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    ImageBackground,
    ActivityIndicator,
} from 'react-native';
import { bg, play, user } from '../../../assets/images';
import Header from '../../../components/Header';
import theme from '../../../themes/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { useCourseDetail } from '../../../functions/handleCourses';

const { width } = Dimensions.get('window');

const CourseDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();

    const { courseId, courseTitle } = route.params || {};
    const {
        data: course,
        isLoading,
        error,
    } = useCourseDetail(courseId);

    useEffect(() => {
        dispatch(startLoading());
        const timeout = setTimeout(() => {
            if (!isLoading) dispatch(stopLoading());
        }, 2000);
        return () => clearTimeout(timeout);
    }, [isLoading]);


    const modules = course?.courseModules || [];

    // if (isLoading) {
    //     return (
    //         <View style={styles.centered}>
    //             <ActivityIndicator size="large" color={theme.primaryColor} />
    //         </View>
    //     );
    // }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={{ color: 'white' }}>Error fetching course details: {error.message}</Text>
            </View>
        );
    }

    return (
        <ImageBackground source={bg} style={styles.container}>
            <Header title={course?.title || courseTitle} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Course Main Image */}
                <View style={styles.mainImageContainer}>
                    <Image source={{ uri: course?.thumbnail }} style={styles.mainCourseImage} />
                    <View style={styles.imgOverlay} />
                    <View style={styles.imageOverlay}>
                        <View style={styles.overlayTop}>
                            <View style={styles.timeBadge}>
                                <Image source={play} style={{ width: 10, height: 10, resizeMode: 'contain' }} />
                                <Text style={styles.timeBadgeText}>15min</Text>
                            </View>
                            <View style={styles.instructorInfo}>
                                <Image source={user} style={styles.instructorImage} />
                                <View>
                                    <Text style={styles.instructorName}>Instructor</Text>
                                    <Text style={styles.instructorSubtitle}>Guided Audio</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.courseInfoSection}>
                    <Text style={styles.courseDescription}>
                        {course?.description}
                    </Text>
                </View>
                <View style={{ width: '100%', marginBottom: 20, borderTopWidth: 1, borderColor: 'rgba(119, 119, 119, 0.23)' }} />

                {/* Course Modules */}
                <View style={styles.audiosSection}>
                    {modules.map((module) => (
                        <View key={module._id} style={styles.audioItem}>
                            <View style={styles.audioLeft}>
                                <Text style={styles.audioTitle}>{module.title}</Text>
                            </View>
                            <Text style={styles.audioDuration}>
                                {/* {`${Math.floor(Math.random() * 10) + 5} min`} */}
                            </Text>
                            <Text style={styles.audioDescription}>{module.description}</Text>
                        </View>
                    ))}
                </View>

                {/* Buy Button */}
                {(
                    <TouchableOpacity
                        style={styles.buyNowButton}
                        onPress={() =>
                            navigation.navigate('PlansScreen', {
                                plans: course.plans,
                                Courseid: course.Courseid
                            })
                        }
                    >
                        <Text style={styles.buyNowButtonText}>Buy Now</Text>
                    </TouchableOpacity>
                )}

            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 25, paddingBottom: 100, paddingVertical: 0, backgroundColor: 'black' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#08131F' },
    scrollContent: { paddingBottom: 20 },
    mainImageContainer: {
        width: '100%',
        height: width * 0.55,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
    },
    mainCourseImage: { width: '100%', height: '100%', resizeMode: 'cover', position: 'relative' },
    imgOverlay: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(31, 30, 30, 0.7)', zIndex: 10 },
    imageOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 15 },
    overlayTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    timeBadge: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(119, 119, 119, 0.66)',
        borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4, zIndex: 100,
    },
    timeBadgeText: { color: '#FFFFFF', fontSize: 12, marginLeft: 5 },
    instructorInfo: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
    instructorImage: { width: 40, height: 40, borderRadius: 100, marginRight: 5 },
    instructorName: { color: theme.primaryColor, fontSize: 13, fontFamily: 'Inter-SemiBold' },
    instructorSubtitle: { color: 'white', fontSize: 11, fontFamily: 'Inter-Light-BETA' },
    courseInfoSection: { marginBottom: 20 },
    courseDescription: { color: '#FFFFFF', fontSize: 13, lineHeight: 20, fontFamily: 'Inter-Light-BETA' },
    audiosSection: { paddingVertical: 10, gap: 10 },
    audioItem: {
        padding: 14, borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 1.5, borderColor: theme.borderColor,
    },
    audioLeft: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    audioTitle: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Inter-Medium' },
    audioDuration: { color: '#AAAAAA', fontFamily: 'Inter-Light-BETA', fontSize: 12, marginBottom: 5 },
    audioDescription: { color: '#FFFFFF', fontFamily: 'Inter-Light-BETA', fontSize: 13, lineHeight: 18 },
    buyNowButton: { backgroundColor: theme.primaryColor, width: '100%', padding: 15, borderRadius: 14, marginTop: 20, alignItems: 'center' },
    buyNowButtonText: { color: '#fff', fontSize: 17, fontWeight: '600', fontFamily: 'Inter-SemiBold' },
});

export default CourseDetailScreen;
