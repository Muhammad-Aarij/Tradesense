import React, { useEffect, useState, useRef } from 'react';
import Slider from '@react-native-community/slider';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Alert, ScrollView, ImageBackground } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../../redux/slice/loaderSlice';
import TrackPlayer, {
    useTrackPlayerEvents,
    Event,
    State as PlaybackState,
    usePlaybackState,
    useProgress,
} from 'react-native-track-player';
import { back, next, repeat, skip, stop, user, shuffleIcon, play, mountain, playb } from '../../assets/images';
// import { BlurView } from '@react-native-community/blur';
import theme from '../../themes/theme';

const { width } = Dimensions.get('window');



const PlayerScreen = ({ route }) => {
    const { AudioTitle, AudioDescr, Thumbnail, AudioUrl, shouldFetchTrack } = route.params;
    // const navigation = useNavigation();
    const dispatch = useDispatch();
    const playbackState = usePlaybackState();
    const progress = useProgress();
    const isPlaying = playbackState.state === PlaybackState.Playing;
    const track = {
        url: AudioUrl,
        title: AudioTitle,
        artist: 'Alwin',
        album: 'Mentally Relax',
        artwork: Thumbnail, // Using the main image as artwork
        description: AudioDescr,
    };

    const isPlayerSetup = useRef(false);
    const [audioLoading, setAudioLoading] = useState(true); // new loading state
    const [currentTrack, setCurrentTrack] = useState(null);

    useEffect(() => {
        const getCurrentTrack = async () => {
            const trackId = await TrackPlayer.getCurrentTrack();
            if (trackId !== null) {
                const trackObject = await TrackPlayer.getTrack(trackId);
                setCurrentTrack(trackObject);
            }
        };

        if (shouldFetchTrack) {
            getCurrentTrack();
        }
    }, [shouldFetchTrack]);



    const setupPlayer = async () => {
        try {
            dispatch(startLoading());
            setAudioLoading(true);

            // Only setup player if not already initialized
            const playerState = await TrackPlayer.getState().catch(() => null);

            if (!isPlayerSetup.current && playerState === null) {
                console.log("Initializing TrackPlayer...");
                await TrackPlayer.setupPlayer();
                isPlayerSetup.current = true;
                console.log("Player initialized");
            } else {
                console.log("Player already initialized");
            }

            console.log("Resetting & loading track...");
            await TrackPlayer.reset(); // Clear previous track
            await TrackPlayer.add([track]);
            await TrackPlayer.play();
            console.log("Playback started");
        } catch (error) {
            console.error('TrackPlayer failed to load/play track:', error);
            Alert.alert("Audio Error", error.message || "Failed to start audio.");
        } finally {
            dispatch(stopLoading());
            setAudioLoading(false);
        }
    };



    useEffect(() => {
        setupPlayer();

        return () => {
            // Clean up properly
            TrackPlayer.stop();
            TrackPlayer.reset();
        };
    }, [AudioUrl]);


    // Toggle Playback function
    const togglePlayback = async () => {
        if (isPlaying) {
            await TrackPlayer.pause();
        } else {
            await TrackPlayer.play();
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <ImageBackground source={{ uri: Thumbnail }} style={styles.container}>
            <View
                style={[StyleSheet.absoluteFill, styles.blurOverlay]}
            // blurType="dark" // 'light', 'dark', 'extraLight' on iOS
            // blurAmount={5}
            // reducedTransparencyFallbackColor="#C0C0C0"
            />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Main Album Art & Info */}
                <View style={styles.albumArtContainer}>
                    <ImageBackground source={{ uri: Thumbnail }} style={styles.albumArt}>
                        <View style={styles.albumArtOverlay}>
                            <View style={styles.artistInfo}>
                                <Image source={user} style={styles.artistImage} />
                                <View>
                                    <Text style={styles.artistName}>Alwin</Text>
                                    <Text style={styles.artistRole}>Mentally Relax</Text>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </View>

                {/* Course Details */}
                <View style={{ width: "100%" }}>
                    <Text style={styles.courseTitle}>{AudioTitle}</Text>
                    <Text style={styles.courseDescription}>{AudioDescr}</Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBarContainer}>
                    <Text style={styles.progressTime}>{formatTime(progress.position)}</Text>
                    <Slider
                        style={styles.progressBar}
                        minimumValue={0}
                        maximumValue={progress.duration}
                        value={progress.position}
                        onSlidingComplete={async (value) => {
                            await TrackPlayer.seekTo(value);
                        }}
                        minimumTrackTintColor={theme.primaryColor}
                        maximumTrackTintColor="#898989"
                        thumbTintColor={theme.primaryColor}
                    />
                    <Text style={styles.progressTime}>{formatTime(progress.duration)}</Text>
                </View>

                {/* Playback Controls */}
                <View style={styles.controlsContainer}>
                    <TouchableOpacity style={{ ...styles.controlButton1, marginRight: 10 }}>
                        <Image source={shuffleIcon} style={styles.controlIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.controlButton} onPress={() => TrackPlayer.skipToPrevious()}>
                        <Image source={skip} style={styles.controlIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.playPauseButton} onPress={togglePlayback}>
                        <Image source={isPlaying ? stop : playb} style={styles.playPauseIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.controlButton} onPress={() => TrackPlayer.skipToNext()}>
                        <Image source={next} style={styles.controlIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ ...styles.controlButton1, marginLeft: 10 }}>
                        <Image source={repeat} style={styles.controlIcon} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        paddingBottom: 0,
    },
    blurOverlay: {
        backgroundColor: 'rgba(12, 12, 12, 0.5)', // Translucent white for light glass
        // borderColor: 'rgba(255, 255, 255, 0.3)',
        // borderWidth: 1,
        backdropFilter: 'blur(10px)', // Only for web — won’t apply natively
        shadowColor: '#fff',
        shadowOffset: { width: -2, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    scrollContent: {
        alignItems: 'center',
        paddingBottom: 80,
    },
    albumArtContainer: {
        width: "100%",
        height: width * 0.8 * (431 / 323),
        borderRadius: 20,
        overflow: 'hidden',
        marginTop: 20,
        marginBottom: 30,
        borderWidth: 0.7,
        borderColor: "#FFF",
    },
    albumArt: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    albumArtOverlay: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        width: '100%',
        flex: 1,
        padding: 15,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    artistInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    artistImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: '#666',
    },
    artistName: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: "Inter-SemiBold",
    },
    artistRole: {
        color: '#CCCCCC',
        fontSize: 12,
        fontFamily: "Inter-Regular",
    },

    courseTitle: {
        color: '#FFFFFF',
        fontSize: 22,
        fontFamily: "Inter-Medium",
        marginBottom: 10,
    },
    courseDescription: {
        color: '#FFF',
        fontSize: 12,
        fontFamily: "Inter-Light-BETA",
        lineHeight: 18,
        marginBottom: 30,
    },
    progressBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
        marginBottom: 30,
    },
    progressTime: {
        color: '#FFFFFF',
        fontSize: 12,
        fontFamily: "Inter-Regular",
        width: 35,
        textAlign: 'center',
    },
    progressBar: {
        flex: 1,
        marginHorizontal: 10,
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    controlButton: {
        padding: 10,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 100,

    },
    controlButton1: {
        padding: 10,
        // backgroundColor: "rgba(255, 255, 255, 0.1)",
        // borderRadius: 100,
    },
    controlIcon: {
        width: 20,
        height: 20,
        tintColor: '#FFFFFF',
        resizeMode: 'contain',

    },
    playPauseButton: {
        width: 55, // Larger button
        height: 55,
        borderRadius: 30,
        backgroundColor: theme.primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        marginHorizontal: 15,
    },
    playPauseIcon: {
        width: 20,
        height: 20,
        tintColor: '#FFFFFF',
        resizeMode: 'contain',
    },
});

export default PlayerScreen;
