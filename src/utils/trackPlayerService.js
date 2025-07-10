// utils/trackPlayerService.js
import TrackPlayer, { Event } from 'react-native-track-player';

module.exports = async function () {
  // Basic playback controls
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    TrackPlayer.stop();
  });

  // Skip controls
  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious();
  });

  // Seek controls
  TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
    TrackPlayer.seekTo(event.position);
  });

  // Audio focus handling (for iOS/Android interruptions)
  TrackPlayer.addEventListener(Event.RemoteDuck, async (event) => {
    if (event.permanent) {
      TrackPlayer.pause();
    } else {
      if (event.paused) {
        TrackPlayer.pause();
      } else {
        TrackPlayer.play();
      }
    }
  });
};
