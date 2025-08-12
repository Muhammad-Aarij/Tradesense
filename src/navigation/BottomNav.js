import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import HomeScreen from "../screens/home/HomeScreen";
import CoursesNavigator from "./CoursesNavigator";
import PillarNavigator from "./PillarNavigator";
import AccountabilityNavigator from "./AccountabilityNavigator";
import AffiliateNavigator from "./AffiliateNavigator";
import CustomBottomTab from "../components/CustomBottomTab";
import AccountabilityPartnerChatScreen from "../screens/Accountability/ChatScreen/AccountabilityPartnerChatScreen";
import SidebarNavigator from "./SidebarNavigator";
import UserProfileMenuScreen from "../screens/Settings/UserProfileMenu/Profile";
import MoreNavigator from "./SidebarNavigator";
import { ThemeContext } from "../context/ThemeProvider";

const Tab = createBottomTabNavigator();

export default function BottomNavigator() {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomBottomTab {...props} />}
      screenOptions={{
        headerShown: false,
        sceneContainerStyle: { backgroundColor: isDarkMode ? '#080E17' : '#FFFFFF' },
      }}
      detachInactiveScreens={false}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Pillars" component={PillarNavigator} />
      <Tab.Screen name="Accountability" component={AccountabilityNavigator} />
      <Tab.Screen
        name="Courses"
        component={CoursesNavigator}
        options={{
          tabBarButton: () => null, // ✅ Hides the tab icon/button
        }}
      />
      <Tab.Screen name="Sense Ai" component={AccountabilityPartnerChatScreen} />
      <Tab.Screen name="More" component={MoreNavigator} />
    </Tab.Navigator>
  );
}
