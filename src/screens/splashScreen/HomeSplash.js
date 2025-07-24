import React, { useEffect, useState } from 'react';
import { View, Image, Text, Dimensions, ImageBackground, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setProfilingDone } from '../../redux/slice/authSlice';
import { startLoading, stopLoading } from '../../redux/slice/loaderSlice';
import { fetchWelcomeData } from '../../functions/profiling';
import { bg, logoWhite } from '../../assets/images';
import { API_URL } from '@env'; // if needed

const { height, width } = Dimensions.get('window');

export default function HomeSplash({ navigation }) {
    const dispatch = useDispatch();
    const { isSignedIn, userToken, isProfilingDone } = useSelector(state => state.auth);
    const isLoading = useSelector(state => state.loading);

    const [welcomeData, setWelcomeData] = useState(null);

    useEffect(() => {
        const loadWelcomeScreen = async () => {
            dispatch(startLoading());
            try {
                const data = await fetchWelcomeData();
                setWelcomeData(data);
            } catch (err) {
                console.error("Failed to load welcome data", err);
            } finally {
                dispatch(stopLoading());
            }
        };

        loadWelcomeScreen();
    }, []);

    const handleGetStarted = () => {
        dispatch(setProfilingDone(true));
        navigation.navigate('Dashboard');
    };

    if (isLoading || !welcomeData) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#FFF" />
            </View>
        );
    }

    return (
        <ImageBackground source={bg} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <Image source={logoWhite} style={styles.logo} />
                <Text style={styles.welcomeTitle}>{welcomeData.title.replace('{{user}}', 'Alwin')}</Text>
                <Text style={styles.welcomeSubtitle}>{welcomeData.description}</Text>

                <View style={styles.featureList}>
                    {welcomeData.features?.map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                            {welcomeData.showIcons && (
                                <Image
                                    source={{ uri: `${API_URL}/${feature.icons.replace(/\\/g, '/')}` }}
                                    style={styles.Icon}
                                />
                            )}
                            <View style={styles.featureTextContainer}>
                                <Text style={styles.featureTitle}>{feature.title}</Text>
                                <Text style={styles.featureDescription}>{feature.description}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <Text style={styles.callToAction}>Turn Insight Into Action. Let’s start!</Text>
                <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
                    <Text style={styles.buttonText}>GET STARTED</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </ImageBackground>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover', // Ensure background image covers the screen
    },
    safeArea: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 30, // Horizontal padding
        paddingTop: height * 0.05, // Padding from top for content below status bar
    },
    logo: {
        alignSelf: "center",
        width: width * 0.4, // Adjusted width based on image
        height: height * 0.05, // Adjusted height
        resizeMode: 'contain',
        // alignSelf: 'flex-start', // Align logo to the left
        marginLeft: width * 0.02, // Small left margin
        marginBottom: height * 0.05, // Space below logo
    },
    welcomeTitle: {
        fontSize: width * 0.07, // Larger font size for main title
        fontWeight: 'bold', // Bold as in the image
        color: '#FFFFFF',
        textAlign: 'center', // Aligned left
        width: '100%', // Take full width
        marginBottom: height * 0.02,

    },
    welcomeSubtitle: {
        fontSize: width * 0.035, // Smaller font size for subtitle
        color: '#B0B0B0', // Lighter grey for subtitle
        textAlign: 'center', // Aligned left
        width: '100%', // Take full width
        lineHeight: width * 0.055, // Adjusted line height
        marginBottom: height * 0.05, // Space below subtitle
    },
    featureList: {
        width: '100%',
        marginBottom: height * 0.05,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'flex-start', // Align icon and text at the top
        marginBottom: height * 0.03, // Space between feature items
    },
    featureIcon: {
        fontSize: width * 0.07, // Icon size
        marginRight: width * 0.04, // Space between icon and text
        color: '#FFFFFF', // White icons
    },
    featureTextContainer: {
        flex: 1, // Take remaining space
    },
    featureTitle: {
        fontSize: width * 0.035, // Feature title size
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: height * 0.005,
    },
    featureDescription: {
        fontSize: width * 0.031, // Feature description size
        color: '#B0B0B0',
        lineHeight: width * 0.045,
    },
    callToAction: {
        fontSize: width * 0.033, // Size for "Turn Insight Into Action"
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        width: '100%',
        marginBottom: height * 0.04, // Space above button
    },
    button: {
        backgroundColor: '#FFFFFF', // White button
        paddingVertical: height * 0.02,
        borderRadius: 10, // Slightly rounded corners
        alignItems: 'center',
        width: '90%', // Wider button
        position: 'absolute', // Position at the bottom
        bottom: height * 0.05, // Distance from bottom
        alignSelf: 'center', // Center the button horizontally
    },
    buttonText: {
        color: '#0A0A0A', // Dark text for white button
        fontSize: width * 0.03,
        fontWeight: 'bold', // Bold text
    },
    Icon: {
        width: 60,
        height: 60,
        resizeMode: "contain",
        tintColor: "white",
        marginRight: 10,
    }
});
