import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/loginScreen/LoginScreen';
import ForgetPassword from '../screens/Auth/forgetPassword/ForgetPassword';
import SignUp from '../screens/Auth/SignUp/SignUp';
import EmailVerification from '../screens/Auth/emailVerification/EmailVerification';
import GenderScreen from '../screens/Profile/genderScreen/GenderScreen';
import ResetPassword from '../screens/resetPassword/ResetPassword';
import GoalsScreen from '../screens/Profile/goalScreen/GoalsScreen';
import AgeScreen from '../screens/Profile/ageScreen/AgeScreen';
const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignUp} />
            <Stack.Screen name="EmailVerification" component={EmailVerification} />
            <Stack.Screen name="ForgotPassword" component={ForgetPassword} />
            <Stack.Screen name="GenderScreen" component={GenderScreen} />
            <Stack.Screen name="AgeScreen" component={AgeScreen} />
            <Stack.Screen name="GoalScreen" component={GoalsScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
        </Stack.Navigator>
    );
};

export default AuthNavigator;
