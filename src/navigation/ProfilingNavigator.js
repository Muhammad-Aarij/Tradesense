import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GenderScreen from '../screens/Profile/genderScreen/GenderScreen';
import GoalsScreen from '../screens/Profile/goalScreen/GoalsScreen';
import AgeScreen from '../screens/Profile/ageScreen/AgeScreen';
import AreasScreen from '../screens/Profile/areasScreen/AreasScreen';

const Stack = createNativeStackNavigator();

const ProfilingNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            <Stack.Screen name="GenderScreen" component={GenderScreen} />
            <Stack.Screen name="AgeScreen" component={AgeScreen} />
            <Stack.Screen name="AreasScreen" component={AreasScreen} />
            <Stack.Screen name="GoalScreen" component={GoalsScreen} />
        </Stack.Navigator>
    );
};

export default ProfilingNavigator;
