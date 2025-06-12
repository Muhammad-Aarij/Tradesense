/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import AffiliateCoursesScreen from './src/screens/Affiliate/Courses/AffiliateCoursesScreen';
import PlayerScreen from './src/screens/TrackPlayer/PlayerScreen';
import PillarsCategoryScreen from './src/screens/Pillar/pillarsCategory/PillarsCategoryScreen';
import PsychologyCategoryScreen from './src/screens/Pillar/psychologyCategory/PsychologyCategoryScreen';
import PillarAudioScreen from './src/screens/Pillar/audios/PillarAudioScreen';
import PillarScreen from './src/screens/Pillar/PillarScreen/PillarScreen';


AppRegistry.registerComponent(appName, () => PillarAudioScreen);
