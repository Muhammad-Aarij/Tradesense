/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import ForgetPassword from './src/screens/forgetPassword/ForgetPassword';

AppRegistry.registerComponent(appName, () => ForgetPassword);
