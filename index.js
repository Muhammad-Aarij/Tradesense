/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import HomeScreen from './src/screens/home/HomeScreen';
import LoginScreen from './src/screens/Auth/loginScreen/LoginScreen';
import AgeScreen from './src/screens/Profile/ageScreen/AgeScreen';
import GenderScreen from './src/screens/Profile/genderScreen/GenderScreen';
import GoalsScreen from './src/screens/Profile/goalScreen/GoalsScreen';



AppRegistry.registerComponent(appName, () => HomeScreen);
