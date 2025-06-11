/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import CheckoutScreen from './src/screens/Courses/checkout/CheckoutScreen';
import CourseEpisodesScreen from './src/screens/Courses/courseEpisodes/CourseEpisodesScreen';
import PurchasedCoursesScreen from './src/screens/Courses/purchaseCourse/purchasedCoursesData';


AppRegistry.registerComponent(appName, () => PurchasedCoursesScreen);
