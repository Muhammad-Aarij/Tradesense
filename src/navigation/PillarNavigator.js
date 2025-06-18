import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import PillarScreen from '../screens/Pillar/audios/PillarScreen';
import PsychologyCategoryScreen from '../screens/Pillar/psychologyCategory/PsychologyCategoryScreen';
import PillarsCategoryScreen from '../screens/Pillar/pillarsCategory/PillarsCategoryScreen';
import PlayerScreen from '../screens/TrackPlayer/PlayerScreen';


const Pillar = createNativeStackNavigator();

const PillarNavigator = () => {
    return (
        <Pillar.Navigator screenOptions={{ headerShown: false }}>
            <Pillar.Screen name="PsychologyCategoryScreen" component={PsychologyCategoryScreen} />
            <Pillar.Screen name="PillarScreen" component={PillarScreen} />
            <Pillar.Screen name="PillarsCategoryScreen" component={PillarsCategoryScreen} />
            {/* <Pillar.Screen name="TrackPlayer" component={PlayerScreen} detachInactiveScreens={false} /> */}
        </Pillar.Navigator>
    );
};

export default PillarNavigator;
