import React from 'react'
import { bg, homeSplash, logoWhite } from '../../assets/images'
import { View, Image, Text, Dimensions, ImageBackground } from 'react-native'

const { height, width } = Dimensions.get('window');
export default function HomeSplash() {
    return (
        <ImageBackground source={bg} style={{ flex: 1, alignItems: "center" }}>
            <Image source={logoWhite} style={{ width: "65%", height: 200, resizeMode: "contain" }} />
            <Text style={{ fontFamily: "Inter-Medium", fontSize: 30, color: "#FFFFFF", textAlign: "center", paddingHorizontal: 30 }}>
                Hi Afsar, Welcome
            </Text>
            <Text style={{ fontFamily: "Inter-Thin-BETA", fontSize: 16, color: "#FFFFFF", textAlign: "center", paddingHorizontal: 30, marginTop: 20 }}>
                Explore the app, Find some peace of mind to prepare for meditation.
            </Text>
            <Image source={homeSplash} style={{ width: width, height: 400, resizeMode: "cover" }} />
        </ImageBackground>
    )
}
