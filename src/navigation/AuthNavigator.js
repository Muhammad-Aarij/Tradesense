import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/loginScreen/LoginScreen';
import ForgetPassword from '../screens/forgetPassword/ForgetPassword';
import SignUp from '../screens/SignUp/SignUp';
import EmailVerification from '../screens/emailVerification/EmailVerification';
import GenderScreen from '../screens/genderScreen/GenderScreen';
import ResetPassword from '../screens/resetPassword/ResetPassword';
const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignUp} />
            <Stack.Screen name="ForgotPassword" component={ForgetPassword} />
            <Stack.Screen name="EmailVerification" component={EmailVerification} />
            <Stack.Screen name="GenderScreen" component={GenderScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
        </Stack.Navigator>
    );
};

export default AuthNavigator;
