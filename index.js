/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import trackPlayerService from './src/utils/trackPlayerService';
import TrackPlayer from 'react-native-track-player';
import TermsAndConditionsScreen from './src/screens/Settings/TermsAndConditions/TermsAndConditionsScreen';

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => trackPlayerService);
