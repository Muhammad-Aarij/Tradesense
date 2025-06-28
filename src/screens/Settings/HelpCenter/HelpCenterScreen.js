// src/screens/HelpCenterScreen.js
// This screen provides a help center interface with a search bar and FAQs.

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, SafeAreaView, Platform, Dimensions, ImageBackground, ActivityIndicator } from 'react-native';
import { bg, searchMf, back, p2 } from '../../../assets/images'; // Ensure p2 is the correct icon for the footer
import theme from '../../../themes/theme'; // Assuming 'theme' is correctly imported and available
import Header from '../../../components/Header'; // Re-using your Header component
import { fetchFAQs } from '../../../functions/Helpcenter';

const { width, height } = Dimensions.get('window');

// Responsive helper functions
const responsiveWidth = (size) => (width / 375) * size;
const responsiveHeight = (size) => (width / 375) * size; // Using width for height scaling for consistency
const responsiveFontSize = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size; // Use verticalScale for absolute positioning from bottom

const HelpCenterScreen = ({ navigation }) => {
  // Mock navigation for standalone component
  const mockNavigation = {
    navigate: (screenName, params) => console.log(`Navigating to: ${screenName}`, params),
    goBack: () => console.log('Going back'),
  };
  const currentNavigation = navigation || mockNavigation;

  const [searchText, setSearchText] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFAQs = async () => {
      try {
        const data = await fetchFAQs();
        setFaqs(data);
      } catch (err) {
        setError(err);
        console.error('Error loading FAQs:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadFAQs();
  }, []);

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchText.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <ImageBackground source={bg} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          {/* Using your custom Header component */}
          <Header title="Help Center" navigation={currentNavigation} />

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Search Bar */}
            <View style={styles.searchBarContainer}>
              <Image source={searchMf} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor="#B0B0B0"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading FAQs...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load FAQs: {error.message}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => { setIsLoading(true); setError(null); fetchFAQs().then(setFaqs).catch(setError).finally(() => setIsLoading(false)); }}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.faqListContainer}>
                {filteredFAQs.map((faq, index) => (
                  <View
                    key={faq._id || index} // Use _id from API, fallback to index
                    style={[
                      styles.faqItem,
                      index === filteredFAQs.length - 1 ? styles.lastFaqItem : {}, // Apply last item style
                    ]}
                  >
                    <TouchableOpacity style={styles.faqQuestionButton} onPress={() => toggleFAQ(faq._id || index)}>
                      <Text style={styles.faqQuestion}>{faq.question}</Text>
                      <Image
                        source={back} // Assuming 'back' asset is a right-pointing arrow
                        style={[
                          styles.faqArrow,
                          expandedFAQ === (faq._id || index) && { transform: [{ rotate: '270deg' }] }, // Rotate up when expanded
                        ]}
                      />
                    </TouchableOpacity>
                    {expandedFAQ === (faq._id || index) && (
                      <View style={styles.faqAnswerContainer}>
                        <Text style={styles.faqAnswer}>{faq.answer}</Text>
                      </View>
                    )}
                  </View>
                ))}
                {filteredFAQs.length === 0 && !isLoading && !error && (
                  <View style={styles.emptyResultsContainer}>
                    <Text style={styles.emptyResultsText}>No FAQs found for your search.</Text>
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* Absolute Footer Button */}
      <View style={styles.absoluteFooter}>
        <View style={styles.footerWrapper}>
          <TouchableOpacity style={styles.problemButton} onPress={() => currentNavigation.navigate('ReportProblemScreen')}>
            <Text style={styles.problemButtonText}>Still have a problem?</Text>
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
    paddingHorizontal: responsiveWidth(20),
  },
  // Header styles are now largely handled by the imported Header component
  // If you need custom header, remove the Header component and uncomment/add these:
  // header: { /* ... */ },
  // backButton: { /* ... */ },
  // backIcon: { /* ... */ },
  // headerTitle: { /* ... */ },

  scrollContent: {
    paddingBottom: verticalScale(100), // Adjust padding to make space for the absolute footer
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)', // Matched image background
    borderWidth: 0.9,
    borderColor: theme.borderColor, // Closer to the image's border color
    borderRadius: responsiveWidth(8), // Matched image border radius
    paddingHorizontal: responsiveWidth(15),
    height: responsiveHeight(55),
    marginVertical: responsiveHeight(20),
  },
  searchIcon: {
    width: responsiveWidth(20),
    height: responsiveHeight(20),
    resizeMode: 'contain',
    marginRight: responsiveWidth(10),
    tintColor: '#B0B0B0', // Grey tint for search icon
  },
  searchInput: {
    flex: 1,
    color: '#E0E0E0',
    fontSize: responsiveFontSize(14),
    height: '100%',
    fontFamily: "Inter-Regular", // Consistent font
  },
  faqListContainer: {
    gap: responsiveHeight(15), // Spacing between FAQ cards
    marginBottom: responsiveHeight(20),
  },
  faqItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)', // Matched image background
    borderWidth: 0.9,
    borderColor: theme.borderColor, // Matched image border color
    borderRadius: responsiveWidth(8), // Matched image border radius
    overflow: 'hidden', // Ensure content respects border radius
  },
  lastFaqItem: {
    // No specific style needed if gap handles spacing; otherwise add borderBottomWidth: 0
  },
  faqQuestionButton: {
    paddingHorizontal: responsiveWidth(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveHeight(15),
    borderRadius: responsiveWidth(8), 
    borderWidth: 0.9,
    borderTopWidth:0,
    borderColor: theme.borderColor,
  },
  faqQuestion: {
    fontSize: responsiveFontSize(13),
    color: '#ffffff',
    fontFamily: "Inter-Light-BETA", // Ensure this font is loaded
    flex: 1,
    marginRight: responsiveWidth(10),
  },
  faqArrow: {
    width: responsiveWidth(13),
    height: responsiveHeight(13),
    resizeMode: 'contain',
    tintColor: '#B0B0B0',
    transform: [{ rotate: `90deg` }], // Right arrow by default
  },
  faqAnswerContainer: {
    paddingHorizontal: responsiveWidth(15),
    paddingBottom: responsiveHeight(15),
    // backgroundColor: 'rgba(255, 255, 255, 0.03)', // Slightly different background for answer part
    borderTopWidth: StyleSheet.hairlineWidth, // Thin separator
    borderTopColor: '#303030',
  },
  faqAnswer: {
    fontSize: responsiveFontSize(13),
    color: '#FFFFFF',
    paddingTop:responsiveWidth(10),
    fontFamily: "Inter-Thin-BETA", // Ensure this font is loaded
    lineHeight: responsiveFontSize(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: responsiveHeight(50),
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
    paddingVertical: responsiveHeight(50),
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
  emptyResultsContainer: {
    paddingVertical: responsiveHeight(50),
    alignItems: 'center',
  },
  emptyResultsText: {
    color: '#B0B0B0',
    fontSize: responsiveFontSize(14),
    textAlign: 'center',
  },

  // Footer styles (fixed at bottom)
  absoluteFooter: {
    position: 'absolute',
    bottom: verticalScale(25), // Adjusted bottom spacing
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10, // Ensure it's above other content
  },
  footerWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)', // Matches design
    borderColor: '#303030', // Matches design
    borderWidth: 0.9,
    borderRadius: responsiveWidth(102), // Large border radius for capsule shape
    padding: responsiveWidth(14), // Internal padding
    paddingHorizontal: responsiveWidth(26), // More horizontal padding
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  problemButton: { // This button takes the place of your original 'profileButton' in the footer
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF', // Blue button
    borderRadius: responsiveWidth(120), // Highly rounded for capsule
    padding: responsiveWidth(7), // Smaller padding inside
    paddingHorizontal: responsiveWidth(25), // More horizontal padding inside
    justifyContent: 'center',
  },
  profileButtonIcon: { // Renamed from p2 to problemButtonIcon for clarity
    width: responsiveWidth(20), // Smaller icon
    height: responsiveHeight(20),
    resizeMode: 'contain',
    marginRight: responsiveWidth(10),
    tintColor: 'white',
  },
  problemButtonText: { // Renamed from profileButtonText for clarity
    fontSize: responsiveFontSize(13),
    color: 'white',
    fontFamily: 'Inter-Medium', // Ensure font is loaded
  },
});

export default HelpCenterScreen;
