import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { useNavigationState } from '@react-navigation/native';

import HomeScreen from '../screens/home/HomeScreen';
import BottomNavigator from './BottomNav';
import MenuComponent from '../components/MenuComponent';
import Hamburger from '../components/Hamburger';
import MiniPlayer from '../components/MiniPlayer';
import PlansScreen from '../screens/Courses/Plans/PlansScreen';
import PlayerScreen from '../screens/TrackPlayer/PlayerScreen';
import CourseEpisodesScreen from '../screens/Courses/courseEpisodes/CourseEpisodesScreen';
import VideoPlayerScreen from '../screens/VideoPlayer/VideoPlayer';
import AddGoal from '../screens/Accountability/addGoal/AddGoal';
import HabitTracking from '../screens/Accountability/habitTracking/HabitTracking';
import AccountabilityPartnerChatScreen from '../screens/Accountability/ChatScreen/AccountabilityPartnerChatScreen';
import Acc_FormData from '../screens/Accountability/formData/Acc_FormData';
import CoursesNavigator from './CoursesNavigator';
import SidebarNavigator from './SidebarNavigator';
import AffiliateNavigator from './AffiliateNavigator';

const Home = createNativeStackNavigator();

const HomeNavigator = () => {
  // Get current route name to hide mini player on TrackPlayer screen
  const routeName = useNavigationState(state => {
    const route = state?.routes[state?.index];
    return route?.name;
  });

  const showMiniPlayer = routeName !== 'TrackPlayer' && routeName !== 'VideoPlayer';

  return (
    <>
      <Home.Navigator screenOptions={{ headerShown: false }}>
        <Home.Screen name="BottomTabs" component={BottomNavigator} />
        <Home.Screen name="CoursesStack" component={CoursesNavigator} />
        <Home.Screen name="TrackPlayer" component={PlayerScreen} />
        <Home.Screen name="VideoPlayer" component={VideoPlayerScreen} />
        <Home.Screen name="CourseEpisodesScreen" component={CourseEpisodesScreen} />
        <Home.Screen name="AddGoal" component={AddGoal} />
        <Home.Screen name="AddHabit" component={HabitTracking} />
        <Home.Screen name="Acc_FormData" component={Acc_FormData} />
        <Home.Screen name="ChatScreen" component={AccountabilityPartnerChatScreen} />
        <Home.Screen name="Menu" component={SidebarNavigator} />
        <Home.Screen name="Courses" component={CoursesNavigator} />
        <Home.Screen name="Affiliate" component={AffiliateNavigator} />
      </Home.Navigator>

      {/* Show MiniPlayer only when not on TrackPlayer or VideoPlayer screen */}
      {showMiniPlayer && <MiniPlayer />}
      
      {/* {isSidebarOpen && <MenuComponent />} */}
      <Hamburger />
    </>
  );
};

export default HomeNavigator;
