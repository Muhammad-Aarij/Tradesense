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
  StyleSheet
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useDispatch } from 'react-redux';
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
  noThumbnail
} from '../../assets/images';
import theme from '../../themes/theme';

const { height } = Dimensions.get('window');

const PlayerScreen = ({ route }) => {
  const { AudioTitle, AudioDescr, Thumbnail, AudioUrl, shouldFetchTrack } = route.params;
  const dispatch = useDispatch();
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const isPlaying = playbackState.state === PlaybackState.Playing;

  const isPlayerSetup = useRef(false);
  const [audioLoading, setAudioLoading] = useState(true);

  const track = {
    id: `${AudioTitle}-${Date.now()}`,
    url: AudioUrl,
    title: AudioTitle,
    artist: 'Alwin',
    album: 'Mentally Relax',
    artwork: Thumbnail,
    description: AudioDescr,
  };

  useTrackPlayerEvents([Event.PlaybackBuffering, Event.PlaybackReady], (event) => {
    if (event.type === Event.PlaybackBuffering) {
      dispatch(startLoading());
    } else if (event.type === Event.PlaybackReady) {
      dispatch(stopLoading());
    }
  });

  const setupPlayer = async () => {
    try {
      dispatch(startLoading());
      setAudioLoading(true);

      if (!isPlayerSetup.current) {
        await TrackPlayer.setupPlayer({ waitForBuffer: false });
        isPlayerSetup.current = true;
      }

      const currentTrackId = await TrackPlayer.getCurrentTrack();
      const currentTrack = currentTrackId ? await TrackPlayer.getTrack(currentTrackId) : null;
      const isSameTrack = currentTrack && currentTrack.url === track.url;

      if (!isSameTrack || !shouldFetchTrack) {
        await TrackPlayer.reset();
        await TrackPlayer.add(track);
        await TrackPlayer.play();
      }
    } catch (error) {
      if (!error.message?.includes('already been initialized')) {
        Alert.alert('Track Error', error.message || 'Playback failed');
      }
    } finally {
      dispatch(stopLoading());
      setAudioLoading(false);
    }
  };

  useEffect(() => {
    setupPlayer();

    return () => {
      dispatch(stopLoading());
    };
  }, [AudioUrl]);

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
    <ImageBackground source={{ uri: Thumbnail ?? noThumbnail }} style={styles.container}>
      <View style={styles.blurOverlay} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.albumArtContainer}>
          {Thumbnail && <ImageBackground source={{ uri: Thumbnail }} style={styles.albumArt}>
            <View style={styles.albumArtOverlay}>
              <View style={styles.artistInfo}>
                <Image source={user} style={styles.artistImage} />
                <View>
                  <Text style={styles.artistName}>Alwin</Text>
                  <Text style={styles.artistRole}>Mentally Relax</Text>
                </View>
              </View>
            </View>
          </ImageBackground>}
        </View>

        <View style={styles.infoContainer}>
          {!Thumbnail && <View style={{ ...styles.artistInfo, marginBottom: 10, }}>
            <Image source={user} style={styles.artistImage} />
            <View>
              <Text style={styles.artistName}>Alwin</Text>
              <Text style={styles.artistRole}>Mentally Relax</Text>
            </View>
          </View>}
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
          <TouchableOpacity style={styles.controlButton1}>
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 12, 12, 0.85)',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 80,
  },
  albumArtContainer: {
    width: '100%',
    height: height * 0.55,
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
    backgroundColor: 'rgba(0,0,0,0.2)',
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
});

export default PlayerScreen;
