import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, Image, StyleSheet } from "react-native";
import HomeScreen from "../screens/home/HomeScreen";
import CoursesNavigator from "./CoursesNavigator";
import PillarNavigator from "./PillarNavigator";
import AccountabilityNavigator from "./AccountabilityNavigator";
import AffiliateNavigator from "./AffiliateNavigator";

import { affiliate, course, homeT, pillar, userT } from "../assets/images";
import theme from "../themes/theme"; // Import theme

const Tab = createBottomTabNavigator();

const CustomTabBarIcon = ({ source, focused, label }) => {
  return (
    <View style={[styles.tabItem, focused ? styles.activeTab : styles.inactiveTab]}>
      <View style={styles.iconLabelWrapper}>
        <Image
          source={source}
          style={[styles.icon, focused ? styles.iconActive : styles.iconInactive]}
        />
        {focused && <Text style={styles.labelActive}>{label}</Text>}
      </View>
    </View>
  );
};

export default function BottomNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon source={homeT} focused={focused} label="Home" />
          ),
        }}
      />
      <Tab.Screen
        name="Pillars"
        component={PillarNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon source={pillar} focused={focused} label="Pillars" />
          ),
        }}
      />
      <Tab.Screen
        name="Courses"
        component={CoursesNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon source={course} focused={focused} label="Courses" />
          ),
        }}
      />
      <Tab.Screen
        name="Accountability"
        component={AccountabilityNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon source={affiliate} focused={focused} label="Accountability" />
          ),
        }}
      />
      <Tab.Screen
        name="Affiliate"
        component={AffiliateNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon source={userT} focused={focused} label="Affiliate" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "rgba(33, 30, 59, 0.9)",
    borderColor: theme.borderColor,
    borderWidth: 1,
    position: "absolute",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 50,
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  tabItem: {
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: theme.primaryColor,
    paddingHorizontal: 16,
    paddingVertical: 6,
    width: 120,
    height: 40,
  },
  inactiveTab: {
    width: 45,
    height: 45,
  },
  iconLabelWrapper: {
    flexDirection: "row",       // ✅ aligns icon and text side by side
    alignItems: "center",       // ✅ vertical centering
    justifyContent: "center",
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  iconActive: {
    tintColor: "#FFF",
    marginRight: 6,
  },
  iconInactive: {
    tintColor: "#AAA",
  },
  labelActive: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 12,
  },
});
