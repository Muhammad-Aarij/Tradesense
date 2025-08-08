import React from 'react';
import UserProfileMenuScreen from '../screens/Settings/UserProfileMenu/Profile';
import AppSubscription from '../screens/Settings/Subscription/PlansScreen';
import UserProfileDetailsScreen from '../screens/Settings/UserProfileDetails/UserProfileDetailsScreen'; // Assuming this screen exists
import AccountSecurityScreen from '../screens/Settings/AccountSecurity/AccountSecurityScreen'; // Assuming this screen exists
import HelpCenterScreen from '../screens/Settings/HelpCenter/HelpCenterScreen'; // Assuming this screen exists
import ReportProblemScreen from '../screens/Settings/ReportProblem/ReportProblemScreen'; // Assuming this screen exists
import TermsAndConditionsScreen from '../screens/Settings/TermsAndConditions/TermsAndConditionsScreen'; // Assuming this screen exists
import AboutTrader365Screen from '../screens/Settings/About/AboutTrader365Screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const MoreStack = createNativeStackNavigator();

const MoreNavigator = () => {
  return (
    <MoreStack.Navigator screenOptions={{ headerShown: false }}>
      <MoreStack.Screen name="UserProfileMenu" component={UserProfileMenuScreen} />
      <MoreStack.Screen name="AppSubscription" component={AppSubscription} />
      <MoreStack.Screen name="UserProfileDetails" component={UserProfileDetailsScreen} />
      <MoreStack.Screen name="AccountSecurity" component={AccountSecurityScreen} />
      <MoreStack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <MoreStack.Screen name="ReportProblem" component={ReportProblemScreen} />
      <MoreStack.Screen name="About" component={AboutTrader365Screen} />
      <MoreStack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} />
      {/* Add other screens related to the "More" section here */}
    </MoreStack.Navigator>
  );
};

export default MoreNavigator;
