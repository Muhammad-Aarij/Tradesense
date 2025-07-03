
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Platform, Dimensions, ImageBackground } from 'react-native';
import { bg, logoWhite, p1 } from '../../../assets/images';
import Header from '../../../components/Header';
import theme from '../../../themes/theme';

const { width } = Dimensions.get('window');

const responsiveWidth = (size) => (width / 375) * size;
const responsiveHeight = (size) => (width / 375) * size;
const responsiveFontSize = (size) => (width / 375) * size;

const aboutUsImage = { uri: 'https://placehold.co/100x100/555/FFF?text=About+Us' }; // Image below About Us title

const AboutTrader365Screen = ({ navigation }) => {
    // Mock navigation for standalone component
    const mockNavigation = {
        navigate: (screenName, params) => console.log(`Navigating to: ${screenName}`, params),
        goBack: () => console.log('Going back'),
    };
    const currentNavigation = navigation || mockNavigation;

    return (
        <ImageBackground source={bg} style={{ flex: 1, position: "relative",paddingBottom:20, }}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    {/* Header */}
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <Header title={"About Trader365"} />

                        <View style={styles.topSection}>
                            <Image source={logoWhite} style={styles.logo} />
                            <Text style={styles.descriptionText}>
                                Trader365 is your all-in-one trading assistant — combining intelligent tools, real-time insights, verified learning, and secure account management to help you grow confidently in the financial world.
                            </Text>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>

                            <View style={styles.sectionCard}>
                                <Text style={styles.sectionTitle}>Core Features</Text>
                                <View style={styles.line} />
                                <View style={styles.featureItem}>
                                    <Image source={p1} style={{ width: 18, height: 18, resizeMode: "contain" }} />
                                    <Text style={styles.featureText}>Smart Trading Plans</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Image source={p1} style={{ width: 18, height: 18, resizeMode: "contain" }} />
                                    <Text style={styles.featureText}>Expert Video Courses</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Image source={p1} style={{ width: 18, height: 18, resizeMode: "contain" }} />
                                    <Text style={styles.featureText}>AI Chat Assistant</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Image source={p1} style={{ width: 18, height: 18, resizeMode: "contain" }} />
                                    <Text style={styles.featureText}>Affiliate Marketing</Text>
                                </View>
                            </View>

                            {/* About Us Section */}
                            <View style={[styles.sectionCard, { width: responsiveWidth(250) }]}>
                                <Text style={styles.sectionTitle}>About Us</Text>
                                <View style={styles.line} />
                                <Text style={{ ...styles.featureText, textAlign: "center" }}>
                                    Our mission is to make trading knowledge accessible and profitable for everyone by leveraging financial intelligence with smart tech technology.
                                </Text>
                            </View>
                        </ScrollView>

                    </ScrollView>
                </View>
            </SafeAreaView>
            {/* Version Info and Copyright */}
            <View style={styles.footerInfo}>
                <Text style={styles.versionText}>App Version: 1.0.1.20230520</Text>
                <Text style={styles.copyrightText}>© 2023 Trader365. All rights reserved.</Text>
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
        paddingHorizontal: responsiveWidth(20),
    },
    headerTitle: {
        fontSize: responsiveFontSize(20),
        fontFamily: "Inter-SemiBold",
        color: '#E0E0E0',
        textAlign: 'center',
    },
    scrollContent: {
        paddingBottom: responsiveHeight(20),
    },
    topSection: {
        alignItems: 'center',
        marginVertical: responsiveHeight(30),
    },
    logo: {
        width: responsiveWidth(150),
        height: responsiveHeight(45),
        resizeMode: 'contain',
        marginBottom: responsiveHeight(20),
    },
    descriptionText: {
        fontSize: responsiveFontSize(13),
        fontFamily: "Inter-Medium",
        color: '#E0E0E0',
        textAlign: 'center',
        lineHeight: responsiveFontSize(20),
    },
    sectionCard: {
        padding: responsiveWidth(35),
        paddingHorizontal: responsiveWidth(35),
        marginBottom: responsiveHeight(20),
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderWidth: 0.9, borderColor: theme.borderColor,
        borderRadius: 15,
        marginRight: 20,
    },
    line: {
        borderBottomWidth: 0.5,
        borderColor: "#FFFFFF",
        marginVertical: 24,
    },
    sectionTitle: {
        fontSize: responsiveFontSize(16),
        fontFamily: 'Inter-SemiBold',
        color: '#E0E0E0',
        textAlign: "center",
    },
    featureItem: {
        flexDirection: "row",
        gap: 10,
        marginBottom: responsiveHeight(20),
    },
    featureText: {
        fontFamily: 'Inter-Regular',
        fontSize: responsiveFontSize(13),
        color: '#B0B0B0',
        lineHeight: responsiveFontSize(20),
    },
    aboutUsImage: {
        width: responsiveWidth(80),
        height: responsiveHeight(80),
        borderRadius: responsiveWidth(10),
        resizeMode: 'contain',
        alignSelf: 'center',
        marginVertical: responsiveHeight(15),
        backgroundColor: '#3A3A3A', // Placeholder background
    },
    footerInfo: {
        position: "relative",
        bottom: 20,
        alignItems: 'center',
        marginTop: responsiveHeight(30),
    },
    versionText: {
        fontSize: responsiveFontSize(11),
        color: '#B0B0B0',
        fontFamily: "Inter-Regular",
        marginBottom: responsiveHeight(5),
    },
    copyrightText: {
        fontFamily: "Inter-Regular",
        fontSize: responsiveFontSize(10),
        color: '#B0B0B0',
    },
});

export default AboutTrader365Screen;
