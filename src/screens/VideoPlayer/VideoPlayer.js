import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions,
  ImageBackground, ActivityIndicator, ScrollView, Platform
} from 'react-native';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import Orientation from 'react-native-orientation-locker';
import { BlurView } from '@react-native-community/blur';
import { playb, stop } from '../../assets/images'; 
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
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={isFullScreen ? styles.videoFull : styles.videoContainer}>
          <Video
            source={{ uri: "https://videos.pexels.com/video-files/3698049/3698049-hd_1920_1080_18fps.mp4" }}
            ref={playerRef}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
            paused={paused}
            muted={muted}
            onBuffer={({ isBuffering }) => setIsBuffering(isBuffering)}
            onLoad={(data) => setProgress(p => ({ ...p, duration: data.duration }))}
            onProgress={(data) => setProgress(p => ({ ...p, currentTime: data.currentTime }))}
          />
          {isBuffering && <ActivityIndicator size="large" color="#fff" style={styles.loader} />}
        </View>

        {!isFullScreen && (
          <>
            <Text style={styles.title}>{VideoTitle}</Text>
            <Text style={styles.description}>{VideoDescr}</Text>

            <View style={styles.controls}>
              <TouchableOpacity onPress={() => setMuted(!muted)}>
                <Text style={styles.controlText}>{muted ? 'Unmute' : 'Mute'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.playPause} onPress={() => setPaused(!paused)}>
                <ImageBackground source={paused ? playb : stop} style={styles.playPauseIcon} />
              </TouchableOpacity>

              <TouchableOpacity onPress={toggleFullScreen}>
                <Text style={styles.controlText}>Fullscreen</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sliderContainer}>
              <Text style={styles.time}>{formatTime(progress.currentTime)}</Text>
              <Slider
                style={styles.slider}
                value={progress.currentTime}
                maximumValue={progress.duration}
                onSlidingComplete={(value) => playerRef.current.seek(value)}
                minimumTrackTintColor={theme.primaryColor}
                maximumTrackTintColor="#999"
                thumbTintColor={theme.primaryColor}
              />
              <Text style={styles.time}>{formatTime(progress.duration)}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  scrollContent: { alignItems: 'center' },
  videoContainer: { width: '100%', height: width * 0.6, backgroundColor: '#000' },
  videoFull: { position: 'absolute', top: 0, left: 0, width, height, zIndex: 99 },
  loader: { position: 'absolute', alignSelf: 'center', top: '45%' },
  title: { color: '#FFF', fontSize: 22, fontWeight: '600', marginTop: 20 },
  description: { color: '#CCC', fontSize: 14, marginVertical: 10 },
  controls: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 20 },
  controlText: { color: '#FFF', fontSize: 16 },
  playPause: { padding: 10, backgroundColor: theme.primaryColor, borderRadius: 30 },
  playPauseIcon: { width: 25, height: 25, tintColor: '#fff' },
  sliderContainer: { flexDirection: 'row', alignItems: 'center', width: '95%', marginTop: 20 },
  slider: { flex: 1, marginHorizontal: 10 },
  time: { color: '#FFF', fontSize: 12, width: 35, textAlign: 'center' }
});

export default VideoPlayerScreen;
