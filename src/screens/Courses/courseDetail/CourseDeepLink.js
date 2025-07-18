import React, { useEffect, useState, useContext } from 'react';
import {
    View, Text, Image, StyleSheet, ScrollView, TouchableOpacity,
    Dimensions, ImageBackground, SafeAreaView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Sound from 'react-native-sound';
import LinearGradient from 'react-native-linear-gradient';

import { bg, user, userBlue } from '../../../assets/images';
import Header from '../../../components/Header';
import Loader from '../../../components/loader';
import { useCourseDetail } from '../../../functions/handleCourses';
import { trackAffiliateVisit } from '../../../functions/affiliateApi';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { ThemeContext } from '../../../context/ThemeProvider';

const { width } = Dimensions.get('window');

const CourseDeepLink = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();
    const { isSignedIn } = useSelector(state => state.auth);
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const [durations, setDurations] = useState({});
    const { courseId, courseTitle, affiliateCode } = route.params || {};

    const {
        data: course,
        isLoading,
        error,
    } = useCourseDetail(courseId);

    const modules = course?.courseModules || [];

    useEffect(() => {
        dispatch(startLoading());
        const timeout = setTimeout(() => {
            if (!isLoading) dispatch(stopLoading());
        }, 2000);
        return () => clearTimeout(timeout);
    }, [isLoading]);

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

    const logVisit = async () => {
        const result = await trackAffiliateVisit({
            referrerUserId: affiliateCode,
            courseId,
            type: 'visited',
        });

        if (result.error) {
            console.warn("Affiliate visit tracking failed:", result.details || result.error);
        } else {
            console.log("Affiliate visit logged successfully");
        }
    };

    useEffect(() => {
        if (course && affiliateCode && courseId) {
            logVisit();
        }
    }, [course]);

    const handleBuyPress = () => {
        if (!isSignedIn) {
            navigation.navigate("SignInModal", {
                pendingDeepLink: { courseId, affiliateCode }
            });
            return;
        }

        navigation.navigate('PlansScreenDeepLink', {
            plans: course?.plans || [],
            Courseid: course?.Courseid || courseId,
            affiliateCode: affiliateCode || null
        });
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
            <ImageBackground source={theme.bg || bg} style={[styles.container, { backgroundColor: theme.background }]}>
                <SafeAreaView>
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <Header title={course?.title || courseTitle} />
                        <View style={styles.mainImageContainer}>
                            <Image source={{ uri: course?.thumbnail }} style={styles.mainCourseImage} />
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
                                style={styles.gradientOverlay}
                            />
                            <View style={styles.imageOverlay}>
                                <View style={styles.overlayTop}>
                                    <View style={styles.instructorInfo}>
                                        <Image
                                            source={{ uri: course?.instructorImage ? course.instructorImage : Image.resolveAssetSource(userBlue).uri }}
                                            style={styles.instructorImage} />
                                        <View>
                                            <Text style={[styles.instructorName, { color: theme.primaryColor }]}>
                                                {course?.instructorName}
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

                        <TouchableOpacity style={[styles.buyNowButton, { backgroundColor: theme.primaryColor }]} onPress={handleBuyPress}>
                            <Text style={styles.buyNowButtonText}>Buy Now</Text>
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
        paddingTop: 10,
        paddingBottom: 0,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#08131F'
    },
    scrollContent: {
        paddingBottom: 80,
    },
    mainImageContainer: {
        width: '100%',
        height: width * 0.55,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        overflow: 'hidden',
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
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    instructorImage: {
        width: 40,
        height: 40,
        borderRadius: 100,
        marginRight: 5
    },
    instructorName: {
        fontSize: 13,
        fontFamily: 'Inter-SemiBold'
    },
    instructorSubtitle: {
        color: 'white',
        fontSize: 11,
        fontFamily: 'Inter-Light-BETA'
    },
    courseInfoSection: {
        marginTop: 10,
        paddingBottom: 10
    },
    courseDescription: {
        fontSize: 13,
        lineHeight: 20,
        fontFamily: 'Inter-Light-BETA'
    },
    divider: {
        width: '100%',
        marginBottom: 20,
        borderTopWidth: 1,
        borderColor: 'rgba(119, 119, 119, 0.23)'
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
        color: theme.textColor,
        fontSize: 14,
        fontFamily: 'Inter-Medium'
    },
    audioDuration: {
        color: theme.subTextColor,
        fontFamily: 'Inter-Light-BETA',
        fontSize: 12,
        marginBottom: 10
    },
    audioDescription: {
        color: theme.subTextColor,
        fontFamily: 'Inter-Light-BETA',
        fontSize: 13
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
        fontFamily: 'Inter-SemiBold'
    }
});

export default CourseDeepLink;
