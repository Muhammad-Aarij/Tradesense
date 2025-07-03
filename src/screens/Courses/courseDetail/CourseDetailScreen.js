import React, { useEffect, useState } from 'react';
import {
    View, Text, Image, StyleSheet, ScrollView, TouchableOpacity,
    Dimensions, ImageBackground, SafeAreaView
} from 'react-native';
import { bg, user } from '../../../assets/images';
import Header from '../../../components/Header';
import theme from '../../../themes/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { useCourseDetail } from '../../../functions/handleCourses';
import Loader from '../../../components/loader';
import Sound from 'react-native-sound';

const { width, height } = Dimensions.get('window');

const CourseDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();

    const [durations, setDurations] = useState({});
    const { courseId, courseTitle, affiliateToken } = route.params || {};

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

    const getAudioDuration = (url, id) => {
        const sound = new Sound(url, null, (error) => {
            if (error) {
                console.log(`Failed to load sound for ${id}:`, error);
                return;
            }
            const duration = sound.getDuration();
            setDurations(prev => ({ ...prev, [id]: duration }));
            sound.release();
        });
    };

    useEffect(() => {
        modules.forEach(episode => {
            if (episode.url && !durations[episode._id]) {
                getAudioDuration(episode.url, episode._id);
            }
        });
    }, [modules]);

    const formatDuration = (durationInSeconds) => {
        const hrs = Math.floor(durationInSeconds / 3600);
        const mins = Math.floor((durationInSeconds % 3600) / 60);
        return hrs > 0 ? `${hrs}h ${mins}min` : `${mins}min`;
    };

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={{ color: 'white' }}>Error fetching course: {error.message}</Text>
            </View>
        );
    }

    return (
        <>
            {isLoading && <Loader />}
            <ImageBackground source={bg} style={styles.container}>
                <SafeAreaView>

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <Header title={course?.title || courseTitle} />
                        <View style={styles.mainImageContainer}>
                            <Image source={{ uri: course?.thumbnail }} style={styles.mainCourseImage} />
                            <View style={styles.imgOverlay} />
                            <View style={styles.imageOverlay}>
                                <View style={styles.overlayTop}>
                                    <View style={styles.instructorInfo}>
                                        <Image source={user} style={styles.instructorImage} />
                                        <View>
                                            <Text style={styles.instructorName}>{course?.instructorName}</Text>
                                            <Text style={styles.instructorSubtitle}>Guided Audio</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.courseInfoSection}>
                            <Text style={styles.courseDescription}>
                                {course?.description}
                            </Text>
                        </View>

                        <View style={{ width: '100%', marginBottom: 20, borderTopWidth: 1, borderColor: 'rgba(119, 119, 119, 0.23)' }} />

                        <View style={styles.audiosSection}>
                            {modules.map((module) => (
                                <View key={module._id} style={styles.audioItem}>
                                    <View style={styles.audioLeft}>
                                        <Text style={styles.audioTitle}>{module.title}</Text>
                                    </View>
                                    <Text style={styles.audioDuration}>
                                        {durations[module._id]
                                            ? formatDuration(durations[module._id])
                                            : 'Loading...'}
                                    </Text>
                                    <Text style={styles.audioDescription}>{module.description}</Text>
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={styles.buyNowButton}
                            onPress={() =>
                                navigation.navigate('PlansScreen', {
                                    plans: course?.plans || [],
                                    Courseid: course?.Courseid || courseId,
                                    affiliateToken: affiliateToken || null
                                })
                            }
                        >
                            <Text style={styles.buyNowButtonText}>Buy Now</Text>
                        </TouchableOpacity>

                    </ScrollView>
                </SafeAreaView>
            </ImageBackground>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop:0,
        backgroundColor: 'black'
    },
    centered: {
        // paddingBottom: height * 0.3,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#08131F'
    },
    scrollContent: { paddingBottom: 150 },
    mainImageContainer: {
        width: '100%',
        height: width * 0.55,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        overflow: 'hidden',
    },
    mainCourseImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        position: 'relative'
    },
    imgOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(31, 30, 30, 0.4)',
        zIndex: 10
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 15
    },
    overlayTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    instructorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        zIndex: 100
    },
    instructorImage: {
        width: 40,
        height: 40,
        borderRadius: 100,
        marginRight: 5
    },
    instructorName: {
        color: theme.primaryColor,
        fontSize: 13,
        fontFamily: 'Inter-SemiBold'
    },
    instructorSubtitle: {
        color: 'white',
        fontSize: 11,
        fontFamily: 'Inter-Light-BETA'
    },
    courseInfoSection: {
        marginTop: 20,
        paddingBottom: 10
    },
    courseDescription: {
        color: '#FFFFFF',
        fontSize: 13,
        lineHeight: 20,
        fontFamily: 'Inter-Light-BETA'
    },
    audiosSection: {
        paddingVertical: 10,
        gap: 10
    },
    audioItem: {
        padding: 14,
        paddingVertical: 16,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 1,
        borderColor: theme.borderColor
    },
    audioLeft: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    audioTitle: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Inter-Medium'
    },
    audioDuration: {
        color: '#AAAAAA',
        fontFamily: 'Inter-Light-BETA',
        fontSize: 12,
        marginBottom: 10
    },
    audioDescription: {
        color: '#FFFFFF',
        fontFamily: 'Inter-Light-BETA',
        fontSize: 11,
        lineHeight: 12
    },
    buyNowButton: {
        backgroundColor: theme.primaryColor,
        width: '100%',
        padding: 15,
        borderRadius: 14,
        marginTop: 20,
        alignItems: 'center'
    },
    buyNowButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold'
    }
});

export default CourseDetailScreen;
