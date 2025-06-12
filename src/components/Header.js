import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from "@react-native-community/blur";
import { back } from '../assets/images';
import { useNavigation } from '@react-navigation/native';
const Header = ({ title }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
            {/* Circular BlurView around Back Button */}
            <TouchableOpacity style={styles.blurWrapper} onPress={() => { navigation.goBack }}>
                <BlurView blurType="light" blurAmount={20} style={styles.blurView}>
                    <Image source={back} style={{ width: 15, height: 15, resizeMode: 'contain', padding: 10 }} />
                </BlurView>
            </TouchableOpacity>

            {/* Centered Title using absolute positioning */}
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 35,
        marginBottom: 25,
        position: 'relative', // Allows absolute positioning inside
    },

    blurWrapper: {
        width: 35, height: 35, borderRadius: 20, padding: 12, overflow: 'hidden', alignItems: 'center', justifyContent: 'center',
    },

    blurView: {
        width: "100%", height: "100%", alignItems: 'center', justifyContent: 'center',
    },

    backIcon: { width: 17, height: 17, resizeMode: 'contain' },

    title: {
        fontSize: 20,
        color: '#EFEFEF',
        fontFamily: 'Inter-SemiBold',
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
    },
});

export default Header;
