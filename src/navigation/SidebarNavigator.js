import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AboutTrader365Screen from '../screens/Settings/About/AboutTrader365Screen';
import AccountSecurityScreen from '../screens/Settings/AccountSecurity/AccountSecurityScreen';
import HelpCenterScreen from '../screens/Settings/HelpCenter/HelpCenterScreen';
import ReportProblemScreen from '../screens/Settings/ReportProblem/ReportProblemScreen';
import TermsAndConditionsScreen from '../screens/Settings/TermsAndConditions/TermsAndConditionsScreen';
import UserProfileMenuScreen from '../screens/Settings/UserProfileMenu/Profile';
import UserProfileDetailsScreen from '../screens/Settings/UserProfileDetails/UserProfileDetailsScreen';
import CoursesNavigator from './CoursesNavigator';
import AffiliateNavigator from './AffiliateNavigator';

const Stack = createNativeStackNavigator();

const SidebarNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            <Stack.Screen name="Menu" component={UserProfileMenuScreen} />
            <Stack.Screen name="UserProfileDetails" component={UserProfileDetailsScreen} />
            <Stack.Screen name="About" component={AboutTrader365Screen} />
            <Stack.Screen name="AccountSecurity" component={AccountSecurityScreen} />
            <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
            <Stack.Screen name="ReportProblem" component={ReportProblemScreen} />
            <Stack.Screen name="Courses" component={CoursesNavigator} />
            <Stack.Screen name="Affiliate" component={AffiliateNavigator} />
            <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} />
        </Stack.Navigator>
    );
};  

export default SidebarNavigator;
