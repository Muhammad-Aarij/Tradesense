/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { Buffer } from 'buffer';
global.Buffer = Buffer;
import { name as appName } from './app.json';
import trackPlayerService from './src/utils/trackPlayerService';
import TrackPlayer from 'react-native-track-player';
import Watchlist from './src/screens/Accountability/Watchlist/Watchlist';
import Trading from './src/screens/Accountability/Trading/Trading';
import Dashboard from './src/screens/Accountability/Dashboard/Dashboard';

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => trackPlayerService);
