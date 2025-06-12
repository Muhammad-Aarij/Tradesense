import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddGoal from '../screens/Accountability/addGoal/AddGoal';
import HabitTracking from '../screens/Accountability/habitTracking/HabitTracking';
import Acc_FormData from '../screens/Accountability/formData/Acc_FormData';


const Accountability = createNativeStackNavigator();

const AccountabilityNavigator = () => {
    return (
        <Accountability.Navigator screenOptions={{ headerShown: false }}>
            <Accountability.Screen name="AddGoal" component={AddGoal} />
            <Accountability.Screen name="HabitTracking" component={HabitTracking} />
            <Accountability.Screen name="Acc_FormData" component={Acc_FormData} />
        </Accountability.Navigator>
    );
};

export default AccountabilityNavigator;
