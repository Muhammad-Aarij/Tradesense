import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
// import ProfileScreen from './screens/ProfileScreen';
// import SettingsScreen from './screens/SettingsScreen';
import { Image } from 'react-native';
import { homeIcon, profileIcon, settingsIcon } from '../assets/images';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{
      tabBarStyle: { backgroundColor: '#0d151e', borderTopWidth: 0, height: 60 },
      tabBarActiveTintColor: '#70C2E8',
    }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{
        tabBarIcon: ({ focused }) => <Image source={homeIcon} style={{ width: 30, height: 30, tintColor: focused ? '#70C2E8' : '#fff' }} />
      }} />
      
      <Tab.Screen name="Profile" component={ProfileScreen} options={{
        tabBarIcon: ({ focused }) => <Image source={profileIcon} style={{ width: 30, height: 30, tintColor: focused ? '#70C2E8' : '#fff' }} />
      }} />

      <Tab.Screen name="Settings" component={SettingsScreen} options={{
        tabBarIcon: ({ focused }) => <Image source={settingsIcon} style={{ width: 30, height: 30, tintColor: focused ? '#70C2E8' : '#fff' }} />
      }} />
    </Tab.Navigator>
  );
};

// Correcting export statement
export default BottomTabNavigator;
