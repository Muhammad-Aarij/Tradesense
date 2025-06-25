/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import trackPlayerService from './src/utils/trackPlayerService';
import TrackPlayer from 'react-native-track-player';
import AccountSecurityScreen from './src/screens/Settings/AccountSecurity/AccountSecurityScreen';
import HelpCenterScreen from './src/screens/Settings/HelpCenter/HelpCenterScreen';
import ReportProblemScreen from './src/screens/Settings/ReportProblem/ReportProblemScreen';

AppRegistry.registerComponent(appName, () => ReportProblemScreen);
TrackPlayer.registerPlaybackService(() => trackPlayerService);
