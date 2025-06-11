/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import AffiliateCoursesScreen from './src/screens/Affiliate/Courses/AffiliateCoursesScreen';
import PlayerScreen from './src/screens/TrackPlayer/PlayerScreen';
import PillarsCategoryScreen from './src/screens/Pillar/pillarsCategory/PillarsCategoryScreen';


AppRegistry.registerComponent(appName, () => PillarsCategoryScreen);
