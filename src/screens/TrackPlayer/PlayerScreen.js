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
  Pressable,
  ActivityIndicator
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useDispatch, useSelector } from 'react-redux';
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
  info,
  userBlue,
  attention,
  louise
} from '../../assets/images';
import theme from '../../themes/theme';
import InstructorInfo from '../../components/InstructorInfo';
import { useUserContext } from '../../context/UserProvider';
import { recordAudioProgress } from '../../functions/recordAudioProgress';
import { API_URL } from '@env';
import OptimizedImage from '../../components/OptimizedImage';
import AnimatedInfoBox from '../../components/AnimatedInfoBox';
import ProfileImage from '../../components/ProfileImage';

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
    resourceId,
    InstructorData,
    isShowInside
  } = route.params;

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const userId = useSelector((state) => state.auth.userId);

  const isPlaying = playbackState.state === PlaybackState.Playing;
  // console.log('====================================');
  // console.log("Instructor NAME", InstructorName);
  // console.log('====================================');
  const isPlayerSetup = useRef(false);
  const [audioLoading, setAudioLoading] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(null);

  // Add logging to debug audio URL issues
  // console.log('=== PlayerScreen Render Debug ===');
  // console.log('AudioTitle:', AudioTitle);
  // console.log('AudioDescr:', AudioDescr);
  // console.log('Thumbnail:', Thumbnail);
  // console.log('AudioUrl:', AudioUrl);
  // console.log('shouldFetchTrack:', shouldFetchTrack);
  // console.log('navigationKey:', navigationKey);
  // console.log('Component render timestamp:', Date.now());
  // console.log('==================================');

  // Repeat functionality state
  const [repeatCount, setRepeatCount] = useState(0); // 0 = off, 1, 2, 7, 31
  const [currentRepeats, setCurrentRepeats] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const repeatOptions = [0, 1, 3, 7, 31]; // 0 means off
  const [isDisclaimerVisible, setIsDisclaimerVisible] = useState(false);

  const track = {
    id: `${AudioTitle}-${AudioUrl}-${Date.now()}-${Math.random()}`,
    url: AudioUrl,
    title: AudioTitle,
    artist: 'Alwin',
    album: 'Mentally Relax',
    artwork: Thumbnail,
    description: AudioDescr,
  };

  // console.log('=== Track Object Debug ===');
  // console.log('Track ID:', track.id);
  // console.log('Track URL:', track.url);
  // console.log('Track Title:', track.title);
  // console.log('Track Artwork:', track.artwork);
  // console.log('==========================');

  useTrackPlayerEvents([Event.PlaybackState], (event) => {
    if (event.type === Event.PlaybackState) {
      // Only show global loader for full track loads, not for seeking
      if ((event.state === PlaybackState.Buffering || event.state === PlaybackState.Loading) && !isSeeking) {
        dispatch(startLoading());

        // Set a 3-second timeout for loading
        const timeout = setTimeout(() => {
          console.log('Audio loading timeout - going back to previous screen');
          dispatch(stopLoading());
          navigation.goBack();
        }, 7000);

        setLoadingTimeout(timeout);
      } else if ((event.state === PlaybackState.Ready || event.state === PlaybackState.Playing) && !isSeeking) {
        // Clear timeout if loading completes successfully
        if (loadingTimeout) {
          clearTimeout(loadingTimeout);
          setLoadingTimeout(null);
        }
        dispatch(stopLoading());
      } else if (event.state === PlaybackState.Ended) {
        // Clear timeout when track ends
        if (loadingTimeout) {
          clearTimeout(loadingTimeout);
          setLoadingTimeout(null);
        }

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

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      // Clear timeout
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      console.log('====================================');
      console.log("Inside CLeandUp Track Player");
      console.log(userId, resourceId, progress.position);
      console.log('====================================');
      // Save progress on unmount
      if (userId && resourceId && progress?.position > 0) {
        console.log('====================================');
        console.log("Inside CLeandUp Track Player SAving Progress");
        console.log('====================================');
        const payload = {
          userId,
          resourceId,
          currentTime: Math.floor(progress.position),
        };

        console.log("📤 Saving progress...", payload);

        fetch(`${API_URL}/api/resource/progress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
          .then(res => res.json())
          .then(res => {
            console.log("✅ Progress saved:", res);
          })
          .catch(err => {
            console.log("❌ Error saving progress:", err);
          });
      }
    };
  }, [loadingTimeout, userId, resourceId, progress.position]);


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
    const remainingRepeats = repeatCount - currentRepeats;
    return remainingRepeats > 0 ? remainingRepeats.toString() : '';
  };

  const setupPlayer = async () => {
    try {
      // console.log('=== setupPlayer Debug ===');
      // console.log('Setting up player with track URL:', track.url);
      // console.log('shouldFetchTrack:', shouldFetchTrack);
      // console.log('=========================');

      dispatch(startLoading());
      setAudioLoading(true);

      // Ensure the player is initialised (only once per app lifecycle)
      if (!isPlayerSetup.current) {
        // console.log('Initializing TrackPlayer for first time');
        try {
          await TrackPlayer.setupPlayer({ waitForBuffer: false });
          // console.log('TrackPlayer.setupPlayer completed successfully');
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
        // console.log('Getting current track...');
        currentTrackId = await TrackPlayer.getCurrentTrack();
        // console.log('getCurrentTrack result:', currentTrackId);

        if (currentTrackId) {
          // console.log('Getting track details...');
          currentTrack = await TrackPlayer.getTrack(currentTrackId);
          // console.log('getTrack result:', currentTrack ? 'Track found' : 'Track not found');
        }
      } catch (trackError) {
        // console.log('Error getting current track:', trackError);
        // Continue with null values
      }

      // console.log('=== Current Track Debug ===');
      // console.log('Current Track ID:', currentTrackId);
      // console.log('Current Track URL:', currentTrack?.url);
      // console.log('New Track URL:', track.url);
      // console.log('============================');
      console.log('🟡 PlayerScreen Debug Info:');
      console.log('➡️  Current Playing Audio URL:', currentTrack?.url || 'None');
      console.log('➡️  New Audio URL:', track.url);
      console.log('🟡=============================');
      console.log('🟡=============================');


      const isSameTrack = currentTrack && currentTrack.url === track.url;

      let needToLoad = false;

      // Decide whether we need to load a new track into the queue
      if (shouldFetchTrack) {
        // Caller explicitly requests a fresh fetch - always reload
        // console.log('shouldFetchTrack is true - forcing reload');
        needToLoad = true;
      } else if (!currentTrack) {
        // No track in queue – need to load
        // console.log('No current track - need to load');
        needToLoad = true;
      } else if (!isSameTrack) {
        // Different track
        // console.log('Different track detected - need to load');
        needToLoad = true;
      } else {
        // Same track and shouldFetchTrack is false (coming from mini-player)
        // console.log('Same track and shouldFetchTrack is false - using existing track');
        needToLoad = false;
      }

      // console.log('=== Track Loading Decision ===');
      // console.log('needToLoad:', needToLoad);
      // console.log('isSameTrack:', isSameTrack);
      // console.log('==============================');

      if (needToLoad) {
        // console.log('Loading new track...');
        //Stop current playback first

        try {
          await TrackPlayer.stop();
          // console.log('TrackPlayer stopped');
        } catch (stopError) {
          // console.log('Stop error (might be expected):', stopError.message);
        }
        try {
          // console.log('About to reset TrackPlayer...');
          await TrackPlayer.reset();
          // console.log('TrackPlayer reset complete');
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
          // console.log('Track added successfully to TrackPlayer');
        } catch (addError) {
          console.log('Add track error:', addError);
        }

        // Verify the track was added
        try {
          const newCurrentTrackId = await TrackPlayer.getCurrentTrack();
          const newCurrentTrack = newCurrentTrackId ? await TrackPlayer.getTrack(newCurrentTrackId) : null;
          // console.log('Verification - Current track after add:', {
          //   id: newCurrentTrackId,
          //   url: newCurrentTrack?.url,
          //   title: newCurrentTrack?.title
          // });
        } catch (verifyError) {
          console.log('Verification error:', verifyError);
        }
      } else {
        console.log('Using existing track');
      }

      // Start / resume playback
      try {
        // console.log('Starting playback...');
        await TrackPlayer.play();
        // console.log('Playback started successfully');
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
      // Remove these lines so loader is only stopped by playback state events
      // dispatch(stopLoading());
      // setAudioLoading(false);
    }
  };

  useEffect(() => {
    // console.log('=== useEffect Triggered ===');
    // console.log('AudioUrl dependency:', AudioUrl);
    // console.log('shouldFetchTrack dependency:', shouldFetchTrack);
    // console.log('navigationKey dependency:', navigationKey);
    // console.log('About to call setupPlayer...');
    // console.log('===========================');

    // Only setup player if we need to fetch a new track or if it's a new navigation
    if (shouldFetchTrack) {
      // console.log('shouldFetchTrack is true - setting up player');
      setupPlayer();
      // Reset repeat state when loading a new track
      setCurrentRepeats(0);
    } else if (navigationKey) {
      // console.log('navigationKey present - setting up player');
      setupPlayer();
      // Reset repeat state when loading a new track
      setCurrentRepeats(0);
    } else {
      // console.log('Skipping setupPlayer - using existing track from mini-player');
      // Remove these lines so loader is only stopped by playback state events
      // dispatch(stopLoading());
      // setAudioLoading(false);
    }

    return () => {
      // console.log('=== useEffect Cleanup ===');
      // console.log('Cleaning up for AudioUrl:', AudioUrl);
      // console.log('========================');
      // Remove these lines so loader is only stopped by playback state events
      // dispatch(stopLoading());
      // Don't reset repeat state on cleanup to preserve the current state
    };
  }, [shouldFetchTrack, navigationKey, AudioUrl]);

  const togglePlayback = async () => {
    if (isSeeking) return; // Prevent multiple clicks while seeking

    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const handleSeek = async (value) => {
    setIsSeeking(true);
    try {
      await TrackPlayer.seekTo(value);
    } catch (error) {
      console.error('Seek error:', error);
    } finally {
      setTimeout(() => setIsSeeking(false), 500);
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
  // console.log('PlayerScreen thumbnail URL:', secureThumbnail);

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
        message={InstructorData?.description}
        position="center"
        maxWidth={width * 0.9}
      />

      <View style={styles.blurOverlay} />

      {/* Disclaimer Button to the left of Back Button */}
      {/* <View style={{ position: 'absolute', left: 10, top: insets.top + 30, flexDirection: 'row', zIndex: 1001 }}>
        <TouchableOpacity
          style={{ marginRight: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}
          onPress={() => setIsDisclaimerVisible(true)}
        >
          <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>Disclaimer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.backButton]}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 5, right: 10 }}
        >
          <Image source={back} style={styles.backIcon} />
        </TouchableOpacity>
      </View> */}

      <AnimatedInfoBox
        isVisible={isDisclaimerVisible}
        onClose={() => setIsDisclaimerVisible(false)}
        title="Disclaimer"
        message={
          'This content is for educational and informational purposes only. It is not financial advice. Please consult a professional before making any investment decisions.'
        }
        position="center"
        maxWidth={width * 0.85}
      />

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
                    {/* {InstructorName && */}
                    <ProfileImage
                      uri={InstructorData?.image}
                      name={InstructorData?.name || 'Instructor'}
                      size={35} // or whatever fits your design
                      borderRadius={30}
                      style={styles.instructorImage}
                    />
                    {/* <OptimizedImage
                      uri={
                        InstructorData?.image?.trim()
                          ? `${InstructorData.image}`
                          : null
                      }
                      style={styles.artistImage}
                      isAvatar={true}
                      username={InstructorData?.name}
                      showInitials={true}
                      fallbackSource={louise}
                      borderRadius={20}
                      showLoadingIndicator={false}
                      initialsStyle={{
                        backgroundColor: 'rgba(29, 172, 255, 0.15)',
                        borderColor: 'rgba(29, 172, 255, 0.3)',
                        text: {
                          fontSize: 12,
                          color: '#1DACFF',
                          fontFamily: 'Outfit-Bold',
                        },
                      }}
                    /> */}

                    {/* } */}
                    <View style={{ marginLeft: 10, }}>
                      <Text style={styles.artistName}>
                        {InstructorData?.name?.trim() ? InstructorData.name : "Louise Nonweiler"}
                      </Text>
                      <Text style={styles.artistRole}>Instructor</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                    {InstructorData?.name &&
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
            <Text numberOfLines={3} style={styles.courseDescription}>{AudioDescr}</Text>
          </View>

          <View style={styles.progressBarContainer}>
            <Text style={styles.progressTime}>{formatTime(progress.position)}</Text>
            <Slider
              style={styles.progressBar}
              minimumValue={0}
              maximumValue={progress.duration}
              value={progress.position}
              onSlidingComplete={handleSeek}
              minimumTrackTintColor={theme.primaryColor}
              maximumTrackTintColor="#898989"
              thumbTintColor={theme.primaryColor}
            />
            <Text style={styles.progressTime}>{formatTime(progress.duration)}</Text>
          </View>

          <View style={styles.controlsContainer}>

            <TouchableOpacity style={styles.controlButton1} onPress={() => setIsDisclaimerVisible(true)}>
              <Image source={attention} style={{ ...styles.controlIcon }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={() => TrackPlayer.skipToPrevious()}>
              <Image source={skip} style={styles.controlIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.playPauseButton} onPress={togglePlayback}>
              {isSeeking ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Image source={isPlaying ? stop : playb} style={styles.playPauseIcon} />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={() => TrackPlayer.skipToNext()}>
              <Image source={next} style={styles.controlIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton1} onPress={toggleRepeat}>
              <View style={styles.repeatButtonContainer}>
                <Image source={repeat} style={[styles.controlIcon, { tintColor: repeatCount > 0 ? theme.primaryColor : '#FFFFFF' }]} />
                {repeatCount > 0 && getRepeatButtonText() && (
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
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    color: theme.primaryColor,
    fontSize: 12,
    fontFamily: 'Outfit-Bold',
  },
  artistRole: {
    color: '#eeeeeeff',
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
  },
  infoContainer: {
    width: '100%',
  },
  courseTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Outfit-Medium',
    marginBottom: 15,
  },
  courseDescription: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Outfit-Light',
    lineHeight: 18,
    marginBottom: 20,
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
    fontFamily: 'Outfit-Regular',
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
    width: 10,
    height: 10,
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
    fontFamily: 'Outfit-Medium',
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

