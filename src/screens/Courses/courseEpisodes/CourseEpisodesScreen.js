import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    ImageBackground,
    SafeAreaView
} from 'react-native';
import TrackPlayer, { usePlaybackState, State } from 'react-native-track-player';
import { useNavigation } from '@react-navigation/native';
import { bg, heart, heartOutline, mountain, pause, play, stop, user, userBlue } from '../../../assets/images';
import Sound from 'react-native-sound';
import theme from '../../../themes/theme';
import Header from '../../../components/Header';
import { addToFavorites, deleteFavorite, useCourseDetail } from '../../../functions/handleCourses';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { useDispatch, useSelector } from 'react-redux';
import { API_URL } from "@env";
import { ThemeContext } from '../../../context/ThemeProvider';
import OptimizedImage from '../../../components/OptimizedImage';
import ProfileImage from '../../../components/ProfileImage';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const CourseEpisodesScreen = ({ route }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const { courseId, courseTitle, courseImage, instructorImage } = route.params || {};
    const { data: course, isLoading } = useCourseDetail(courseId);
    const [currentEpisode, setCurrentEpisode] = useState(null);
    const [favoriteIds, setFavoriteIds] = useState([]);
    const userId = useSelector(state => state.auth);
    const [durations, setDurations] = useState({});
    const modules = course?.courseModules || [];
    console.log("Specific COurse Data", course)
    useEffect(() => {
        let isMounted = true;
        dispatch(startLoading());

        const timeout = setTimeout(() => {
            if (!isLoading && isMounted) {
                dispatch(stopLoading());
            }
        }, 2000);

        return () => {
            isMounted = false;   // 🛑 Stop setState or dispatch
            dispatch(stopLoading()); // Clean up loading state manually
            clearTimeout(timeout);
        };
    }, [isLoading]);


    // useEffect(() => {
    //     TrackPlayer.setupPlayer();
    //     TrackPlayer.updateOptions({
    //         stopWithApp: true,
    //         capabilities: [
    //             TrackPlayer.CAPABILITY_PLAY,
    //             TrackPlayer.CAPABILITY_PAUSE,
    //         ],
    //     });

    //     return () => {
    //         // TrackPlayer.reset();
    //     };
    // }, []);

    const getAudioDuration = (url, id) => {
        const sound = new Sound(url, null, (error) => {
            if (error) {
                console.log(`Failed to load sound for ${id}:`, error);
                return;
            }
            const duration = sound.getDuration();
            setDurations(prev => ({ ...prev, [id]: duration }));
            sound.release(); // good practice
        });
    };


    useEffect(() => {
        let canceled = false;

        modules.forEach((episode) => {
            if (episode.url && !durations[episode._id]) {
                const sound = new Sound(episode.url, null, (error) => {
                    if (error || canceled) return;
                    const duration = sound.getDuration();
                    setDurations((prev) => ({ ...prev, [episode._id]: duration }));
                    sound.release();
                });
            }
        });

        return () => {
            canceled = true;
        };
    }, [modules]);


    const formatDuration = (durationInSeconds) => {
        const hrs = Math.floor(durationInSeconds / 3600);
        const mins = Math.floor((durationInSeconds % 3600) / 60);
        const secs = Math.floor(durationInSeconds % 60);

        const padded = (val) => val.toString().padStart(2, '0');

        let formatted = '';

        if (hrs > 0) {
            formatted += `${hrs}:`;
        }

        if (mins > 0 || hrs > 0) { // show minutes if they're non-zero OR if hours are shown
            formatted += `${padded(mins)}:`;
        }

        formatted += padded(secs);

        return formatted;
    };




    const playEpisode = async (episode) => {
        try {
            // ✅ Check if TrackPlayer is already initialized
            const isInitialized = await TrackPlayer.getState()
                .then(() => true)
                .catch(() => false); // If error, not initialized

            if (!isInitialized) {
                console.log("🛠 Setting up TrackPlayer...");
                await TrackPlayer.setupPlayer();
            }

            // ✅ Reset and load the new episode
            await TrackPlayer.reset();
            await TrackPlayer.add({
                id: episode._id,
                url: episode.url,
                title: episode.title,
                artist: course?.instructorName || "Instructor",
                artwork: courseImage,
            });
            await TrackPlayer.play();
            setCurrentEpisode(episode);
        } catch (error) {
            console.log('❌ Error playing episode:', error);
        }
    };


    const togglePlayback = async () => {
        const currentState = await TrackPlayer.getState();
        if (currentState === State.Playing) {
            await TrackPlayer.pause();
        } else {
            await TrackPlayer.play();
        }
    };

    const handleFavorite = async (episode) => {
        console.log('Adding to favorites:', userId);
        const result = await addToFavorites({
            userId: userId.userId,
            itemId: episode._id,
            itemType: 'CourseModule',
        });

        if (result.error) {
            console.warn('Failed to favorite:', result.error);
        } else {
            console.log('Favorited successfully:', result);
        }
    };


    const handleUnstar = async (ItemID) => {
        const result = await deleteFavorite(ItemID);

        if (result.error) {
            console.warn('Failed to unstar:', result.error);
        } else {
            console.log('Successfully removed favorite:', result);
        }
    };



    return (
        <ImageBackground source={theme.bg} style={styles.container}>
            <SafeAreaView>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Header title={""} style={{ marginBottom: 30, }} />
                    <View style={styles.mainImageContainer}>
                        <OptimizedImage
                            uri={courseImage}
                            style={styles.mainCourseImage}
                            fallbackSource={mountain}
                            resizeMode="cover"
                        />
                        {/* <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
                            style={styles.gradientOverlay}
                        /> */}
                        <View style={styles.imgOverlay} />
                        <View style={styles.imageOverlay}>
                            <View style={styles.overlayTop}>
                                {/* <View style={styles.timeBadge}>
                                    <Image source={play} style={{ width: 10, height: 10 }} />
                                    <Text style={styles.timeBadgeText}>15min</Text>
                                </View> */}
                                <View style={styles.instructorInfo}>
                                    <ProfileImage
                                        uri={instructorImage}
                                        name={course?.instructorName}
                                        size={40}
                                        borderRadius={20}
                                        style={styles.instructorImage}
                                    />
                                    <View>
                                        <Text style={[styles.instructorName, { color: theme.primaryColor }]}>{course?.instructorName}</Text>
                                        <Text style={styles.instructorSubtitle}>Instructor</Text>
                                    </View>
                                </View>

                                <LinearGradient
                                    start={{ x: 0.9, y: 0.95 }}
                                    end={{ x: 1.0, y: 1.0 }}
                                    colors={['rgba(255, 255, 255, 0.34)', 'rgba(204, 204, 204, 0)']}
                                    style={styles.timestamp}>
                                    {/* <View style={styles.inerTime, [backgroundColor: 'rgba(199, 199, 199, 0.38)',] }> */}
                                    <Image source={play} style={{ width: 10, height: 10, resizeMode: "contain" }} />
                                    <Text style={[styles.instructorName, { color: "white", fontFamily: "Outfit-SemiBold", fontWeight: "bold" }]}>
                                        15 min
                                    </Text>
                                    {/* </View> */}
                                </LinearGradient>
                            </View>
                        </View>
                    </View>

                    <View style={styles.courseDetails}>
                        <Text style={[styles.heading]}>
                            {course?.title || courseTitle}
                        </Text>
                        <Text style={styles.courseDescription}>
                            {course?.description}
                        </Text>

                    </View>

                    <View style={{ width: "100%", marginBottom: 20, borderTopWidth: 1, borderColor: "rgba(119, 119, 119, 0.23)" }} />

                    <View style={styles.episodesList}>
                        {modules.map((episode, index) => (
                            <TouchableOpacity key={episode.id} onPress={() =>
                                navigation.navigate('TrackPlayer', {
                                    AudioTitle: episode.title,
                                    AudioDescr: episode.description || '',
                                    Thumbnail: courseImage,
                                    AudioUrl: episode.url,
                                    shouldFetchTrack: true,
                                    InstructorData: {
                                        name: course?.instructorName,
                                        email: course?.instructorInfo,
                                        description: course?.instructorDescription,
                                        experienceLevel: course?.instructorExperienceLevel,
                                        image: instructorImage,
                                        links: course?.instructorLinks
                                    },
                                    showInstructor: true,
                                    navigationKey: Date.now(),
                                })}
                                style={styles.episodeItem}>
                                <View style={styles.episodeNumberContainer}>
                                    <Text style={styles.episodeNumber}>{index + 1}</Text>
                                </View>
                                <View style={styles.episodeInfo}>
                                    <Text style={styles.episodeTitle}>{episode.title}</Text>
                                    <Text style={styles.episodeDuration}>
                                        {
                                            formatDuration(episode.duration)
                                        }
                                    </Text>

                                </View>
                                {/* <TouchableOpacity
                                    style={styles.heartButton}
                                    onPress={async () => {
                                        const isFavorited = favoriteIds.includes(episode._id);

                                        if (isFavorited) {
                                            await handleUnstar(episode._id);
                                            setFavoriteIds(prev => prev.filter(id => id !== episode._id));
                                        } else {
                                            await handleFavorite(episode); // ← see tweak below
                                            setFavoriteIds(prev => [...prev, episode._id]);
                                        }
                                    }}
                                >
                                    <Image
                                        source={favoriteIds.includes(episode._id) ? heart : heartOutline}
                                        style={{ width: 20, height: 20 }}
                                    />
                                </TouchableOpacity> */}
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

            </SafeAreaView>
        </ImageBackground >
    );
};

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
    },
    scrollContent: {
        paddingHorizontal: 25,
        paddingBottom: height * 0.15,
    },
    mainImageContainer: {
        width: '100%',
        height: width * 0.45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
        overflow: 'hidden',
        marginBottom: 20,
    },
    mainCourseImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        position: "relative",
    },
    imgOverlay: {
        zIndex: 1,
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: theme.overlayColor || 'rgba(15, 15, 15, 0.7)',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 7,
        paddingVertical: 9,
        zIndex:10,
    },

    heading: {
        marginTop: 15,
        color: theme.textColor,
        fontSize: 15,
        marginBottom: 12,
        fontFamily: 'Outfit-Black'
    },
    timestamp: {
        marginRight:7,
        marginBottom:10,
        borderRadius: 20,
        marginTop: 20,
        borderRadius: 50,
        backgroundColor: 'rgba(199, 199, 199, 0.7)',
        flexDirection: "row",
        gap: 9,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: "",
        justifyContent: "center",
        alignItems: "center",
    },
    overlayTop: {
        width: "100%",
        // borderWidth:2,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'flex-end',
    },
    timeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.badgeColor || 'rgba(119, 119, 119, 0.66)',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    timeBadgeText: {
        color: theme.textColor,
        fontSize: 12,
        marginLeft: 5,
    },
    instructorInfo: {

        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        zIndex: 100,
    },
    instructorImage: {
        width: 35,
        height: 35,
        borderRadius: 100,
        marginRight: 5
    },
    instructorName: {
        zIndex: 100000,
        fontSize: 11,
        fontFamily: 'Outfit-SemiBold',
        color: "white",
    },
    instructorSubtitle: {
        color: "white",
        fontSize: 9,
        fontFamily: 'Outfit-Light',
    },
    courseDetails: {
        paddingHorizontal: 16,
        paddingLeft: 0,
        marginBottom: 20,
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    courseDescription: {
        color: theme.textColor,
        fontSize: 12,
        lineHeight: 20,
        fontFamily: "Outfit-Thin",
    },
    episodesList: {
        paddingHorizontal: 9,
        marginBottom: 60,
    },
    episodeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
    },
    episodeNumberContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 24,
    },
    episodeNumber: {
        color: theme.textColor,
        fontSize: 19,
        fontFamily: "Outfit-SemiBold"
    },
    episodeInfo: {
        flex: 1,
    },
    episodeTitle: {
        color: theme.textColor,
        fontSize: 12,
        fontFamily: "Outfit-Regular"
    },
    episodeDuration: {
        color: theme.subTextColor,
        fontSize: 12,
        fontFamily: "Outfit-Regular"
    },
    miniPlayer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.cardBackground || 'rgba(255, 255, 255, 0.04)',
        paddingVertical: 15,
        paddingHorizontal: 25,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    miniPlayerImage: {
        width: 40,
        height: 40,
        borderRadius: 8,
        marginRight: 10,
    },
    miniPlayerTextContent: {
        flex: 1,
    },
    miniPlayerTitle: {
        color: theme.textColor,
        fontSize: 13,
        fontFamily: "Outfit-Medium"
    },
    miniPlayerCourse: {
        color: theme.subTextColor,
        fontSize: 11,
        fontFamily: "Outfit-Light-BETA"
    },
    miniPlayerPlayPauseButton: {
        padding: 5,
    },
});

export default CourseEpisodesScreen;
