
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Platform, Switch, ImageBackground, Dimensions } from 'react-native';
import Header from '../../../components/Header';
import theme from '../../../themes/theme';
import { bg, p2 } from '../../../assets/images';

const { width, height } = Dimensions.get('window');
const scale = (size) => (width / 375) * size; // assuming 375 is the base width
const verticalScale = (size) => (height / 812) * size; // assuming 812 is the base height

const AccountSecurityScreen = ({ }) => {
    // Mock navigation for standalone component
    // const mockNavigation = {
    //     navigate: (screenName, params) => console.log(`Navigating to: ${screenName}`, params),
    //     goBack: () => console.log('Going back'),
    // };
    // const currentNavigation = navigation || mockNavigation;

    const [isFactorAuthEnabled, setIsFactorAuthEnabled] = useState(true);
    const [isAuthenticatorAppEnabled, setIsAuthenticatorAppEnabled] = useState(false);
    const [isSecurityAlertsEnabled, setIsSecurityAlertsEnabled] = useState(true);
    const [isDeviceAuthorizationEnabled, setIsDeviceAuthorizationEnabled] = useState(false);

    const ToggleItem = ({ text, description, isEnabled, onToggle }) => (
        <View style={styles.securityItem}>
            <View style={styles.securityTextContent}>
                <Text style={styles.securityItemText}>{text}</Text>
                {description && <Text style={styles.securityItemDescription}>{description}</Text>}
            </View>
            <Switch
                trackColor={{ false: theme.borderColor, true: theme.primaryColor }}
                thumbColor="white"
                onValueChange={onToggle}
                value={isEnabled}
            />
        </View>
    );

    const LinkItem = ({ text, onPress }) => (
        <TouchableOpacity style={styles.securityItem} onPress={onPress}>
            <Text style={styles.securityItemText}>{text}</Text>
        </TouchableOpacity>
    );

    return (
        <ImageBackground source={bg} style={{ flex: 1, }}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    {/* Header */}
                    <Header title={"Account Security "} />

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.securityOptionsContainer}>
                            <ToggleItem
                                text="Factor Authentication"
                                description="Enable 2FA"
                                isEnabled={isFactorAuthEnabled}
                                onToggle={() => setIsFactorAuthEnabled(prev => !prev)}
                            />
                            <ToggleItem
                                text="Authenticator App"
                                description="SMS-Based" // As per image
                                isEnabled={isAuthenticatorAppEnabled}
                                onToggle={() => setIsAuthenticatorAppEnabled(prev => !prev)}
                            />
                            <LinkItem text="Change Password" onPress={() => console.log('Change Password')} />
                            <LinkItem text="View Trusted Devices" onPress={() => console.log('View Trusted Devices')} />
                            <ToggleItem
                                text="Security Alerts"
                                isEnabled={isSecurityAlertsEnabled}
                                onToggle={() => setIsSecurityAlertsEnabled(prev => !prev)}
                            />
                            <ToggleItem
                                text="Device Authorization"
                                isEnabled={isDeviceAuthorizationEnabled}
                                onToggle={() => setIsDeviceAuthorizationEnabled(prev => !prev)}
                            />
                        </View>



                    </ScrollView>
                </View>
            </SafeAreaView>
            <View style={styles.absoluteFooter}>
                <View style={styles.footerWrapper}>
                    <TouchableOpacity style={styles.profileButton} onPress={() => console.log('Edit Profile')}>
                        <Image source={p2} style={styles.profileButtonIcon} />
                        <Text style={styles.profileButtonText}>Account Security</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
    },
    backButton: {
        paddingRight: 15,
    },
    backIcon: {
        fontSize: 24,
        color: '#E0E0E0',
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E0E0E0',
        flex: 1,
        textAlign: 'center',
    },
    headerRightPlaceholder: {
        width: 39,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    securityOptionsContainer: {
        marginBottom: 20,
        gap: 10
    },
    securityItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderColor: theme.borderColor,
        borderWidth: 1,
        borderRadius: scale(12),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 65,
        paddingHorizontal: 18,

    },
    securityTextContent: {
        flex: 1,
        marginRight: 10,
    },
    securityItemText: {
        fontSize: scale(13.6),
        fontFamily: "Inter-Regular",
        color: "#FFFFFF",
    },
    securityItemDescription: {
        fontSize: 12,
        color: '#B0B0B0',
        marginTop: 2,
    },
    chevronIcon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        tintColor: '#B0B0B0',
    },
    deactivateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: 12,
        padding: 15,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        marginTop: 10,
    },
    deactivateIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginRight: 10,
        tintColor: '#E53935',
    },
    deactivateButtonText: {
        fontSize: 16,
        color: '#E53935',
        fontWeight: 'bold',
    },

    absoluteFooter: {
        position: 'absolute',
        bottom: verticalScale(15),
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    footerWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderColor: theme.borderColor, borderWidth: 1,
        borderRadius: scale(102),
        padding: scale(14),
        paddingHorizontal: scale(26),
        justifyContent: 'center',
        flexDirection: 'row',
    },
    profileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.primaryColor,
        borderRadius: scale(120),
        padding: scale(7),
        paddingHorizontal: scale(25),
        justifyContent: 'center',
    },
    profileButtonIcon: {
        width: scale(25),
        height: scale(25),
        resizeMode: 'contain',
        marginRight: scale(10),
        tintColor: 'white',
    },
    profileButtonText: {
        fontSize: scale(13),
        color: 'white',
        fontFamily: 'Inter-Medium',
    },
});

export default AccountSecurityScreen;

