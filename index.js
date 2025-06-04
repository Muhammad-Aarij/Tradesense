/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import ForgetPassword from './src/screens/forgetPassword/ForgetPassword';
import EmailVerification from './src/screens/emailVerification/EmailVerification';

AppRegistry.registerComponent(appName, () => EmailVerification);
