import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native'; import LoginScreen from './src/screens/loginScreen/LoginScreen';
import SignUp from './src/screens/SignUp/SignUp';
import EmailVerification from './src/screens/emailVerification/EmailVerification';
import ForgetPassword from './src/screens/forgetPassword/ForgetPassword';
import GenderScreen from './src/screens/genderScreen/GenderScreen';
import ResetPassword from './src/screens/resetPassword/ResetPassword';
// import SignUp from './src/screens/SignUp/SignUp';


const App = () => {
    const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignUp} />
                <Stack.Screen name="EmailVerification" component={EmailVerification} />
                <Stack.Screen name="ForgotPassword" component={ForgetPassword} />
                <Stack.Screen name="GenderScreen" component={GenderScreen} />
                <Stack.Screen name="ResetPassword" component={ResetPassword} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;

// <Provider store={store}>
// </Provider>