import React, { useEffect, useState, useContext } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Dimensions, ImageBackground, SafeAreaView, ActivityIndicator,
    Image
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Sound from 'react-native-sound';
import LinearGradient from 'react-native-linear-gradient';
import { API_URL } from "@env";
import { bg, play, user, userBlue } from '../../../assets/images';
import Header from '../../../components/Header';
import OptimizedImage from '../../../components/OptimizedImage';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { useCourseDetail } from '../../../functions/handleCourses';
import Loader from '../../../components/loader';
import { ThemeContext } from '../../../context/ThemeProvider';
import ProfileImage from '../../../components/ProfileImage';

const { width } = Dimensions.get('window');

const CourseDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();

    const [totalDuration, setTotalDuration] = useState(0);
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const [durations, setDurations] = useState({});
    const { courseId, courseTitle, affiliateToken, instructorImage } = route.params || {};

    useEffect(() => {
        if (modules.length > 0) {
            const sum = modules.reduce((acc, cur) => acc + (cur.duration || 0), 0);
            setTotalDuration(sum);
        }
    }, [modules]);


    const {
        data: course,
        isLoading,
        error,
    } = useCourseDetail(courseId);

    // 1. Define the function first
    const getLowestPlanPrice = (plans) => {
        if (!plans || plans.length === 0) return 0;
        return Math.min(...plans.map(plan => plan.price));
    };

    // 2. Use it after definition
    const lowestPrice = getLowestPlanPrice(course?.plans);


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
                        <Header title={""} style={{ marginBottom: 25 }} />
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
                                        <ProfileImage
                                            uri={instructorImage}
                                            name={course?.instructorName || 'Instructor'}
                                            size={60} // or whatever fits your design
                                            borderRadius={30}
                                            style={styles.instructorImage}
                                        />
                                        <View>
                                            <Text style={[styles.instructorName, { color: theme.primaryColor }]}>
                                                {course?.instructorName || 'Instructor Name'}
                                            </Text>
                                            <Text style={styles.instructorSubtitle}>Instructor</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: "col," }}>
                                        <Text style={[styles.price, { color: "#fff" }]}>
                                            Starting from
                                        </Text>
                                        <Text style={[styles.price, { color: "#fff", fontSize: 18, fontWeight: "bold" }]}>
                                            {lowestPrice} $
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.courseInfoSection}>
                            <Text style={[styles.heading]}>
                                {course?.title || courseTitle}
                            </Text>
                            <Text style={[styles.courseDescription, { color: theme.textColor }]}>
                                {course?.description}
                            </Text>

                            {/* <LinearGradient
                                start={{ x: 0.9, y: 0.95 }}
                                end={{ x: 1.0, y: 1.0 }}
                                colors={['rgba(255, 255, 255, 0.16)', 'rgba(204, 204, 204, 0)']}
                                style={styles.timestamp}>
                                <Image source={play} style={{ width: 10, height: 10, resizeMode: "contain" }} />
                                <Text style={[styles.instructorName, { color: theme.primaryColor, fontFamily: "Outfit-SemiBold", fontWeight: "bold" }]}>
                                    {formatDuration(totalDuration)}
                                </Text>
                            </LinearGradient> */}
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.audiosSection}>
                            {modules.map((module) => (
                                <LinearGradient start={{ x: 0, y: 0.95 }} end={{ x: 1, y: 1 }}
                                    colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                                    key={module._id} style={styles.audioItem}>
                                    <View style={styles.audioItemInner}>
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
                </SafeAreaView >
            </ImageBackground >
        </>
    );
};

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
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
        height: width * 0.5,
        borderRadius: 18,
        overflow: 'hidden',
        position: 'relative',
        // marginBottom: 20
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
        paddingVertical: 12,
        paddingHorizontal: 7,
        zIndex: 10
    },
    overlayTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    instructorInfo: {
        // borderWidth:2,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    instructorImage: {
        width: 35,
        height: 35,
        borderRadius: 100,
        marginRight: 5
    },
    instructorName: {
        fontSize: 11,
        fontFamily: 'Outfit-SemiBold'
    },
    timestamp: {
        // borderWidth:2,
        borderRadius: 20,
        marginTop: 20,
        borderRadius: 50,
        backgroundColor: 'rgba(199, 199, 199, 0.7)',
        flexDirection: "row",
        gap: 9,
        paddingVertical: 9,
        paddingHorizontal: 15,
        backgroundColor: "",
        justifyContent: "center",
        alignItems: "center",
    },
    price: {
        marginRight: 10,
        fontSize: 9,
        fontFamily: 'Outfit-Bold'
    },
    instructorSubtitle: {
        color: 'white',
        fontSize: 9,
        fontFamily: 'Outfit-Light'
    },
    courseInfoSection: {
        marginTop: 10,
        // paddingBottom: 10,
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    heading: {
        marginTop: 15,
        color: theme.textColor,
        fontSize: 15,
        marginBottom: 12,
        fontFamily: 'Outfit-Black'
    },
    courseDescription: {
        color: theme.textColor,
        fontSize: 12,
        lineHeight: 18,
        fontFamily: 'Outfit-regular'
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
        fontSize: 14,
        // fontWeight: '600',
        fontFamily: 'Outfit-SemiBold'
    }
});

export default CourseDetailScreen;