import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PillarScreen from '../screens/Pillar/audios/PillarScreen';
import PsychologyCategoryScreen from '../screens/Pillar/psychologyCategory/PsychologyCategoryScreen';
import PillarsCategoryScreen from '../screens/Pillar/pillarsCategory/PillarsCategoryScreen';
import DiscoverScreen from '../screens/Pillar/psychologyCategory/Discover';
import PlayerScreen from '../screens/TrackPlayer/PlayerScreen';


const Pillar = createNativeStackNavigator();

const PillarNavigator = () => {
    return (
        <Pillar.Navigator screenOptions={{ headerShown: false }}>
            <Pillar.Screen name="Discover" component={DiscoverScreen} />
            <Pillar.Screen name="PsychologyCategoryScreen" component={PsychologyCategoryScreen} />
            <Pillar.Screen name="PillarScreen" component={PillarScreen} />
            <Pillar.Screen name="PillarsCategoryScreen" component={PillarsCategoryScreen} />
            <Pillar.Screen name="TrackPlayer" component={PlayerScreen} />
        </Pillar.Navigator>
    );
};
 
export default PillarNavigator;
