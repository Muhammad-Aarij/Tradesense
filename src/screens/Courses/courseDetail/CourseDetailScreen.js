import React, { useEffect, useState, useContext } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Dimensions, ImageBackground, SafeAreaView, ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Sound from 'react-native-sound';
import LinearGradient from 'react-native-linear-gradient';
import { API_URL } from "@env";
import { bg, user, userBlue } from '../../../assets/images';
import Header from '../../../components/Header';
import OptimizedImage from '../../../components/OptimizedImage';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { useCourseDetail } from '../../../functions/handleCourses';
import Loader from '../../../components/loader';
import { ThemeContext } from '../../../context/ThemeProvider';

const { width } = Dimensions.get('window');

const CourseDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();

    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
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

    const handleBuyPress = () => {
        // Navigate to subscription plans
        navigation.navigate('PlansScreen', {
            plans: course?.plans || [],
            Courseid: course?.Courseid || courseId,
            affiliateToken: affiliateToken || null
        });
    };

    return (
        <>
            {isLoading && <Loader />}
            <ImageBackground source={theme.bg} style={[styles.container, { backgroundColor: theme.background }]}>
                <SafeAreaView>
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <Header title={course?.title || courseTitle} style={{ marginBottom: 25 }} />
                        <View style={styles.mainImageContainer}>
                            <OptimizedImage 
                                uri={course?.thumbnail} 
                                style={styles.mainCourseImage}
                                fallbackSource={bg}
                                showLoadingIndicator={true}
                                loadingIndicatorColor={theme.primaryColor}
                            />
                            {/* Gradient overlay */}
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
                                style={styles.gradientOverlay}
                            />
                            <View style={styles.imageOverlay}>
                                <View style={styles.overlayTop}>
                                    <View style={styles.instructorInfo}>
                                        <OptimizedImage
                                            uri={course?.instructorImage}
                                            style={styles.instructorImage}
                                            fallbackSource={userBlue}
                                            isAvatar={true}
                                            username={course?.instructorName || 'Instructor'}
                                            showInitials={true}
                                        />
                                        <View>
                                            <Text style={[styles.instructorName, { color: theme.primaryColor }]}>
                                                {course?.instructorName || 'Instructor Name'}
                                            </Text>
                                            <Text style={styles.instructorSubtitle}>Guided Audio</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.courseInfoSection}>
                            <Text style={[styles.courseDescription, { color: theme.textColor }]}>
                                {course?.description}
                            </Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.audiosSection}>
                            {modules.map((module) => (
                                <LinearGradient start={{ x: 0, y: 0.95 }} end={{ x: 1, y: 1 }}
                                    colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                                    key={module._id} style={styles.audioItem}>
                                        <View style = {styles.audioItemInner}>
                                    <View style={styles.audioLeft}>
                                        <Text style={styles.audioTitle}>{module.title}</Text>
                                    </View>
                                    <Text style={styles.audioDuration}>
                                        {formatDuration(module.duration)}
                                    </Text>
                                    <Text style={styles.audioDescription}>{module.description}</Text>
                                    </View>
                                </LinearGradient>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={[styles.buyNowButton, { backgroundColor: theme.primaryColor }]}
                            onPress={handleBuyPress}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text style={styles.buyNowButtonText}>
                                    Buy Now
                                </Text>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                </SafeAreaView>
            </ImageBackground>
        </>
    );
};

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 0,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#08131F'
    },
    scrollContent: {
        paddingBottom: 150
    },
    mainImageContainer: {
        width: '100%',
        height: width * 0.55,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 20
    },
    mainCourseImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    gradientOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 5
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 15,
        zIndex: 10
    },
    overlayTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    instructorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    instructorImage: {
        width: 40,
        height: 40,
        borderRadius: 100,
        marginRight: 5
    },
    instructorName: {
        fontSize: 13,
        fontFamily: 'Outfit-SemiBold'
    },
    instructorSubtitle: {
        color: 'white',
        fontSize: 11,
        fontFamily: 'Outfit-Light'
    },
    courseInfoSection: {
        marginTop: 10,
        paddingBottom: 10
    },
    courseDescription: {
        color: theme.textColor,
        fontSize: 13,
        lineHeight: 20,
        fontFamily: 'Outfit-Light'
    },
    divider: {
        width: '100%',
        marginVertical: 20,
        borderTopWidth: 1,
        borderColor: 'rgba(119, 119, 119, 0.23)'
    },
    audiosSection: {
        paddingVertical: 10,
        gap: 10
    },
    audioItem: {
        borderRadius: 10,
    },
    audioItemInner: {
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
        color: theme.textColor,
        fontSize: 13,
        fontFamily: 'Outfit-Medium',
        textTransform: "capitalize",
    },
    audioDuration: {
        color: theme.subTextColor,
        fontFamily: 'Outfit-Light',
        fontSize: 12,
        marginBottom: 10
    },
    audioDescription: {
        color: theme.subTextColor,
        fontFamily: 'Outfit-Light',
        fontSize: 10,
        lineHeight: 13,
        textTransform: "none",
    },
    buyNowButton: {
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
        fontFamily: 'Outfit-SemiBold'
    }
});

export default CourseDetailScreen;