/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Acc_FormData from './src/screens/Accountability/formData/Acc_FormData';
import AddGoal from './src/screens/Accountability/addGoal/AddGoal';
import HabitTracking from './src/screens/Accountability/habitTracking/HabitTracking';



AppRegistry.registerComponent(appName, () => HabitTracking);
