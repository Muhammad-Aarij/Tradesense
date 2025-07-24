import React, { useEffect, useState } from 'react';
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

const { width, height } = Dimensions.get('window');

const CourseEpisodesScreen = ({ route }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { courseId, courseTitle, courseImage, instructorImage } = route.params || {};
    const { data: course, isLoading } = useCourseDetail(courseId);
    const [currentEpisode, setCurrentEpisode] = useState(null);
    const [favoriteIds, setFavoriteIds] = useState([]);
    const userId = useSelector(state => state.auth);
    const [durations, setDurations] = useState({});
    const modules = course?.courseModules || [];
    console.log("Specific COurse Data", instructorImage)
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
        <ImageBackground source={bg} style={styles.container}>
            <SafeAreaView>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Header title={course?.title || courseTitle} style={{ marginBottom: 30, }} />
                    <View style={styles.mainImageContainer}>
                        <Image
                            source={courseImage ? { uri: courseImage } : mountain}
                            style={styles.mainCourseImage}
                        />
                        <View style={styles.imgOverlay} />
                        <View style={styles.imageOverlay}>
                            <View style={styles.overlayTop}>
                                {/* <View style={styles.timeBadge}>
                                    <Image source={play} style={{ width: 10, height: 10 }} />
                                    <Text style={styles.timeBadgeText}>15min</Text>
                                </View> */}
                                <View style={styles.instructorInfo}>
                                    <Image
                                        source={instructorImage ? { uri: `${API_URL}/${instructorImage}` } : userBlue}
                                        style={styles.instructorImage} />
                                    <View>
                                        <Text style={styles.instructorName}>{course?.instructorName}</Text>
                                        <Text style={styles.instructorSubtitle}>{course?.instructorExperienceLevel}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.courseDetails}>
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
                                    // InstructorName: course?.instructorName,
                                    // InstructorImage: course?.instructorImage,
                                    // instructorInfo: course?.instructorInfo,
                                    // instructorDescription: course?.instructorDescription,
                                    // instructorLinks: course?.instructorLinks,
                                    // InstructorTag: course?.instructorExperienceLevel,
                                    InstructorData: {
                                        name: course?.instructorName,
                                        email: course?.instructorInfo,
                                        description: course?.instructorDescription,
                                        experienceLevel: course?.instructorExperienceLevel,
                                        image: course?.instructorImage,
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
                                <TouchableOpacity
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
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                {/* Mini Player */}
                {/* {currentEpisode && (
                    <TouchableOpacity
                        style={styles.miniPlayer}
                        onPress={() =>
                            navigation.navigate('TrackPlayer', {
                                AudioTitle: currentEpisode.title,
                                AudioDescr: currentEpisode.description,
                                Thumbnail: courseImage,
                                AudioUrl: currentEpisode.url,
                                shouldFetchTrack: true, // ✅ from mini player
                                showInstructor: true, 
                            })
                        }
                    >
                        <Image
                            source={courseImage ? { uri: courseImage } : mountain}
                            style={styles.miniPlayerImage}
                        />
                        <View style={styles.miniPlayerTextContent}>
                            <Text style={styles.miniPlayerTitle}>{currentEpisode?.title}</Text>
                            <Text style={styles.miniPlayerCourse}>{courseTitle}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.miniPlayerPlayPauseButton}
                            onPress={togglePlayback}
                        >
                            <Image source={isPlaying ? stop : play}
                                style={{ width: 20, height: 18, resizeMode: 'contain' }}
                            />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )
                } */}
            </SafeAreaView>
        </ImageBackground >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 25,
        // paddingTop: 20,
        // paddingVertical: 0,
    },
    scrollContent: {
        paddingHorizontal: 25,
        // paddingBottom: 20,
        paddingBottom: height * 0.15,
    },
    mainImageContainer: {
        width: '100%',
        height: width * 0.55,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
    },
    mainCourseImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        position: "relative",
    },
    imgOverlay: {
        zIndex: 10,
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: 'rgba(31, 30, 30, 0.7)',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 15,
    },
    overlayTop: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    timeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(119, 119, 119, 0.66)',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    timeBadgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        marginLeft: 5,
    },
    instructorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        zIndex: 100,
    },
    instructorImage: {
        width: 40,
        height: 40,
        borderRadius: 100,
        marginRight: 5,
    },
    instructorName: {
        color: theme.primaryColor,
        fontSize: 13,
        fontFamily: 'Inter-SemiBold',
    },
    instructorSubtitle: {
        color: "white",
        fontSize: 11,
        fontFamily: 'Inter-Light-BETA',
    },
    courseDetails: {
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    courseDescription: {
        color: '#FFFFFF',
        fontSize: 13,
        lineHeight: 20,
        fontFamily: "Inter-Light-BETA",
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
        color: '#FFF',
        fontSize: 19.4,
        fontFamily: "Inter-SemiBold"
    },
    episodeInfo: {
        flex: 1,
    },
    episodeTitle: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: "Inter-Regular"
    },
    episodeDuration: {
        color: '#FFFFFF',
        fontSize: 12,
        fontFamily: "Inter-Regular"
    },
    miniPlayer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
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
        color: '#FFFFFF',
        fontSize: 13,
        fontFamily: "Inter-Medium"
    },
    miniPlayerCourse: {
        color: '#AAAAAA',
        fontSize: 11,
        fontFamily: "Inter-Light-BETA"
    },
    miniPlayerPlayPauseButton: {
        padding: 5,
    },
});

export default CourseEpisodesScreen;
