// utils/initializeTrackPlayer.js
import TrackPlayer from 'react-native-track-player';

let isInitialized = false;

export const initializeTrackPlayer = async () => {
  if (isInitialized) return;

  try {
    await TrackPlayer.setupPlayer();
    isInitialized = true;
    console.log('✅ TrackPlayer initialized');

    await TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_STOP,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_SEEK_TO,
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
      ],
      progressUpdateEventInterval: 1, // Update progress every second
    });
  } catch (error) {
    console.error('❌ Failed to initialize TrackPlayer:', error);
  }
};
