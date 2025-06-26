import React from "react";
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

const Tab = createBottomTabNavigator();

export default function BottomNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomBottomTab {...props} />}
      screenOptions={{
        headerShown: false,
      }}
      detachInactiveScreens={false}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Pillars"
        component={PillarNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';

          // List of screens where tab bar should be hidden
          const hideOnScreens = ['TrackPlayer'];

          return {
            tabBarStyle: {
              height: hideOnScreens.includes(routeName) ? 0 : 'auto',
            },
          };
        }}
      />

      <Tab.Screen
        name="Courses"
        component={CoursesNavigator}
      />
      {/* <Tab.Screen name="Accountability" component={AccountabilityNavigator} /> */}
      {/* <Tab.Screen name="Affiliate" component={AffiliateNavigator} /> */}
      <Tab.Screen name="ChatBot" component={AccountabilityPartnerChatScreen} />
      <Tab.Screen name="Sidebar" component={SidebarNavigator} />
    </Tab.Navigator>
  );
}
