import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView
} from 'react-native';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import Orientation from 'react-native-orientation-locker';
import TrackPlayer from 'react-native-track-player';
import {
  next,
  repeat,
  skip,
  stop,
  playb,
  noThumbnail,
  back,
  shuffleIcon,
  attention
} from '../../assets/images';
import theme from '../../themes/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AnimatedInfoBox from '../../components/AnimatedInfoBox';

const { height, width } = Dimensions.get('window');

const VideoPlayerScreen = ({ route }) => {
  const { VideoUrl, Thumbnail, VideoTitle, VideoDescr } = route.params;
  const playerRef = useRef(null);
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [progress, setProgress] = useState({ currentTime: 0, duration: 0 });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);
  const [isDisclaimerVisible, setIsDisclaimerVisible] = useState(false);

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isFullScreen) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    console.log('VideoUrl', VideoUrl);
    TrackPlayer.stop().catch(() => { });
    const timer = setTimeout(() => {
      setPaused(false);
    }, 500);

    return () => {
      clearTimeout(timer);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      Orientation.lockToPortrait();
    };
  }, []);

  useEffect(() => {
    if (isFullScreen) {
      setShowControls(true);
      resetControlsTimeout();
    } else {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    }
  }, [isFullScreen]);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const togglePlayback = () => {
    setPaused(!paused);
    resetControlsTimeout();
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }
    setIsFullScreen(!isFullScreen);
  };

  const skipForward = () => {
    const newTime = Math.min(progress.currentTime + 10, progress.duration);
    playerRef.current?.seek(newTime);
    resetControlsTimeout();
  };

  const skipBackward = () => {
    const newTime = Math.max(progress.currentTime - 10, 0);
    playerRef.current?.seek(newTime);
    resetControlsTimeout();
  };

  const handleVideoLoad = (data) => {
    console.log('Video loaded:', data);
    setVideoLoaded(true);
    setIsBuffering(false);
    setProgress(prev => ({ ...prev, duration: data.duration }));
  };

  const handleVideoProgress = (data) => {
    setProgress(prev => ({ ...prev, currentTime: data.currentTime }));
  };

  const handleVideoBuffer = (bufferData) => {
    console.log('Video buffering:', bufferData.isBuffering);
    setIsBuffering(bufferData.isBuffering);
  };

  const handleVideoError = (error) => {
    console.error('Video Error:', error);
    Alert.alert('Video Error', 'Failed to load video. Please try again.');
    setIsBuffering(false);
  };

  const handleSeek = (value) => {
    playerRef.current?.seek(value);
    resetControlsTimeout();
  };

  const handleVideoTap = () => {
    setShowControls(prev => !prev);
    resetControlsTimeout();
  };

  const videoContainerStyle = isFullScreen
    ? styles.fullScreenVideoContainer
    : styles.albumArtContainer;

  const videoPlayerStyle = isFullScreen
    ? styles.fullScreenVideoPlayer
    : styles.albumArt;

  return (
    <ImageBackground source={{ uri: Thumbnail ?? noThumbnail }} style={[styles.container, { padding: isFullScreen ? 0 : 30 }]}>

      <View style={styles.blurOverlay} />
      <SafeAreaView style={styles.safeArea}>
        {/* Back Button - Always visible */}
        <TouchableOpacity
          style={[styles.backButton, { top: isFullScreen ? insets.top + 20 : insets.top + 5, left: isFullScreen ? 20 : 5 }]}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 5, right: 10 }}
        >
          <Image source={back} style={styles.backIcon} />
        </TouchableOpacity>

        <View style={videoContainerStyle}>
          <Video
            source={{ uri: VideoUrl }}
            ref={playerRef}
            style={videoPlayerStyle}
            resizeMode={isFullScreen ? "cover" : "contain"}
            paused={paused}
            muted={muted}
            repeat={false}
            playWhenInactive={false}
            playInBackground={false}
            poster={Thumbnail}
            posterResizeMode="cover"
            onLoad={handleVideoLoad}
            onProgress={handleVideoProgress}
            onBuffer={handleVideoBuffer}
            onError={handleVideoError}
            onReadyForDisplay={() => {
              console.log('Video ready for display');
              setIsBuffering(false);
            }}
            controls={false}
            onTouchEnd={handleVideoTap}
          />

          {(isBuffering || !videoLoaded) && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={theme.primaryColor} />
              <Text style={styles.loadingText}>
                {!videoLoaded ? 'Loading video...' : 'Buffering...'}
              </Text>
            </View>
          )}

          {isFullScreen && showControls && (
            <View style={[styles.fullScreenControlsOverlay, { paddingBottom: insets.bottom }]}>
              {/* No longer need a separate back button here, as the main one is always visible */}

              <View style={styles.fullScreenProgressBarContainer}>
                <Text style={styles.progressTime}>{formatTime(progress.currentTime)}</Text>
                <Slider
                  style={styles.progressBar}
                  minimumValue={0}
                  maximumValue={progress.duration || 1}
                  value={progress.currentTime}
                  onSlidingComplete={handleSeek}
                  minimumTrackTintColor={theme.primaryColor}
                  maximumTrackTintColor="#898989"
                  thumbTintColor={theme.primaryColor}
                  disabled={!videoLoaded}
                />
                <Text style={styles.progressTime}>{formatTime(progress.duration)}</Text>
              </View>

              <View style={styles.fullScreenControls}>
                <TouchableOpacity
                  style={styles.controlButton1}
                  onPress={() => { setMuted(!muted); resetControlsTimeout(); }}
                >
                  <Image
                    source={shuffleIcon}
                    style={[styles.controlIcon, { opacity: muted ? 0.5 : 1 }]}
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlButton} onPress={skipBackward}>
                  <Image source={skip} style={styles.controlIcon} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.playPauseButton, { opacity: videoLoaded ? 1 : 0.5 }]}
                  onPress={togglePlayback}
                  disabled={!videoLoaded}
                >
                  <Image
                    source={paused ? playb : stop}
                    style={styles.playPauseIcon}
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlButton} onPress={skipForward}>
                  <Image source={next} style={styles.controlIcon} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlButton1} onPress={toggleFullScreen}>
                  <Image source={repeat} style={styles.controlIcon} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {!isFullScreen && (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.infoContainer}>
              <Text style={styles.courseTitle}>{VideoTitle}</Text>
              <Text style={styles.courseDescription}>{VideoDescr}</Text>
            </View>

            <View style={styles.progressBarContainer}>
              <Text style={styles.progressTime}>{formatTime(progress.currentTime)}</Text>
              <Slider
                style={styles.progressBar}
                minimumValue={0}
                maximumValue={progress.duration || 1}
                value={progress.currentTime}
                onSlidingComplete={handleSeek}
                minimumTrackTintColor={theme.primaryColor}
                maximumTrackTintColor="#898989"
                thumbTintColor={theme.primaryColor}
                disabled={!videoLoaded}
              />
              <Text style={styles.progressTime}>{formatTime(progress.duration)}</Text>
            </View>

            <View style={styles.controlsContainer}>
              <TouchableOpacity
                style={styles.controlButton1}
                onPress={() => setIsDisclaimerVisible(true)}
              >
                <Image
                  source={attention}
                  style={[styles.controlIcon, { opacity: muted ? 0.5 : 1 }]}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.controlButton} onPress={skipBackward}>
                <Image source={skip} style={styles.controlIcon} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.playPauseButton, { opacity: videoLoaded ? 1 : 0.5 }]}
                onPress={togglePlayback}
                disabled={!videoLoaded}
              >
                <Image
                  source={paused ? playb : stop}
                  style={styles.playPauseIcon}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.controlButton} onPress={skipForward}>
                <Image source={next} style={styles.controlIcon} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.controlButton1} onPress={toggleFullScreen}>
                <Image source={repeat} style={styles.controlIcon} />
              </TouchableOpacity>
            </View>
          </ScrollView>

        )}
        <AnimatedInfoBox
          isVisible={isDisclaimerVisible}
          onClose={() => setIsDisclaimerVisible(false)}
          title="Disclaimer"
          message={
            'This audio is for educational and informational purposes only. It is not financial advice. Please consult a professional before making any investment decisions.'
          }
          position="center"
          maxWidth={width * 0.85}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    paddingBottom: 0,
  },
  safeArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 12, 12, 0.85)',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: "center",
    flexGrow: 1,
  },
  albumArtContainer: {
    width: '100%',
    height: height / 2.5,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 70,
    marginBottom: 30,
    borderWidth: 0.7,
    borderColor: '#FFF',
    position: 'relative',
  },
  albumArt: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullScreenVideoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenVideoPlayer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 10,
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
    width: 10,
    height: 10,
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },
  fullScreenControlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  fullScreenBackButton: { // This style is no longer explicitly used as a separate button, but its properties are merged
    position: 'absolute',
    left: 0,
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
  fullScreenProgressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  fullScreenControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 0,
  },
});

export default VideoPlayerScreen;
