import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions,
  Image, ImageBackground, ActivityIndicator, ScrollView
} from 'react-native';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import Orientation from 'react-native-orientation-locker';
import { playb, stop, user } from '../../assets/images';
import theme from '../../themes/theme';

const { width, height } = Dimensions.get('window');

const VideoPlayerScreen = ({ route }) => {
  const { VideoUrl, Thumbnail, VideoTitle, VideoDescr } = route.params;
  const playerRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [progress, setProgress] = useState({ currentTime: 0, duration: 0 });
  const [isFullScreen, setIsFullScreen] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) Orientation.lockToLandscape();
    else Orientation.lockToPortrait();
    setIsFullScreen(!isFullScreen);
  };

  return (
    <ImageBackground source={{ uri: Thumbnail }} style={styles.container}>
      <View style={[StyleSheet.absoluteFill, styles.blurOverlay]} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.albumArtContainer}>
          <Video
            source={{ uri: VideoUrl }}
            ref={playerRef}
            style={styles.albumArt}
            resizeMode="cover"
            paused={paused}
            muted={muted}
            onBuffer={({ isBuffering }) => setIsBuffering(isBuffering)}
            onLoad={(data) => setProgress(p => ({ ...p, duration: data.duration }))}
            onProgress={(data) => setProgress(p => ({ ...p, currentTime: data.currentTime }))}
          />
          <View style={styles.albumArtOverlay}>
            <View style={styles.artistInfo}>
              <Image source={user} style={styles.artistImage} />
              <View>
                <Text style={styles.artistName}>Alwin</Text>
                <Text style={styles.artistRole}>Mentally Relax</Text>
              </View>
            </View>
          </View>
          {isBuffering && <ActivityIndicator size="large" color="#fff" style={styles.loader} />}
        </View>

        <Text style={styles.courseTitle}>{VideoTitle}</Text>
        <Text style={styles.courseDescription}>{VideoDescr}</Text>

        <View style={styles.progressBarContainer}>
          <Text style={styles.progressTime}>{formatTime(progress.currentTime)}</Text>
          <Slider
            style={styles.progressBar}
            minimumValue={0}
            maximumValue={progress.duration}
            value={progress.currentTime}
            onSlidingComplete={(value) => playerRef.current.seek(value)}
            minimumTrackTintColor={theme.primaryColor}
            maximumTrackTintColor="#898989"
            thumbTintColor={theme.primaryColor}
          />
          <Text style={styles.progressTime}>{formatTime(progress.duration)}</Text>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.controlButton1} onPress={() => setMuted(!muted)}>
            <Text style={styles.controlText}>{muted ? 'Unmute' : 'Mute'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.playPauseButton} onPress={() => setPaused(!paused)}>
            <Image source={paused ? playb : stop} style={styles.playPauseIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton1} onPress={toggleFullScreen}>
            <Text style={styles.controlText}>Fullscreen</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 0, backgroundColor: '#000' },
  scrollContent: { paddingBottom: 60 },
  albumArtContainer: { width: '100%', height: width * 0.65, marginBottom: 20 },
  albumArt: { width: '100%', height: '100%' },
  albumArtOverlay: {
    position: 'absolute', bottom: 10, left: 10, right: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
  },
  artistInfo: { flexDirection: 'row', alignItems: 'center' },
  artistImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  artistName: { color: '#fff', fontSize: 14, fontFamily: 'Inter-Medium' },
  artistRole: { color: '#aaa', fontSize: 11, fontFamily: 'Inter-Light-BETA' },
  loader: { position: 'absolute', alignSelf: 'center', top: '45%' },
  courseTitle: { color: '#FFFFFF', fontSize: 18, fontFamily: 'Inter-Medium', paddingHorizontal: 20 },
  courseDescription: { color: '#AAAAAA', fontSize: 13, fontFamily: 'Inter-Light-BETA', paddingHorizontal: 20, marginTop: 5 },
  progressBarContainer: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginTop: 25
  },
  progressTime: { color: '#FFFFFF', fontSize: 12, width: 40, textAlign: 'center' },
  progressBar: { flex: 1, marginHorizontal: 10 },
  controlsContainer: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30, gap: 30
  },
  controlButton1: { padding: 5 },
  controlText: { color: '#fff', fontSize: 13 },
  playPauseButton: {
    padding: 10, backgroundColor: theme.primaryColor, borderRadius: 40,
    justifyContent: 'center', alignItems: 'center'
  },
  playPauseIcon: { width: 24, height: 24, tintColor: '#fff' },
  blurOverlay: { backgroundColor: 'rgba(0,0,0,0.4)' },
});

export default VideoPlayerScreen;
