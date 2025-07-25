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
  Alert
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
  user,
  shuffleIcon,
  playb,
  noThumbnail
} from '../../assets/images';
import theme from '../../themes/theme';

const { height } = Dimensions.get('window');

const VideoPlayerScreen = ({ route }) => {
  const { VideoUrl, Thumbnail, VideoTitle, VideoDescr } = route.params;
  const playerRef = useRef(null);
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [progress, setProgress] = useState({ currentTime: 0, duration: 0 });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    console.log('VideoUrl', VideoUrl);
    // Stop any playing audio when video starts
    TrackPlayer.stop().catch(() => {});
    const timer = setTimeout(() => {
      setPaused(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const togglePlayback = () => {
    console.log('Toggle playback - current paused state:', paused);
    setPaused(!paused);
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
  };

  const skipBackward = () => {
    const newTime = Math.max(progress.currentTime - 10, 0);
    playerRef.current?.seek(newTime);
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
  };

  return (
    <ImageBackground source={{ uri: Thumbnail ?? noThumbnail }} style={styles.container}>
      <View style={styles.blurOverlay} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.albumArtContainer}>
          <Video
            source={{ uri: VideoUrl }}
            ref={playerRef}
            style={styles.albumArt}
            resizeMode="contain"
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
          />

          {/* <View style={styles.albumArtOverlay}>
            <View style={styles.artistInfo}>
              <Image source={user} style={styles.artistImage} />
              <View>
                <Text style={styles.artistName}>Alwin</Text>
                <Text style={styles.artistRole}>Mentally Relax</Text>
              </View>
            </View>
          </View> */}

          {(isBuffering || !videoLoaded) && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={theme.primaryColor} />
              <Text style={styles.loadingText}>
                {!videoLoaded ? 'Loading video...' : 'Buffering...'}
              </Text>
            </View>
          )}
        </View>

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
            onPress={() => setMuted(!muted)}
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
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:"center",
    justifyContent: "center",
    padding: 30,
    paddingBottom: 0,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 12, 12, 0.85)',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: "center",
    flex:1,
    // borderWidth:3,
    // borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  albumArtContainer: {
    width: '100%',
    height: height * 0.25,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 30,
    borderWidth: 0.7,
    borderColor: '#FFF',
    position: 'relative',
  },
  albumArt: {
    flex: 1,
    backgroundColor: '#000',
  },
  albumArtOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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
});

export default VideoPlayerScreen;