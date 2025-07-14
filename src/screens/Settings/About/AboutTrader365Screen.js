import React, { useContext, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
    SafeAreaView, Dimensions, ImageBackground
} from 'react-native';
import { bg, cf1, cf2, cf3, cf4, logoWhite } from '../../../assets/images';
import Header from '../../../components/Header';
import { ThemeContext } from '../../../context/ThemeProvider';

const { width } = Dimensions.get('window');

const responsiveWidth = (size) => (width / 375) * size;
const responsiveHeight = (size) => (width / 812) * size;
const responsiveFontSize = (size) => (width / 375) * size;

const AboutTrader365Screen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    return (
        <ImageBackground source={theme.bg} style={{ flex: 1 }}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <Header title={"About"} />

                        <View style={styles.topSection}>
                            <Image source={logoWhite} style={styles.logo} />
                            <Text style={styles.descriptionText}>
                                Trader365 is your all-in-one trading assistant — combining intelligent tools, real-time insights, verified learning, and secure account management to help you grow confidently in the financial world.
                            </Text>
                        </View>
                        <ScrollView style={{ flexDirection: "row", gap: 20, }}>
                            {/* 🔓 Core Features Card */}
                            <View style={styles.sectionCard}>
                                <Text style={styles.sectionTitle}>Core Features</Text>
                                <View style={styles.line} />
                                <View style={styles.featureItem}>
                                    <Image source={cf1} style={styles.icon} />
                                    <Text style={styles.featureText}>Smart Trading Plans</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Image source={cf2} style={styles.icon} />
                                    <Text style={styles.featureText}>Expert Video Courses</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Image source={cf3} style={styles.icon} />
                                    <Text style={styles.featureText}>AI Chat Assistant</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Image source={cf4} style={styles.icon} />
                                    <Text style={styles.featureText}>Affiliate Marketing</Text>
                                </View>
                            </View>

                            {/* 👥 About Us Card */}
                            <View style={styles.sectionCard}>
                                <Text style={styles.sectionTitle}>About Us</Text>
                                <View style={styles.line} />
                                <Text style={[styles.featureText, { textAlign: 'center' }]}>
                                    Our mission is to make trading knowledge accessible and profitable for everyone by leveraging financial intelligence with smart tech technology.
                                </Text>
                            </View>
                        </ScrollView>
                    </ScrollView>
                </View>
            </SafeAreaView>

            {/* 📎 Footer Info */}
            <View style={styles.footerInfo}>
                <Text style={styles.versionText}>App Version: 1.0.1.20230520</Text>
                <Text style={styles.copyrightText}>© 2023 Trader365. All rights reserved.</Text>
            </View>
        </ImageBackground>
    );
};


const getStyles = (theme) => StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: responsiveWidth(20),
    },
    scrollContent: {
        paddingBottom: responsiveHeight(20),
    },
    topSection: {
        alignItems: 'center',
        marginVertical: responsiveHeight(30),
    },
    icon: {
        width: 25, height: 25, resizeMode: "contain"
    },
    logo: {
        width: responsiveWidth(200),
        height: responsiveHeight(95),
        resizeMode: 'contain',
        marginBottom: responsiveHeight(30),
    },
    descriptionText: {
        fontSize: responsiveFontSize(13),
        fontFamily: "Inter-Medium",
        color: theme.textColor,
        textAlign: 'center',
        lineHeight: responsiveFontSize(20),
    },
    sectionCard: {
        padding: responsiveWidth(35),
        marginBottom: responsiveHeight(20),
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderWidth: 0.9,
        borderColor: theme.borderColor,
        borderRadius: 15,
        marginRight: 20,
    },
    sectionTitle: {
        fontSize: responsiveFontSize(16),
        fontFamily: 'Inter-SemiBold',
        color: theme.textColor,
        textAlign: "center",
    },
    line: {
        borderBottomWidth: 0.5,
        borderColor: theme.textColor,
        marginVertical: 24,
    },
    featureItem: {
        flexDirection: "row",
        gap: 10,
        marginBottom: responsiveHeight(20),
    },
    featureText: {
        fontFamily: 'Inter-Regular',
        fontSize: responsiveFontSize(13),
        color: theme.subTextColor,
        lineHeight: responsiveFontSize(20),
    },
    footerInfo: {
        position: "relative",
        bottom: 20,
        alignItems: 'center',
        marginTop: responsiveHeight(30),
    },
    versionText: {
        fontSize: responsiveFontSize(11),
        color: theme.subTextColor,
        fontFamily: "Inter-Regular",
        marginBottom: responsiveHeight(5),
    },
    copyrightText: {
        fontFamily: "Inter-Regular",
        fontSize: responsiveFontSize(10),
        color: theme.subTextColor,
    },
    arrowText: {
        fontSize: responsiveFontSize(30),
        color: theme.textColor,
        paddingHorizontal: 10,
    },
    leftArrow: {
        position: 'absolute',
        left: 0,
        top: '50%',
        zIndex: 10,
    },
    rightArrow: {
        position: 'absolute',
        right: 0,
        top: '50%',
        zIndex: 10,
    },
    carouselContainer: {
        alignItems: 'center',
        position: 'relative',
    },
});

export default AboutTrader365Screen;
