import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import BottomNavigator from './BottomNav';


const Home = createNativeStackNavigator();

const HomeNavigator = () => {
    return (
        <Home.Navigator screenOptions={{ headerShown: false }}>
            <Home.Screen name="BottomTabs" component={BottomNavigator} />
        </Home.Navigator>
    );
};

export default HomeNavigator;
