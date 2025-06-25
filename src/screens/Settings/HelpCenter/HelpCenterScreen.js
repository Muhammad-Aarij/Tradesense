
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, SafeAreaView, Platform, Dimensions, ImageBackground } from 'react-native';
import Header from '../../../components/Header';
import { back, bg, p2, searchMf } from '../../../assets/images';
import theme from '../../../themes/theme';

const { width, height } = Dimensions.get('window');
const scale = (size) => (width / 375) * size; // assuming 375 is the base width
const verticalScale = (size) => (height / 812) * size; // assuming 812 is the base height

// Responsive helper functions (using common base dimensions)
const responsiveWidth = (size) => (width / 375) * size;
const responsiveHeight = (size) => (width / 375) * size; // Using width for height scaling for consistency
const responsiveFontSize = (size) => (width / 375) * size;

// Mock image assets (replace with your actual local `require` paths)
const searchIcon = { uri: 'https://placehold.co/20x20/A0A0A0/000?text=🔍' };
const dropdownArrow = { uri: 'https://placehold.co/20x20/A0A0A0/000?text=V' }; // Down arrow

const HelpCenterScreen = ({ navigation }) => {
  // Mock navigation for standalone component
  const mockNavigation = {
    navigate: (screenName, params) => console.log(`Navigating to: ${screenName}`, params),
    goBack: () => console.log('Going back'),
  };
  const currentNavigation = navigation || mockNavigation;

  const [searchText, setSearchText] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null); // State to manage which FAQ is expanded

  // Mock FAQ data
  const faqs = [
    {
      id: 1,
      question: "How do I manage my notifications?",
      answer: "Go to your profile settings, then navigate to the 'Notifications' section. From there, you can customize your preferences for various types of alerts and updates.",
    },
    {
      id: 2,
      question: "Is my data safe and Private?",
      answer: "Yes, we prioritize your data security and privacy. All your data is encrypted and stored on secure servers. We adhere to strict privacy policies and never share your personal information with third parties.",
    },
    {
      id: 3,
      question: "How do I manage my Notification ?", // Typo from image, fixed below in rendering
      answer: "Access your notification settings in the 'Settings' menu. You'll find options to enable or disable push notifications, email alerts, and in-app messages based on your preferences.",
    },
    {
      id: 4,
      question: "How do I join a support Group ?",
      answer: "You can join a support group by visiting the 'Community' section of the app. Look for the 'Support Groups' tab and browse available groups or create your own. Follow the instructions to join a group that aligns with your needs.",
    },
  ];

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <ImageBackground source={bg} style={{ flex: 1, }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <Header title={"Help Center"} />

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

            {/* FAQ List */}
            <View style={styles.faqListContainer}>
              {faqs.map((faq) => (
                <View key={faq.id} style={styles.faqItem}>
                  <TouchableOpacity style={styles.faqQuestionButton} onPress={() => toggleFAQ(faq.id)}>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <Image
                      source={back}
                      style={[
                        styles.faqArrow,
                        expandedFAQ === faq.id && { transform: [{ rotate: '270deg' }] },
                      ]}
                    />
                  </TouchableOpacity>
                  {expandedFAQ === faq.id && (
                    <View style={styles.faqAnswerContainer}>
                      <Text style={styles.faqAnswer}>{faq.answer}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>


          </ScrollView>
        </View>
      </SafeAreaView>

      <View style={styles.absoluteFooter}>
        <View style={styles.footerWrapper}>
          <TouchableOpacity style={styles.profileButton} onPress={() => console.log('Edit Profile')}>
            <Image source={p2} style={styles.profileButtonIcon} />
            <Text style={styles.profileButtonText}>Help Center</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(15),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)', // Thin separator
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
    flex: 1, // Allows title to take available space
    textAlign: 'center',
    marginLeft: -responsiveWidth(24 + 15), // Offset for back button to visually center title
  },
  scrollContent: {
    paddingBottom: responsiveHeight(20),
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a1d2e', // Darker input background
    borderRadius: responsiveWidth(10),
    paddingHorizontal: responsiveWidth(15),
    height: responsiveHeight(55),
    marginVertical: responsiveHeight(20),
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 0.9, borderColor: theme.borderColor,
    borderRadius: 8,
  },
  searchIcon: {
    width: responsiveWidth(20),
    height: responsiveHeight(20),
    resizeMode: 'contain',
    marginRight: responsiveWidth(10),
    tintColor: '#B0B0B0',
  },
  searchInput: {
    flex: 1,
    color: '#E0E0E0',
    fontSize: responsiveFontSize(14),
    height: '100%', // Ensures text input uses full height
  },
  faqListContainer: {
    gap: 15,
    marginBottom: responsiveHeight(20),
  },
  faqItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 0.9, borderColor: theme.borderColor,
    borderRadius: 8,
  },
  // To remove the last border, you'd apply a style to the last item rendered
  lastFaqItem: {
    borderBottomWidth: 0,
  },
  faqQuestionButton: {
    paddingHorizontal: responsiveWidth(15),
    // backgroundColor: 'rgba/(255, 255, 255, 0.06)',
    borderWidth: 0.9, borderColor: theme.borderColor,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveHeight(15),
  },
  faqQuestion: {
    fontSize: responsiveFontSize(13),
    color: '#ffffff',
    fontFamily: "Inter-Light-BETA",
    flex: 1, // Allows text to wrap
    marginRight: responsiveWidth(10),
  },
  faqArrow: {
    transform: [{ rotate: `90deg` }],
    width: responsiveWidth(13),
    height: responsiveHeight(13),
    resizeMode: 'contain',
    tintColor: '#B0B0B0',
  },
  faqAnswerContainer: {
    padding: responsiveWidth(15),
    // borderWidth: 0.9, borderColor: theme.borderColor,
    // borderRadius: 8,
    paddingBottom: responsiveHeight(15),
  },
  faqAnswer: {
    fontSize: responsiveFontSize(13),
    color: '#FFFFFF',
    fontFamily: "Inter-Thin-BETA",

    lineHeight: responsiveFontSize(20),
  },
  problemButton: {
    backgroundColor: '#007AFF', // Blue button color
    borderRadius: responsiveWidth(13),
    paddingVertical: responsiveHeight(15),
    alignItems: 'center',
    marginTop: responsiveHeight(10),
  },
  problemButtonText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(16),
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

export default HelpCenterScreen;
