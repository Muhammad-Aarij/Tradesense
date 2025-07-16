import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ImageBackground,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Pressable
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  startLoading,
  stopLoading
} from '../../redux/slice/loaderSlice';
import TrackPlayer, {
  usePlaybackState,
  useProgress,
  State as PlaybackState,
  useTrackPlayerEvents,
  Event,
} from 'react-native-track-player';
import {
  next,
  repeat,
  skip,
  stop,
  user,
  shuffleIcon,
  playb,
  video,
  video2,
  noThumbnail,
  back,
  userDefault,
  info
} from '../../assets/images';
import theme from '../../themes/theme';
import InstructorInfo from '../../components/InstructorInfo';

const { height, width } = Dimensions.get('window');

const PlayerScreen = ({ route }) => {
  const {
    AudioTitle,
    AudioDescr,
    Thumbnail,
    AudioUrl,
    shouldFetchTrack,
    navigationKey,
    InstructorName,
    InstructorImage,
    InstructorTag,
    InstructorData,
    isShowInside
  } = route.params;

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const isPlaying = playbackState.state === PlaybackState.Playing;

  const isPlayerSetup = useRef(false);
  const [audioLoading, setAudioLoading] = useState(true);

  // Add logging to debug audio URL issues
  console.log('=== PlayerScreen Render Debug ===');
  console.log('AudioTitle:', AudioTitle);
  console.log('AudioDescr:', AudioDescr);
  console.log('Thumbnail:', Thumbnail);
  console.log('AudioUrl:', AudioUrl);
  console.log('shouldFetchTrack:', shouldFetchTrack);
  console.log('navigationKey:', navigationKey);
  console.log('Component render timestamp:', Date.now());
  console.log('==================================');

  // Repeat functionality state
  const [repeatCount, setRepeatCount] = useState(0); // 0 = off, 1, 2, 7, 31
  const [currentRepeats, setCurrentRepeats] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const repeatOptions = [0, 1, 2, 7, 31]; // 0 means off

  const track = {
    id: `${AudioTitle}-${AudioUrl}-${Date.now()}-${Math.random()}`,
    url: AudioUrl,
    title: AudioTitle,
    artist: 'Alwin',
    album: 'Mentally Relax',
    artwork: Thumbnail,
    description: AudioDescr,
  };

  console.log('=== Track Object Debug ===');
  console.log('Track ID:', track.id);
  console.log('Track URL:', track.url);
  console.log('Track Title:', track.title);
  console.log('Track Artwork:', track.artwork);
  console.log('==========================');

  useTrackPlayerEvents([Event.PlaybackState], (event) => {
    if (event.type === Event.PlaybackState) {
      if (event.state === PlaybackState.Buffering || event.state === PlaybackState.Loading) {
        dispatch(startLoading());
      } else if (event.state === PlaybackState.Ready || event.state === PlaybackState.Playing) {
        dispatch(stopLoading());
      } else if (event.state === PlaybackState.Ended) {
        // Handle repeat when track ends
        if (repeatCount > 0 && currentRepeats < repeatCount) {
          handleTrackEnded();
        } else {
          // Reset repeat counter when all repeats are done
          setCurrentRepeats(0);
        }
      }
    }
  });

  const handleTrackEnded = async () => {
    try {
      setCurrentRepeats(prev => prev + 1);
      // Small delay to ensure track has fully ended
      setTimeout(async () => {
        try {
          await TrackPlayer.seekTo(0);
          await TrackPlayer.play();
        } catch (error) {
          console.error('Error repeating track:', error);
        }
      }, 100);
    } catch (error) {
      console.error('Error in handleTrackEnded:', error);
    }
  };

  const toggleRepeat = () => {
    const currentIndex = repeatOptions.indexOf(repeatCount);
    const nextIndex = (currentIndex + 1) % repeatOptions.length;
    const nextRepeatCount = repeatOptions[nextIndex];

    setRepeatCount(nextRepeatCount);
    setCurrentRepeats(0); // Reset current repeats when changing mode
  };

  const getRepeatButtonText = () => {
    if (repeatCount === 0) return '';
    return repeatCount.toString();
  };

  const setupPlayer = async () => {
    try {
      console.log('=== setupPlayer Debug ===');
      console.log('Setting up player with track URL:', track.url);
      console.log('shouldFetchTrack:', shouldFetchTrack);
      console.log('=========================');

      dispatch(startLoading());
      setAudioLoading(true);

      // Ensure the player is initialised (only once per app lifecycle)
      if (!isPlayerSetup.current) {
        console.log('Initializing TrackPlayer for first time');
        try {
          await TrackPlayer.setupPlayer({ waitForBuffer: false });
          console.log('TrackPlayer.setupPlayer completed successfully');
          isPlayerSetup.current = true;
        } catch (setupError) {
          console.log('TrackPlayer.setupPlayer error:', setupError);
          // Try to continue anyway
          isPlayerSetup.current = true;
        }
      }

      let currentTrackId = null;
      let currentTrack = null;

      try {
        console.log('Getting current track...');
        currentTrackId = await TrackPlayer.getCurrentTrack();
        console.log('getCurrentTrack result:', currentTrackId);

        if (currentTrackId) {
          console.log('Getting track details...');
          currentTrack = await TrackPlayer.getTrack(currentTrackId);
          console.log('getTrack result:', currentTrack ? 'Track found' : 'Track not found');
        }
      } catch (trackError) {
        console.log('Error getting current track:', trackError);
        // Continue with null values
      }

      console.log('=== Current Track Debug ===');
      console.log('Current Track ID:', currentTrackId);
      console.log('Current Track URL:', currentTrack?.url);
      console.log('New Track URL:', track.url);
      console.log('============================');

      const isSameTrack = currentTrack && currentTrack.url === track.url;

      let needToLoad = false;

      // Decide whether we need to load a new track into the queue
      if (shouldFetchTrack) {
        // Caller explicitly requests a fresh fetch - always reload
        console.log('shouldFetchTrack is true - forcing reload');
        needToLoad = true;
      } else if (!currentTrack) {
        // No track in queue – need to load
        console.log('No current track - need to load');
        needToLoad = true;
      } else if (!isSameTrack) {
        // Different track
        console.log('Different track detected - need to load');
        needToLoad = true;
      } else {
        // Same track and shouldFetchTrack is false (coming from mini-player)
        console.log('Same track and shouldFetchTrack is false - using existing track');
        needToLoad = false;
      }

      console.log('=== Track Loading Decision ===');
      console.log('needToLoad:', needToLoad);
      console.log('isSameTrack:', isSameTrack);
      console.log('==============================');

      if (needToLoad) {
        console.log('Loading new track...');

        // Stop current playback first
        try {
          await TrackPlayer.stop();
          console.log('TrackPlayer stopped');
        } catch (stopError) {
          console.log('Stop error (might be expected):', stopError.message);
        }

        try {
          console.log('About to reset TrackPlayer...');
          await TrackPlayer.reset();
          console.log('TrackPlayer reset complete');
        } catch (resetError) {
          console.log('Reset error:', resetError);
        }

        try {
          console.log('About to add track:', {
            id: track.id,
            url: track.url,
            title: track.title,
            artwork: track.artwork
          });
          await TrackPlayer.add(track);
          console.log('Track added successfully to TrackPlayer');
        } catch (addError) {
          console.log('Add track error:', addError);
        }

        // Verify the track was added
        try {
          const newCurrentTrackId = await TrackPlayer.getCurrentTrack();
          const newCurrentTrack = newCurrentTrackId ? await TrackPlayer.getTrack(newCurrentTrackId) : null;
          console.log('Verification - Current track after add:', {
            id: newCurrentTrackId,
            url: newCurrentTrack?.url,
            title: newCurrentTrack?.title
          });
        } catch (verifyError) {
          console.log('Verification error:', verifyError);
        }
      } else {
        console.log('Using existing track');
      }

      // Start / resume playback
      try {
        console.log('Starting playback...');
        await TrackPlayer.play();
        console.log('Playback started successfully');
      } catch (playError) {
        console.log('Play error:', playError);
      }

      // Final verification of what's actually playing
      try {
        const finalTrackId = await TrackPlayer.getCurrentTrack();
        const finalTrack = finalTrackId ? await TrackPlayer.getTrack(finalTrackId) : null;
        console.log('=== Final Playback Verification ===');
        console.log('Actually playing track:', {
          id: finalTrackId,
          url: finalTrack?.url,
          title: finalTrack?.title
        });
        console.log('===================================');
      } catch (finalError) {
        console.log('Final verification error:', finalError);
      }
    } catch (error) {
      if (!error?.message?.includes('already been initialized')) {
        Alert.alert('Track Error', error?.message || 'Playback failed');
        console.error('TrackPlayer setup error:', error);
      }
    } finally {
      dispatch(stopLoading());
      setAudioLoading(false);
    }
  };

  useEffect(() => {
    console.log('=== useEffect Triggered ===');
    console.log('AudioUrl dependency:', AudioUrl);
    console.log('shouldFetchTrack dependency:', shouldFetchTrack);
    console.log('navigationKey dependency:', navigationKey);
    console.log('About to call setupPlayer...');
    console.log('===========================');

    // Only setup player if we need to fetch a new track or if it's a new navigation
    if (shouldFetchTrack) {
      console.log('shouldFetchTrack is true - setting up player');
      setupPlayer();
      // Reset repeat state when loading a new track
      setCurrentRepeats(0);
    } else if (navigationKey) {
      console.log('navigationKey present - setting up player');
      setupPlayer();
      // Reset repeat state when loading a new track
      setCurrentRepeats(0);
    } else {
      console.log('Skipping setupPlayer - using existing track from mini-player');
      // Don't call setupPlayer, just ensure loading state is stopped
      dispatch(stopLoading());
      setAudioLoading(false);
    }

    return () => {
      console.log('=== useEffect Cleanup ===');
      console.log('Cleaning up for AudioUrl:', AudioUrl);
      console.log('========================');
      dispatch(stopLoading());
      // Reset repeat state on cleanup
      setCurrentRepeats(0);
    };
  }, [shouldFetchTrack, navigationKey, AudioUrl]);

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

  // Ensure HTTPS for secure image loading
  const secureThumbnail = Thumbnail?.startsWith('http://') ? Thumbnail.replace('http://', 'https://') : Thumbnail;
  const fallbackThumbnail = secureThumbnail ?? noThumbnail;
  console.log('PlayerScreen thumbnail URL:', secureThumbnail);

  return (
    <ImageBackground
      source={{ uri: fallbackThumbnail }}
      style={styles.container}
      onError={(error) => console.log('PlayerScreen background image error:', error?.nativeEvent?.error, fallbackThumbnail)}
      onLoad={() => console.log('PlayerScreen background image loaded:', fallbackThumbnail)}
    >

      <InstructorInfo
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        InstructorImage={InstructorData?.image}
        InstructorName={InstructorData?.name}
        InstructorTag={InstructorData?.experienceLevel}
        instructorLinks={InstructorData?.links}
        message="These are personalized recommendations based on your trading goals, experience level, and learning preferences. We analyze your behavior and interests to suggest the most relevant content that will help you grow as a trader."
        position="center"
        maxWidth={width * 0.9}
      />

      <View style={styles.blurOverlay} />

      {/* Back Button */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 30 }]}
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 10, bottom: 10, left: 5, right: 10 }}
      >
        <Image source={back} style={styles.backIcon} />
      </TouchableOpacity>

      <SafeAreaView style={styles.safeAreaContent}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.albumArtContainer}>
            {secureThumbnail &&
              <ImageBackground
                source={{ uri: secureThumbnail }}
                style={styles.albumArt}
                onError={(error) => console.log('PlayerScreen album art error:', error?.nativeEvent?.error, secureThumbnail)}
                onLoad={() => console.log('PlayerScreen album art loaded:', secureThumbnail)}
              >

                <View style={styles.albumArtOverlay}>
                  <View style={{ ...styles.artistInfo, marginBottom: 10, }}>
                    {InstructorName &&
                      <Image source={InstructorImage ? InstructorImage : userDefault} style={styles.artistImage} />
                    }
                    <View>
                      <Text style={styles.artistName}>{InstructorName}</Text>
                      <Text style={styles.artistRole}>{InstructorTag}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                    {InstructorName &&
                      <Image source={info} style={{ width: 20, height: 20, tintColor: '#FFF', marginBottom: 20, marginLeft: 10, }} />
                    }
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            }
          </View>

          <View style={styles.infoContainer}>
            {/* {(!Thumbnail && false) &&
              <View style={{ ...styles.artistInfo, marginBottom: 10, }}>
                <Image source={InstructorImage} style={styles.artistImage} />
                <View>
                  <Text style={styles.artistName}>{InstructorName}</Text>
                  <Text style={styles.artistRole}>{InstructorTag}</Text>
                </View>
              </View>} */}
            <Text style={styles.courseTitle}>{AudioTitle}</Text>
            <Text style={styles.courseDescription}>{AudioDescr}</Text>
          </View>

          <View style={styles.progressBarContainer}>
            <Text style={styles.progressTime}>{formatTime(progress.position)}</Text>
            <Slider
              style={styles.progressBar}
              minimumValue={0}
              maximumValue={progress.duration}
              value={progress.position}
              onSlidingComplete={async (value) => await TrackPlayer.seekTo(value)}
              minimumTrackTintColor={theme.primaryColor}
              maximumTrackTintColor="#898989"
              thumbTintColor={theme.primaryColor}
            />
            <Text style={styles.progressTime}>{formatTime(progress.duration)}</Text>
          </View>

          <View style={styles.controlsContainer}>
            <TouchableOpacity style={styles.controlButton1}>
              <Image source={shuffleIcon} style={{ ...styles.controlIcon, display: "none" }} />
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
            <TouchableOpacity style={styles.controlButton1} onPress={toggleRepeat}>
              <View style={styles.repeatButtonContainer}>
                <Image source={repeat} style={[styles.controlIcon, { tintColor: repeatCount > 0 ? theme.primaryColor : '#FFFFFF' }]} />
                {repeatCount > 0 && (
                  <Text style={styles.repeatCountText}>{getRepeatButtonText()}</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 12, 12, 0.85)',
  },
  safeAreaContent: {
    flex: 1,
    alignItems: 'center',

  },
  scrollContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
    paddingHorizontal: 30,

  },
  albumArtContainer: {
    width: '100%',
    height: height * 0.50,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 30,
    borderWidth: 0.7,
    borderColor: '#FFF',
  },
  albumArt: {

    flex: 1,
    // resizeMode:"contain",
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
    backgroundColor: 'rgba(0,0,0,0.3)',
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
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  artistRole: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  infoContainer: {
    width: '100%',
  },
  courseTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    marginBottom: 5,
  },
  courseDescription: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Inter-Light-BETA',
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
    fontFamily: 'Inter-Regular',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 100,
  },
  controlButton1: {
    padding: 10,
  },
  controlIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },
  playPauseButton: {
    width: 55,
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
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1000,
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  backIcon: {
    width: 15,
    height: 15,
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },
  repeatButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  repeatCountText: {
    color: theme.primaryColor,
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#000',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 2,
  },
});

export default PlayerScreen;

