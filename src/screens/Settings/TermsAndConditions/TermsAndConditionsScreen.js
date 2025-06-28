import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, ImageBackground, ActivityIndicator } from 'react-native';
import Header from '../../../components/Header'; // Assuming this component exists
import { bg } from '../../../assets/images'; // Assuming 'bg' is your background image
import theme from '../../../themes/theme'; // Assuming 'theme' is correctly imported and available
import { fetchTerms } from '../../../functions/termsApi';

const { width, height } = Dimensions.get('window');

const responsiveWidth = (size) => (width / 375) * size;
const responsiveHeight = (size) => (width / 375) * size;
const responsiveFontSize = (size) => (width / 375) * size;
// Added for consistent vertical spacing on dynamic elements
const verticalScale = (size) => (height / 812) * size; // assuming 812 is the base height for scaling vertical positions


const TermsAndConditionsScreen = ({ navigation }) => {
    // Re-introducing navigation prop to use Header component and buttons
    const mockNavigation = {
        navigate: (screenName, params) => console.log(`Navigating to: ${screenName}`, params),
        goBack: () => console.log('Going back'),
    };
    const currentNavigation = navigation || mockNavigation;

    const [termsData, setTermsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadTerms = async () => {
            try {
                const data = await fetchTerms();
                setTermsData(data);
            } catch (err) {
                setError(err);
                console.error("Error fetching terms:", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadTerms();
    }, []);

    // Simple HTML parsing function
    const parseHtmlContent = (htmlString) => {
        if (!htmlString) return null;

        const elements = [];
        // Split by <p> tags
        const paragraphs = htmlString.split(/<\/?p>/).filter(Boolean); // Filter out empty strings
        paragraphs.forEach((p, index) => {
            if (p.includes('<h1>')) {
                // Extract <h1> content
                const h1Content = p.match(/<h1>(.*?)<\/h1>/)?.[1];
                if (h1Content) {
                    elements.push(<Text key={`h1-${index}`} style={styles.sectionHeading}>{h1Content}</Text>);
                }
                // Remaining text after h1 (if any) as paragraph
                const remainingText = p.replace(/<h1>.*?<\/h1>/, '').trim();
                if (remainingText) {
                    elements.push(<Text key={`p-${index}-rest`} style={styles.paragraph}>{remainingText}</Text>);
                }
            } else if (p.includes('<h2>')) {
                 // Extract <h2> content
                const h2Content = p.match(/<h2>(.*?)<\/h2>/)?.[1];
                if (h2Content) {
                    elements.push(<Text key={`h2-${index}`} style={styles.sectionHeading}>{h2Content}</Text>);
                }
                const remainingText = p.replace(/<h2>.*?<\/h2>/, '').trim();
                if (remainingText) {
                    elements.push(<Text key={`p-${index}-rest`} style={styles.paragraph}>{remainingText}</Text>);
                }
            } else if (p.includes('<ul>') || p.includes('<li>')) {
                // Basic list parsing (li elements)
                const listItems = p.split(/<\/?li>/).filter(Boolean).map((item, liIndex) => {
                    const cleanItem = item.replace(/<\/?ul>/g, '').trim(); // Remove ul tags
                    return cleanItem ? <Text key={`li-${index}-${liIndex}`} style={styles.listItem}>• {cleanItem}</Text> : null;
                }).filter(Boolean);
                elements.push(...listItems);
            }
            else {
                // Regular paragraph
                const cleanParagraph = p.replace(/<\/?(strong|em|a|br|div)>/g, '').replace(/&nbsp;/g, ' ').trim(); // Basic tag removal
                if (cleanParagraph) {
                    elements.push(<Text key={`p-${index}`} style={styles.paragraph}>{cleanParagraph}</Text>);
                }
            }
        });
        return elements;
    };


    return (
        <ImageBackground source={bg} style={{ flex: 1 }}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    {/* Header */}
                    <Header title={"Terms and Conditions"} navigation={currentNavigation} />
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {isLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#007AFF" />
                                <Text style={styles.loadingText}>Loading Terms...</Text>
                            </View>
                        ) : error ? (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>Error loading terms: {error.message}</Text>
                                <TouchableOpacity style={styles.retryButton} onPress={() => { setIsLoading(true); setError(null); loadTerms(); }}>
                                    <Text style={styles.retryButtonText}>Retry</Text>
                                </TouchableOpacity>
                            </View>
                        ) : termsData ? (
                            <View style={styles.contentCard}>
                                <Text style={styles.cardTitle}>{termsData.title || 'Terms and Conditions'}</Text>
                                {/* Render parsed HTML content */}
                                {parseHtmlContent(termsData.content)}

                                {/* Confirmation line from original image (added if not in API content) */}
                                {!termsData.content.includes("I confirm that I have read and accept") && (
                                     <Text style={styles.sectionHeading}>5. DISCLAIMER OF WARRANTIES AND LIMITATION OF LIABILITY</Text>
                                )}
                                {!termsData.content.includes("I confirm that I have read and accept") && (
                                    <Text style={styles.paragraph}>
                                        I confirm that I have read and accept the terms and conditions and privacy policy.
                                    </Text>
                                )}
                            </View>
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No terms and conditions available.</Text>
                            </View>
                        )}
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
    // Header styles are now largely handled by the imported Header component
    scrollContent: {
        paddingBottom: verticalScale(100), // Adjust padding to make space for the absolute footer/buttons
    },
    contentCard: {
        // backgroundColor: 'rgba(255, 255, 255, 0.06)', // Background like in About screen
        // borderWidth: 0.9, borderColor: '#303030', // Border like in About screen
        // borderRadius: responsiveWidth(12),
        paddingVertical: responsiveHeight(10), // Padding adjusted for overall scroll view
        marginBottom: responsiveHeight(20),
    },
    cardTitle: {
        fontSize: responsiveFontSize(18), // Slightly larger than sectionHeading
        fontWeight: 'bold',
        color: '#E0E0E0',
        marginBottom: responsiveHeight(15),
    },
    sectionHeading: {
        fontSize: responsiveFontSize(13),
        fontFamily: 'Inter-SemiBold', // Ensure this font is loaded
        color: '#E0E0E0',
        marginTop: responsiveHeight(15),
        marginBottom: responsiveHeight(8),
    },
    paragraph: {
        fontSize: responsiveFontSize(12),
        fontFamily: 'Inter-Thin-BETA', // Ensure this font is loaded
        color: '#FFFFFF',
        lineHeight: responsiveFontSize(20),
        marginBottom: responsiveHeight(10),
    },
    listItem: { // Style for list items if bullet points are needed
        fontSize: responsiveFontSize(12),
        fontFamily: 'Inter-Thin-BETA',
        color: '#FFFFFF',
        lineHeight: responsiveFontSize(20),
        marginLeft: responsiveWidth(10),
        marginBottom: responsiveHeight(5),
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: responsiveHeight(30),
        paddingBottom: Platform.OS === 'ios' ? verticalScale(30) : verticalScale(20), // Adjust for iOS safe area/Android nav bar
        backgroundColor: '#010b13', // Match background for seamless look
        paddingHorizontal: responsiveWidth(20), // Match container padding
        position: 'absolute', // Pin to bottom
        bottom: 0,
        left: 0,
        right: 0,
    },
    cancelButton: {
        paddingVertical: responsiveHeight(12),
        paddingHorizontal: responsiveWidth(20),
        borderRadius: responsiveWidth(8),
        marginRight: responsiveWidth(10),
        alignItems: 'center', // Center text
        justifyContent: 'center', // Center text
    },
    cancelButtonText: {
        color: '#B0B0B0',
        fontSize: responsiveFontSize(14),
        fontWeight: 'bold',
        fontFamily: 'Inter-Medium', // Consistent font
    },
    acceptButton: {
        backgroundColor: '#007AFF',
        paddingVertical: responsiveHeight(12),
        paddingHorizontal: responsiveWidth(20),
        borderRadius: responsiveWidth(8),
        alignItems: 'center', // Center text
        justifyContent: 'center', // Center text
    },
    acceptButtonText: {
        color: '#FFFFFF',
        fontSize: responsiveFontSize(14),
        fontWeight: 'bold',
        fontFamily: 'Inter-Medium', // Consistent font
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: responsiveHeight(100),
    },
    loadingText: {
        color: '#E0E0E0',
        marginTop: responsiveHeight(10),
        fontSize: responsiveFontSize(14),
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: responsiveHeight(100),
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: responsiveHeight(10),
        fontSize: responsiveFontSize(14),
    },
    retryButton: {
        backgroundColor: '#007AFF',
        borderRadius: responsiveWidth(8),
        paddingVertical: responsiveHeight(10),
        paddingHorizontal: responsiveWidth(20),
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: responsiveFontSize(14),
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: responsiveHeight(100),
    },
    emptyText: {
        color: '#B0B0B0',
        fontSize: responsiveFontSize(14),
    },
});

export default TermsAndConditionsScreen;
