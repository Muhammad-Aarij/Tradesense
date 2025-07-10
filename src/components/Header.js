import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from "@react-native-community/blur";
import { back, hamburger } from '../assets/images';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeProvider';
import theme from '../themes/theme';
import { openSidebar } from '../redux/slice/loaderSlice'
import { useDispatch } from 'react-redux'

const Header = ({ title, addpadding, style }) => {
    const navigation = useNavigation();
    // const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
    const styles = getStyles(theme);

    return (
        <View style={[styles.header, style]}>
            <TouchableOpacity 
    style={[styles.blurWrapper, addpadding ? "paddingLeft:10" : ""]} 
    onPress={() => navigation.goBack()}
    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
    pressRetentionOffset={{ top: 20, bottom: 20, left: 20, right: 20 }}>
    <Image source={back} style={{ width: 10, height: 10, resizeMode: 'contain' }} />
</TouchableOpacity>

            {/* <TouchableOpacity style={styles.blurWrapper} >
                <BlurView blurType="light" blurAmount={20} style={styles.blurView}>
                    <Image source={back} style={{ width: 15, height: 15, resizeMode: 'contain', padding: 10 }} />
                </BlurView>
            </TouchableOpacity> */}

            {/* <TouchableOpacity onPress={() => dispatch(openSidebar())}
                style={{
                    position: "absolute", top: 35, left: 30,
                    zIndex: 1000, backgroundColor: "#rgba(252, 254, 255, 0.69)", padding: 10, borderRadius: 100
                }}>
                <Image source={hamburger} style={{ width: 20, height: 20, resizeMode: "contain", tintColor: "black" }} />
            </TouchableOpacity> */}

            {/* Centered Title using absolute positioning */}
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};

const getStyles = (theme) => StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 35,
        marginBottom: 45,
        position: 'relative', // Allows absolute positioning inside
    },

    blurWrapper: {
        width: 30, height: 30, borderRadius: 20, padding: 12, overflow: 'hidden', alignItems: 'center', justifyContent: 'center',
        backgroundColor: "rgba(42, 75, 138, 0.39)"
    },

    blurView: {
        width: "100%", height: "100%", alignItems: 'center', justifyContent: 'center',
    },

    backIcon: { width: 15, height: 15, resizeMode: 'contain' },

    title: {
        fontSize: 15,
        color: theme.textColor,
        fontFamily: 'Inter-Medium',
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
    },
});

export default Header;
