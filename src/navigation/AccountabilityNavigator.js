import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddGoal from '../screens/Accountability/addGoal/AddGoal';
import HabitTracking from '../screens/Accountability/habitTracking/HabitTracking';
import Acc_FormData from '../screens/Accountability/formData/Acc_FormData';
import AccountabilityScreen from '../screens/Accountability/StockAnalytics';
import AccountabilityPartnerChatScreen from '../screens/Accountability/ChatScreen/AccountabilityPartnerChatScreen';
import GamificationRewardsScreen from '../screens/Accountability/Gamification/GamificationRewardsScreen';
import AccountabilityPartnerListScreen from '../screens/Accountability/partnerList/PartnerList';
import Dashboard from '../screens/Accountability/Dashboard/Dashboard';
import Trading from '../screens/Accountability/Trading/Trading';
import Watchlist from '../screens/Accountability/Watchlist/Watchlist';


const Accountability = createNativeStackNavigator();

const AccountabilityNavigator = () => {
    return (
        <Accountability.Navigator screenOptions={{ headerShown: false }}>
            <Accountability.Screen name="AccountabilityDashboard" component={Dashboard} />
            <Accountability.Screen name="Trading" component={Trading} />
            <Accountability.Screen name="Watchlist" component={Watchlist} />
            <Accountability.Screen name="Acc_Stocks" component={AccountabilityScreen} />
            {/* <Accountability.Screen name="AddGoal" component={AddGoal} />
            <Accountability.Screen name="AddHabit" component={HabitTracking} />
            <Accountability.Screen name="Acc_FormData" component={Acc_FormData} /> */}
            {/* <Accountability.Screen name="ChatScreen" component={AccountabilityPartnerChatScreen} /> */}
            <Accountability.Screen name="AccountabilityPartner" component={AccountabilityPartnerListScreen} />
            <Accountability.Screen name="Gamification" component={GamificationRewardsScreen} />
        </Accountability.Navigator>
    );
};

export default AccountabilityNavigator;
