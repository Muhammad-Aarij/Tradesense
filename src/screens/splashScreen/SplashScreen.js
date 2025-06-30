import React from 'react'
import { Image, ImageBackground, View } from 'react-native'
import { bg } from '../../assets/images'
import { logoWhite } from '../../assets/images'
export default function SplashScreen() {
    return (
        <ImageBackground source={bg} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Image source={logoWhite} style={{ width: "55%", height: 200 ,resizeMode:"contain"}} />
        </ImageBackground>
    )
}
