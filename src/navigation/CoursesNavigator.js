import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CheckoutScreen from "../screens/Courses/checkout/CheckoutScreen";
import CourseDetailScreen from "../screens/Courses/courseDetail/CourseDetailScreen";
import CourseEpisodesScreen from "../screens/Courses/courseEpisodes/CourseEpisodesScreen";
import OurCoursesScreen from "../screens/Courses/courseList/OurCoursesScreen";
import PlansScreen from "../screens/Courses/Plans/PlansScreen";
import PurchasedCoursesScreen from "../screens/Courses/purchaseCourse/purchasedCoursesData";
import PlayerScreen from "../screens/TrackPlayer/PlayerScreen";

const CoursesStack = createNativeStackNavigator();

const CoursesNavigator = () => {
  return (
    <CoursesStack.Navigator
      initialRouteName="PurchasedCoursesScreen"
      screenOptions={{
        headerShown: false
      }}
      detachInactiveScreens={false}
    >
      <CoursesStack.Screen name="OurCoursesScreen" component={OurCoursesScreen} />
      <CoursesStack.Screen name="CourseDetailScreen" component={CourseDetailScreen} />
      <CoursesStack.Screen name="PurchasedCoursesScreen" component={PurchasedCoursesScreen} />
      <CoursesStack.Screen name="PlansScreen" component={PlansScreen} detachInactiveScreens={false} />
      <CoursesStack.Screen name="CheckoutScreen" component={CheckoutScreen} />
      {/* <CoursesStack.Screen name="CourseEpisodesScreen" component={CourseEpisodesScreen} /> */}
      {/* <CoursesStack.Screen name="TrackPlayer" component={PlayerScreen} /> */}
    </CoursesStack.Navigator>
  );
};

export default CoursesNavigator;
