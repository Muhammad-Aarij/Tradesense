import React from 'react';
import { View, Image, Text, Dimensions, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { bg, homeSplash, logoWhite } from '../../assets/images';
import theme from '../../themes/theme';
import { useDispatch, useSelector } from 'react-redux';
import { setProfilingDone } from '../../redux/slice/authSlice'; // ✅ import

const { height, width } = Dimensions.get('window');

export default function HomeSplash({ navigation }) {
    const dispatch = useDispatch(); // ✅ hook
    const { isSignedIn, userToken, isProfilingDone } = useSelector(state => state.auth);


    const handleGetStarted = () => {
        console.log('Get Started clicked - Auth check:', {
            isSignedIn,
            userToken: userToken ? 'exists' : 'null',
            isProfilingDone,
            shouldGoToMain: isSignedIn && userToken && isProfilingDone
        });
        
        dispatch(setProfilingDone(true)); // ✅ mark profiling not done
        // navigation.navigate('Signup');     // ✅ navigate to Signup
    };

    return (
        <ImageBackground source={bg} style={styles.container}>
            <Image source={logoWhite} style={styles.logo} />

            <Text style={styles.title}>
                Welcome
            </Text>
            <Text style={styles.subtitle}>
                Explore the app, Find some peace of mind to prepare for meditation.
            </Text>

            <Image source={homeSplash} style={styles.illustration} />

            <TouchableOpacity
                style={styles.button}
                onPress={handleGetStarted} // ✅ call handler
            >
                <Text style={styles.buttonText}>GET STARTED</Text>
            </TouchableOpacity>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    logo: {
        width: width * 0.5,
        height: height * 0.15,
        marginTop: height * 0.05,
        resizeMode: 'contain',
    },
    title: {
        fontFamily: 'Inter-Regular',
        fontSize: width * 0.07,
        color: '#FFFFFF',
        textAlign: 'center',
        paddingHorizontal: width * 0.08,
        marginTop: height * 0.02,
    },
    subtitle: {
        fontFamily: 'Inter-Thin-BETA',
        fontSize: width * 0.04,
        color: '#FFFFFF',
        textAlign: 'center',
        paddingHorizontal: width * 0.08,
        marginTop: height * 0.015,
        marginBottom: height * 0.1,
    },
    illustration: {
        width: width,
        height: height * 0.65,
        resizeMode: 'cover',
        position: 'absolute',
        bottom: -50,
    },
    button: {
        backgroundColor: '#FFFFFF',
        paddingVertical: height * 0.02,
        borderRadius: 30,
        alignItems: 'center',
        width: width * 0.8,
        position: 'absolute',
        bottom: height * 0.07,
    },
    buttonText: {
        color: theme.primaryColor,
        fontSize: width * 0.042,
        fontFamily: 'Inter-Medium',
    },
});
