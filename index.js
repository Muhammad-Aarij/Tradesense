/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import AreasScreen from './src/screens/Profile/areasScreen/AreasScreen';
import HomeScreen from './src/screens/home/HomeScreen';



AppRegistry.registerComponent(appName, () => HomeScreen);
