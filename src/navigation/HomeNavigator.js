import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import BottomNavigator from './BottomNav';
import MenuComponent from '../components/MenuComponent';
import { useSelector } from 'react-redux';
import Hamburger from '../components/Hamburger';


const Home = createNativeStackNavigator();

const HomeNavigator = () => {
    const { isSidebarOpen } = useSelector(state => state.loader);

    return (
        <>
            <Home.Navigator screenOptions={{ headerShown: false }}>
                <Home.Screen name="BottomTabs" component={BottomNavigator} />
            </Home.Navigator>
            {isSidebarOpen && <MenuComponent />}
            <Hamburger/>
        </>

    );
};

export default HomeNavigator;
