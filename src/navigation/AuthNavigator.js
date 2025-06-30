import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/loginScreen/LoginScreen';
import ForgetPassword from '../screens/Auth/forgetPassword/ForgetPassword';
import SignUp from '../screens/Auth/SignUp/SignUp';
import EmailVerification from '../screens/Auth/emailVerification/EmailVerification';
import GenderScreen from '../screens/Profile/genderScreen/GenderScreen';
import GoalsScreen from '../screens/Profile/goalScreen/GoalsScreen';
import AgeScreen from '../screens/Profile/ageScreen/AgeScreen';
import ResetPassword from '../screens/Auth/resetPassword/ResetPassword';
import AffiliateDashboardScreen from '../screens/Affiliate/Dashboard/AffiliateDashboardScreen';
import WithdrawScreen from '../screens/Affiliate/winthdraw/WithdrawScreen';
import AreasScreen from '../screens/Profile/areasScreen/AreasScreen';
import HomeSplash from '../screens/splashScreen/HomeSplash';
const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="GenderScreen" component={GenderScreen} />
            <Stack.Screen name="AgeScreen" component={AgeScreen} />
            <Stack.Screen name="Signup" component={SignUp} />
            <Stack.Screen name="EmailVerification" component={EmailVerification} />
            <Stack.Screen name="ForgotPassword" component={ForgetPassword} />
            <Stack.Screen name="AreasScreen" component={AreasScreen} />
            <Stack.Screen name="GoalScreen" component={GoalsScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen name="AffiliateDashboardScreen" component={AffiliateDashboardScreen} />
            <Stack.Screen name="WithdrawScreen" component={WithdrawScreen} />
            <Stack.Screen name="GetStarted" component={HomeSplash} />

        </Stack.Navigator>
    );
};

export default AuthNavigator;
