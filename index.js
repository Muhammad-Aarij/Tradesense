/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import SignUp from './src/screens/SignUp/SignUp';
import ResetPassword from './src/screens/resetPassword/ResetPassword';

AppRegistry.registerComponent(appName, () => SignUp);
