import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import HomeScreen from '../screens/home/HomeScreen';
import BottomNavigator from './BottomNav';
import MenuComponent from '../components/MenuComponent';
import Hamburger from '../components/Hamburger';
import PlansScreen from '../screens/Courses/Plans/PlansScreen';
import PlayerScreen from '../screens/TrackPlayer/PlayerScreen';
import CourseEpisodesScreen from '../screens/Courses/courseEpisodes/CourseEpisodesScreen';

const Home = createNativeStackNavigator();

const HomeNavigator = () => {
  const { isSidebarOpen } = useSelector(state => state.loader);

  return (
    <>
      <Home.Navigator screenOptions={{ headerShown: false }}>
        <Home.Screen name="BottomTabs" component={BottomNavigator} />
        <Home.Screen name="TrackPlayer" component={PlayerScreen} />
        <Home.Screen name="CourseEpisodesScreen" component={CourseEpisodesScreen} />
      </Home.Navigator>

      {isSidebarOpen && <MenuComponent />}
      <Hamburger />
    </>
  );
};

export default HomeNavigator;
