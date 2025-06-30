import React from 'react'
import { Image, TouchableOpacity } from 'react-native'
import { openSidebar } from '../redux/slice/loaderSlice'
import { useDispatch } from 'react-redux'
import { hamburger } from '../assets/images';

export default function Hamburger() {
    const dispatch = useDispatch();
    return (
        <TouchableOpacity onPress={() => dispatch(openSidebar())}
            style={{
                display: "none",
                position: "absolute", top: 35, left: 30,
                zIndex: 1000, backgroundColor: "#rgba(252, 254, 255, 0.32)", padding: 10, borderRadius: 100
            }}>
            <Image source={hamburger} style={{ width: 15, height: 15, resizeMode: "contain", tintColor: "black" }} />
        </TouchableOpacity>
    )
}
