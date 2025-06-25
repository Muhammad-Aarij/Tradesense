
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, Dimensions, ImageBackground } from 'react-native';
import Header from '../../../components/Header';
import { bg } from '../../../assets/images';
import theme from '../../../themes/theme';
const { width } = Dimensions.get('window');

const responsiveWidth = (size) => (width / 375) * size;
const responsiveHeight = (size) => (width / 375) * size;
const responsiveFontSize = (size) => (width / 375) * size;

const TermsAndConditionsScreen = ({ }) => {

    //   const mockNavigation = {
    //     navigate: (screenName, params) => console.log(`Navigating to: ${screenName}`, params),
    //     goBack: () => console.log('Going back'),
    //   };
    //   const currentNavigation = navigation || mockNavigation;

    return (
        <ImageBackground source={bg} style={{ flex: 1 }}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    {/* Header */}
                    <Header title={"Terms and Conditions"} />
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.contentCard}>
                            <Text style={styles.cardTitle}>Your Agreement</Text>
                            <Text style={styles.paragraph}>
                                Last Revised: December 16, 2019 {"\n\n"}
                                Welcome to www.trader-sense.info. This site is provided as a service to our visitors and may be used for informational purposes only. Because the Terms and Conditions contain legal obligations, please read them carefully.
                            </Text>

                            <Text style={styles.sectionHeading}>1. YOUR AGREEMENT</Text>
                            <Text style={styles.paragraph}>
                                By using this Site, you agree to be bound by, and to comply with, these Terms and Conditions. If you do not agree to these Terms and Conditions, please do not use this Site. {"\n"}
                                PLEASE NOTE: We reserve the right, at our sole discretion, to change portions of these Terms and Conditions at any time. Unless otherwise indicated, amendments will become effective immediately. We will review these Terms and Conditions periodically and your continued use of the Site following the posting of changes and/ or modifications will constitute your acceptance of the revised Terms and Conditions and the reasonableness of these standards for notice of changes. For your information, this page was last updated as of the date at the top of these terms and conditions.
                            </Text>

                            <Text style={styles.sectionHeading}>2. PRIVACY</Text>
                            <Text style={styles.paragraph}>
                                We provide our Privacy Policy, which also governs your visit to this Site, to understand our practices.
                            </Text>

                            <Text style={styles.sectionHeading}>3. LINKED SITES</Text>
                            <Text style={styles.paragraph}>
                                Trader 365, TraderSense, and its subsidiaries are not responsible for the content of any sites that may be linked to this Site. These links are provided for your convenience only and do not signify that Trader 365 endorses or recommends the sites. We disclaim all warranties, express or implied, as to the accuracy, legality, reliability, or validity of any content on any linked site.
                            </Text>

                            <Text style={styles.sectionHeading}>4. FORWARD LOOKING STATEMENTS</Text>
                            <Text style={styles.paragraph}>
                                This Site may contain forward-looking statements that are based on our current expectations, forecasts, and assumptions. These statements are subject to risks and uncertainties that could cause actual results to differ materially from those expressed or implied by the statements.
                            </Text>

                            <Text style={styles.sectionHeading}>5. DISCLAIMER OF WARRANTIES AND LIMITATION OF LIABILITY</Text>
                            <Text style={styles.paragraph}>
                                I confirm that I have read and accept the terms and conditions and privacy policy.
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: responsiveHeight(15),
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    },
    backButton: {
        paddingRight: responsiveWidth(15),
    },
    backIcon: {
        fontSize: responsiveFontSize(24),
        color: '#E0E0E0',
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: responsiveFontSize(18),
        fontWeight: 'bold',
        color: '#E0E0E0',
        flex: 1,
        textAlign: 'center',
        marginLeft: -responsiveWidth(24 + 15),
    },
    scrollContent: {
        paddingBottom: responsiveHeight(20),
    },
    contentCard: {
        marginBottom: responsiveHeight(20),
    },
    cardTitle: {
        fontSize: responsiveFontSize(16),
        fontWeight: 'bold',
        color: '#E0E0E0',
        marginBottom: responsiveHeight(15),
    },
    sectionHeading: {
        fontSize: responsiveFontSize(13),
        fontFamily: 'Inter-SemiBold',
        color: '#E0E0E0',
        marginTop: responsiveHeight(15),
        marginBottom: responsiveHeight(8),
    },
    paragraph: {
        fontSize: responsiveFontSize(12),
        fontFamily: 'Inter-Thin-BETA',
        color: '#FFFFFF',
        lineHeight: responsiveFontSize(20),
        marginBottom: responsiveHeight(10),
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end', // Align buttons to the right as in image
        marginTop: responsiveHeight(30),
    },
    cancelButton: {
        // No background for cancel, only text
        paddingVertical: responsiveHeight(12),
        paddingHorizontal: responsiveWidth(20),
        borderRadius: responsiveWidth(8),
        marginRight: responsiveWidth(10),
    },
    cancelButtonText: {
        color: '#B0B0B0',
        fontSize: responsiveFontSize(14),
        fontWeight: 'bold',
    },
    acceptButton: {
        backgroundColor: '#007AFF', // Blue button
        paddingVertical: responsiveHeight(12),
        paddingHorizontal: responsiveWidth(20),
        borderRadius: responsiveWidth(8),
    },
    acceptButtonText: {
        color: '#FFFFFF',
        fontSize: responsiveFontSize(14),
        fontWeight: 'bold',
    },
});

export default TermsAndConditionsScreen;
