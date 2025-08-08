import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
  Dimensions, ImageBackground, ActivityIndicator
} from 'react-native';
import { useDispatch } from 'react-redux';
import RenderHtml from 'react-native-render-html';
import Header from '../../../components/Header';
import { fetchTerms } from '../../../functions/termsApi';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { ThemeContext } from '../../../context/ThemeProvider';

const { width, height } = Dimensions.get('window');
const responsiveWidth = size => (width / 375) * size;
const responsiveHeight = size => (height / 812) * size;
const responsiveFontSize = size => (width / 375) * size;
const verticalScale = size => (height / 812) * size;

const TermsAndConditionsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const [termsData, setTermsData] = useState(null);
  const [error, setError] = useState(null);

  const loadTerms = async () => {
    try {
      dispatch(startLoading());
      const data = await fetchTerms();
      setTermsData(data);
    } catch (err) {
      console.error('Error fetching terms:', err);
      setError(err);
    } finally {
      dispatch(stopLoading());
    }
  };

  useEffect(() => {
    loadTerms();
  }, []);

  return (
    <ImageBackground source={theme.bg} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Header title="" navigation={navigation} />

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={[styles.errorText, { color: theme.errorColor || 'red' }]}>
                  Error loading terms: {error.message}
                </Text>
                <TouchableOpacity
                  style={[styles.retryButton, { backgroundColor: theme.primaryColor }]}
                  onPress={loadTerms}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.contentCard}>
                <Text style={[styles.cardTitle, { color: theme.textColor }]}>
                  {termsData?.title || 'Terms and Conditions'}
                </Text>

                {termsData?.content && (
                  <RenderHtml
                    contentWidth={width - 2 * responsiveWidth(20)}
                    source={{ html: termsData.content }}
                    baseStyle={{
                      color: theme.textColor,
                      fontSize: responsiveFontSize(12),
                      fontFamily: 'Outfit-Regular',
                    }}
                    tagsStyles={{
                      h1: { fontSize: responsiveFontSize(14), fontFamily: 'Outfit-SemiBold', marginBottom: 10 },
                      h2: { fontSize: responsiveFontSize(12), fontFamily: 'Outfit-Medium', marginBottom: 0 },
                      strong: {fontFamily:"Outfit-SemiBold"},
                      p: { marginBottom: 5, fontFamily: 'Outfit-Regular' },
                      ul: { paddingLeft: 10, listStyleType: "none" },
                      li: ({ TDefaultRenderer, ...props }) => (
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', }}>
                          <Text style={{
                            fontSize: responsiveFontSize(10),
                            // lineHeight: responsiveFontSize(18),
                            marginLeft: 6,
                            color: theme.textColor,
                            marginTop: 2, // slight nudge to align vertically
                          }}>•</Text>
                          <View style={{ flex: 1 }}>
                            <TDefaultRenderer {...props} />
                          </View>
                        </View>
                      )
                    }}

                  />

                )}

                {!termsData?.content?.includes('I confirm that I have read and accept') && (
                  <>
                    <Text style={[styles.sectionHeading, { color: theme.textColor, textAlign: "center" }]}>
                      DISCLAIMER OF WARRANTIES AND LIMITATION OF LIABILITY
                    </Text>
                    <Text style={[styles.paragraph, { color: theme.textColor }]}>
                      I confirm that I have read and accept the terms and conditions and privacy policy.
                    </Text>
                  </>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  li: {
    fontFamily: 'Outfit-Regular',
    fontSize: responsiveFontSize(12),
    lineHeight: responsiveFontSize(18),
    marginBottom: 0,
    padding: 0,
  },
  ul: {
    paddingRight: responsiveWidth(10),
  },

  container: { flex: 1, paddingHorizontal: responsiveWidth(20) },
  // scrollContent: { paddingBottom: verticalScale(100) },
  contentCard: { paddingVertical: responsiveHeight(10), marginBottom: responsiveHeight(20) },
  cardTitle: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: responsiveFontSize(17),
    marginBottom: responsiveHeight(15),
  },
  sectionHeading: {
    fontSize: responsiveFontSize(1),
    fontFamily: 'Outfit-SemiBold',
    marginTop: responsiveHeight(15),
    marginBottom: responsiveHeight(8),
  },
  paragraph: {
    fontSize: responsiveFontSize(12),
    fontFamily: 'Outfit-Regular',
    lineHeight: responsiveFontSize(20),
    marginBottom: responsiveHeight(10),
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: responsiveHeight(100),
  },
  loadingText: {
    marginTop: responsiveHeight(10),
    fontSize: responsiveFontSize(14),
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: responsiveHeight(100),
  },
  errorText: {
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
  },
});

export default TermsAndConditionsScreen;
