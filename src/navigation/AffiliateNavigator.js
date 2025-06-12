import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import AffiliateCoursesScreen from '../screens/Affiliate/Courses/AffiliateCoursesScreen';
import AffiliateDashboardScreen from '../screens/Affiliate/Dashboard/AffiliateDashboardScreen';
import WithdrawDetailScreen from '../screens/Affiliate/withdrawDetail/WithdrawDetailScreen';
import WithdrawScreen from '../screens/Affiliate/winthdraw/WithdrawScreen';


const Affiliate = createNativeStackNavigator();

const AffiliateNavigator = () => {
    return (
        <Affiliate.Navigator screenOptions={{ headerShown: false }}>
            <Affiliate.Screen name="WithdrawScreen" component={WithdrawScreen} />
            <Affiliate.Screen name="AffiliateCoursesScreen" component={AffiliateCoursesScreen} />
            <Affiliate.Screen name="AffiliateDashboardScreen" component={AffiliateDashboardScreen} />
            <Affiliate.Screen name="WithdrawDetailScreen" component={WithdrawDetailScreen} />
        </Affiliate.Navigator>
    );
};

export default AffiliateNavigator;
