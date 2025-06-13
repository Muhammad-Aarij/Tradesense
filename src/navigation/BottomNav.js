// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import HomeScreen from "../screens/home/HomeScreen";
// import CoursesNavigator from "./CoursesNavigator";
// import PillarNavigator from "./PillarNavigator";
// import AccountabilityNavigator from "./AccountabilityNavigator";
// import AffiliateNavigator from "./AffiliateNavigator";
// import CustomBottomTab from "../components/CustomBottomTab"; // ✅ Import custom tab

// const Tab = createBottomTabNavigator();

// export default function BottomNavigator() {
//   return (
//     <Tab.Navigator
//       tabBar={(props) => <CustomBottomTab {...props} />} // ✅ Use custom tab
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Pillars" component={PillarNavigator} />
//       <Tab.Screen name="Courses" component={CoursesNavigator} />
//       <Tab.Screen name="Accountability" component={AccountabilityNavigator} />
//       <Tab.Screen name="Affiliate" component={AffiliateNavigator} />
//     </Tab.Navigator>
//   );
// }
