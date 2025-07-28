import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { bg, searchMf, back, p2 } from '../../../assets/images';
import Header from '../../../components/Header';
import { fetchFAQs } from '../../../functions/Helpcenter';
import { ThemeContext } from '../../../context/ThemeProvider';

const { width, height } = Dimensions.get('window');

const responsiveWidth = (size) => (width / 375) * size;
const responsiveHeight = (size) => (width / 375) * size;
const responsiveFontSize = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;

const HelpCenterScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  const currentNavigation = navigation || {
    navigate: (screenName, params) => console.log(`Navigating to: ${screenName}`, params),
    goBack: () => console.log('Going back'),
  };

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

  const filteredFAQs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchText.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <ImageBackground source={theme.bg || bg} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Header title="Help Center" navigation={currentNavigation} />

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Search Bar */}
            <LinearGradient
              start={{ x: 0.0, y: 0.95 }}
              end={{ x: 1.0, y: 1.0 }}
              colors={['rgba(0, 0, 0, 0.04)', 'rgba(255, 255, 255, 0)']}
              style={styles.searchBarContainer}
            >
              <Image source={searchMf} style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, { color: theme.textColor }]}
                placeholder="Search..."
                placeholderTextColor={theme.textColor}
                value={searchText}
                onChangeText={setSearchText}
              />
            </LinearGradient>

            {/* FAQ List */}
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primaryColor} />
                <Text style={[styles.loadingText, { color: theme.textColor }]}>Loading FAQs...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load FAQs: {error.message}</Text>
                <TouchableOpacity
                  style={[styles.retryButton, { backgroundColor: theme.primaryColor }]}
                  onPress={() => {
                    setIsLoading(true);
                    setError(null);
                    fetchFAQs().then(setFaqs).catch(setError).finally(() => setIsLoading(false));
                  }}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.faqListContainer}>
                {filteredFAQs.map((faq, index) => (
                  <LinearGradient
                    key={faq._id || index}
                    start={{ x: 0.0, y: 0.95 }}
                    end={{ x: 1.0, y: 1.0 }}
                    colors={['rgba(0, 0, 0, 0.04)', 'rgba(255, 255, 255, 0)']}
                    style={styles.faqItem}
                  >
                    <TouchableOpacity
                      style={styles.faqQuestionButton}
                      onPress={() => toggleFAQ(faq._id || index)}
                    >
                      <Text style={[styles.faqQuestion, { color: theme.textColor }]}>{faq.question}</Text>
                      <Image
                        source={back}
                        style={[
                          styles.faqArrow,
                          expandedFAQ != (faq._id || index) && { transform: [{ rotate: '270deg' }] },
                        ]}
                      />
                    </TouchableOpacity>
                    {expandedFAQ === (faq._id || index) && (
                      <View style={styles.faqAnswerContainer}>
                        <Text style={[styles.faqAnswer, { color: theme.subTextColor }]}>{faq.answer}</Text>
                      </View>
                    )}
                  </LinearGradient>
                ))}
                {filteredFAQs.length === 0 && !isLoading && !error && (
                  <View style={styles.emptyResultsContainer}>
                    <Text style={[styles.emptyResultsText, { color: theme.placeholderTextColor }]}>
                      No FAQs found for your search.
                    </Text>
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* Footer Button */}
      <View style={styles.absoluteFooter}>
        <View style={styles.footerWrapper}>
          <LinearGradient
            start={{ x: 0.0, y: 0.95 }}
            end={{ x: 1.0, y: 1.0 }}
            colors={['rgba(0, 0, 0, 0.04)', 'rgba(255, 255, 255, 0)']}
            style={[styles.problemButton, { backgroundColor: theme.primaryColor }]}
          >
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => currentNavigation.navigate('ReportProblemScreen')}
            >
              <Image source={p2} style={styles.profileButtonIcon} />
              <Text style={styles.problemButtonText}>Still have a problem?</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
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
    paddingBottom: verticalScale(100),
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.9,
    borderColor: theme.borderColor,
    borderRadius: responsiveWidth(8),
    paddingHorizontal: responsiveWidth(15),
    height: responsiveHeight(55),
    marginVertical: responsiveHeight(20),
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
    fontSize: responsiveFontSize(11),
    height: '100%',
    fontFamily: 'Outfit-Regular',
  },
  faqListContainer: {
    gap: responsiveHeight(15),
    marginBottom: responsiveHeight(20),
  },
  faqItem: {
    borderWidth: 0.9,
    // borderTopWidth:0,
    borderColor: theme.borderColor,
    borderRadius: responsiveWidth(8),
    overflow: 'hidden',
  },
  faqQuestionButton: {
    paddingHorizontal: responsiveWidth(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveHeight(15),
    borderRadius: responsiveWidth(8),
    borderWidth: 0.9,
    borderTopWidth: 0,
    borderColor: theme.borderColor,
  },
  faqQuestion: {
    fontSize: responsiveFontSize(13),
    fontFamily: 'Outfit-Regular',
    flex: 1,
    marginRight: responsiveWidth(10),
  },
  faqArrow: {
    width: responsiveWidth(13),
    height: responsiveHeight(13),
    resizeMode: 'contain',
    tintColor: '#B0B0B0',
    transform: [{ rotate: '90deg' }],
  },
  faqAnswerContainer: {
    paddingHorizontal: responsiveWidth(15),
    paddingBottom: responsiveHeight(15),
    // borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#303030',
  },
  faqAnswer: {
    fontSize: responsiveFontSize(13),
    paddingTop: responsiveWidth(10),
    fontFamily: 'Outfit-Light-BETA',
    lineHeight: responsiveFontSize(20),
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: responsiveHeight(50),
  },
  loadingText: {
    marginTop: responsiveHeight(10),
    fontSize: responsiveFontSize(14),
  },
  errorContainer: {
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
    fontSize: responsiveFontSize(14),
    textAlign: 'center',
  },
  absoluteFooter: {
    position: 'absolute',
    bottom: verticalScale(25),
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  footerWrapper: {
    borderColor: theme.borderColor,
    borderWidth: 0.9,
    borderRadius: responsiveWidth(102),
    padding: responsiveWidth(14),
    paddingHorizontal: responsiveWidth(26),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  problemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: responsiveWidth(120),
    padding: responsiveWidth(11),
    paddingHorizontal: responsiveWidth(25),
    justifyContent: 'center',
  },
  profileButtonIcon: {
    width: responsiveWidth(20),
    height: responsiveHeight(20),
    resizeMode: 'contain',
    marginRight: responsiveWidth(10),
    tintColor: 'white',
  },
  problemButtonText: {
    fontSize: responsiveFontSize(13),
    color: 'white',
    fontFamily: 'Outfit-Medium',
  },
});

export default HelpCenterScreen;
