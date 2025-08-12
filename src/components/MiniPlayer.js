import React, { useRef, useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import {
  usePlaybackState,
  useProgress,
  State as PlaybackState,
  useActiveTrack,
} from 'react-native-track-player';
import TrackPlayer from 'react-native-track-player';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { playb, stop, noThumbnail } from '../assets/images';
import theme from '../themes/theme';
import { useUserContext } from '../context/UserProvider';
import { recordAudioProgress } from '../functions/recordAudioProgress';
import { ThemeContext } from '../context/ThemeProvider';

const { width } = Dimensions.get('window');

const MiniPlayer = () => {
  const navigation = useNavigation();
  const playbackState = usePlaybackState();
  const activeTrack = useActiveTrack();
  const progress = useProgress();
  const insets = useSafeAreaInsets();
  const userContext = useUserContext();
  const userId = userContext?.id;
  const { isDarkMode } = useContext(ThemeContext);

  const isPlaying = playbackState.state === PlaybackState.Playing;

  // Swipe-to-dismiss state & animation
  const [visible, setVisible] = useState(true);
  const translateY = useRef(new Animated.Value(0)).current;

  // Re-show the mini-player automatically when a new track starts
  const previousTrackId = useRef(activeTrack?.id);
  useEffect(() => {
    if (activeTrack?.id !== previousTrackId.current) {
      // console.log('=== MiniPlayer Track Change Debug ===');
      // console.log('Previous Track ID:', previousTrackId.current);
      // console.log('New Track ID:', activeTrack?.id);
      // console.log('New Track URL:', activeTrack?.url);
      // console.log('New Track Title:', activeTrack?.title);
      // console.log('=====================================');

      previousTrackId.current = activeTrack?.id;
      setVisible(true);
      translateY.setValue(0);
    }
  }, [activeTrack?.id, translateY]);

  // Add a new effect to automatically re-show the mini-player whenever playback starts again
  useEffect(() => {
    if (playbackState.state === PlaybackState.Playing) {
      // Audio resumed/started – ensure mini player is visible
      setVisible(true);
      translateY.setValue(0);
    }
  }, [playbackState.state, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > 5,
      onPanResponderMove: Animated.event([null, { dy: translateY }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gs) => {
        const shouldClose = gs.dy > 60 || gs.vy > 1.2;
        if (shouldClose) {
          Animated.timing(translateY, {
            toValue: 120,
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            (async () => {
              try {
                // Stop the player and reset position, clearing progress without destroying queue
                await TrackPlayer.stop();
                await TrackPlayer.seekTo(0);
                // Record progress when mini player is dismissed
                // console.log('====================================');
                // console.log("Mini Player Progress",userId, activeTrack?.url, progress?.position);
                // console.log('====================================');
                if (userId && activeTrack?.url && progress?.position) {
                  recordAudioProgress({
                    userId,
                    resourceId: activeTrack.url,
                    currentTime: progress.position,
                  });
                }
              } catch (err) {
                console.error('Error resetting TrackPlayer:', err);
              }
              setVisible(false);
              translateY.setValue(0); // reset for next time
            })();
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  // Get current route name to hide mini player on certain screens
  const routeName = useNavigationState(state => {
    if (!state) return null;

    // Navigate through the nested navigation structure to get the current screen
    let currentState = state;
    while (currentState.routes && currentState.index !== undefined) {
      const currentRoute = currentState.routes[currentState.index];
      if (currentRoute.state) {
        currentState = currentRoute.state;
      } else {
        return currentRoute.name;
      }
    }
    return null;
  });

  // Don't show mini player if no track is active or on certain screens
  if (!visible || !activeTrack || routeName === 'TrackPlayer' || routeName === 'VideoPlayer') {
    return null;
  }

  const togglePlayback = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const openFullPlayer = () => {
    try {
      // If the current track or navigation params contain InstructorData, block navigation or handle gracefully
      if (activeTrack && activeTrack.InstructorData) {
        // Option 1: Show a message (replace with your preferred UI feedback)
        // alert('Cannot open instructor details while audio is playing.');
        return;
      }
      // console.log('=== MiniPlayer Navigation Debug ===');
      // console.log('Opening full player with:');
      // console.log('AudioTitle:', activeTrack.title);
      // console.log('AudioUrl:', activeTrack.url);
      // console.log('Thumbnail:', activeTrack.artwork);
      // console.log('shouldFetchTrack: false (preserve existing playback)');
      // console.log('navigationKey: undefined (no reset)');
      // console.log('===================================');

      navigation.navigate('TrackPlayer', {
        AudioTitle: activeTrack.title,
        AudioDescr: activeTrack.description || activeTrack.album || '',
        Thumbnail: activeTrack.artwork,
        AudioUrl: activeTrack.url,
        shouldFetchTrack: false, // Don't fetch new track, use current one
        // Note: No navigationKey - this preserves existing playback
      });
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  // Ensure HTTPS for secure image loading
  const secureArtwork = activeTrack.artwork?.startsWith('http://')
    ? activeTrack.artwork.replace('http://', 'https://')
    : activeTrack.artwork;
  // console.log('MiniPlayer artwork URL:', secureArtwork);

  const colors = {
    surface: isDarkMode ? 'rgba(11, 16, 22, 0.9)' : 'rgba(255, 255, 255, 0.98)',
    border: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
    progressBg: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
    title: isDarkMode ? '#FFFFFF' : '#111111',
    artist: isDarkMode ? '#CCCCCC' : '#5A5A5A',
    albumPlaceholder: isDarkMode ? '#333333' : '#E5E5E5',
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]} {...panResponder.panHandlers}>
      <TouchableOpacity style={{ flex: 1 }} onPress={openFullPlayer} activeOpacity={0.8}>
        {/* Background with gradient effect */}
        <View style={[styles.background, { backgroundColor: colors.surface, borderColor: colors.border }]} />

        {/* Progress bar */}
        <View style={[styles.progressContainer, { backgroundColor: colors.progressBg }]}>
          <View
            style={[
              styles.progressBar,
              { width: `${(progress.position / progress.duration) * 100 || 0}%` }
            ]}
          />
        </View>

        <View style={styles.content}>
          {/* Album Art */}
          <Image
            source={{ uri: secureArtwork || noThumbnail }}
            style={[styles.albumArt, { backgroundColor: colors.albumPlaceholder }]}
            onError={(error) => console.log('MiniPlayer image loading error:', error?.nativeEvent?.error, secureArtwork)}
            onLoad={() => console.log('MiniPlayer image loaded successfully:', secureArtwork)}
          />

          {/* Track Info */}
          <View style={styles.trackInfo}>
            <Text style={[styles.title, { color: colors.title }]} numberOfLines={1}>
              {activeTrack.title}
            </Text>
            <Text style={[styles.artist, { color: colors.artist }]} numberOfLines={1}>
              {activeTrack.artist || 'Unknown Artist'}
            </Text>
          </View>

          {/* Play/Pause Button */}
          <TouchableOpacity
            style={styles.playButton}
            onPress={togglePlayback}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              source={isPlaying ? stop : playb}
              style={styles.playIcon}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80, // Position above bottom navigation
    left: 20,
    right: 20,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000, // Ensure it appears above other elements
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 16, 22, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.primaryColor,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  albumArt: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  trackInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Outfit-Medium',
    marginBottom: 2,
  },
  artist: {
    color: '#CCCCCC',
    fontSize: 10,
    fontFamily: 'Outfit-Regular',
  },
  playButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: theme.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: 16,
    height: 16,
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },
});

export default MiniPlayer; 