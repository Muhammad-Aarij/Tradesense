import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
  Dimensions, ImageBackground, ActivityIndicator
} from 'react-native';
import { useDispatch } from 'react-redux';
import Header from '../../../components/Header';
import { bg } from '../../../assets/images';
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

  const parseHtmlContent = (htmlString) => {
    if (!htmlString) return null;

    const elements = [];
    const paragraphs = htmlString.split(/<\/?p>/).filter(Boolean);

    paragraphs.forEach((p, index) => {
      if (p.includes('<h1>')) {
        const h1 = p.match(/<h1>(.*?)<\/h1>/)?.[1];
        if (h1) elements.push(<Text key={`h1-${index}`} style={[styles.sectionHeading, { color: theme.textColor }]}>{h1}</Text>);
        const rest = p.replace(/<h1>.*?<\/h1>/, '').trim();
        if (rest) elements.push(<Text key={`h1-rest-${index}`} style={[styles.paragraph, { color: theme.textColor }]}>{rest}</Text>);
      } else if (p.includes('<h2>')) {
        const h2 = p.match(/<h2>(.*?)<\/h2>/)?.[1];
        if (h2) elements.push(<Text key={`h2-${index}`} style={[styles.sectionHeading, { color: theme.textColor }]}>{h2}</Text>);
        const rest = p.replace(/<h2>.*?<\/h2>/, '').trim();
        if (rest) elements.push(<Text key={`h2-rest-${index}`} style={[styles.paragraph, { color: theme.textColor }]}>{rest}</Text>);
      } else if (p.includes('<ul>') || p.includes('<li>')) {
        const items = p.split(/<\/?li>/).filter(Boolean).map((item, liIdx) => {
          const clean = item.replace(/<\/?ul>/g, '').trim();
          return clean ? <Text key={`li-${index}-${liIdx}`} style={[styles.listItem, { color: theme.textColor }]}>• {clean}</Text> : null;
        });
        elements.push(...items);
      } else {
        const clean = p.replace(/<\/?(strong|em|a|br|div)>/g, '').replace(/&nbsp;/g, ' ').trim();
        if (clean) elements.push(<Text key={`p-${index}`} style={[styles.paragraph, { color: theme.textColor }]}>{clean}</Text>);
      }
    });

    return elements;
  };

  return (
    <ImageBackground source={theme.bg} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Header title="Terms and Conditions" navigation={navigation} />

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {!termsData && !error ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primaryColor} />
                <Text style={[styles.loadingText, { color: theme.textColor }]}>Loading Terms...</Text>
              </View>
            ) : error ? (
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
                {parseHtmlContent(termsData?.content)}

                {!termsData?.content?.includes('I confirm that I have read and accept') && (
                  <>
                    <Text style={[styles.sectionHeading, { color: theme.textColor }]}>
                      5. DISCLAIMER OF WARRANTIES AND LIMITATION OF LIABILITY
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
  container: { flex: 1, paddingHorizontal: responsiveWidth(20) },
  scrollContent: { paddingBottom: verticalScale(100) },
  contentCard: { paddingVertical: responsiveHeight(10), marginBottom: responsiveHeight(20) },
  cardTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(15),
  },
  sectionHeading: {
    fontSize: responsiveFontSize(13),
    fontFamily: 'Inter-SemiBold',
    marginTop: responsiveHeight(15),
    marginBottom: responsiveHeight(8),
  },
  paragraph: {
    fontSize: responsiveFontSize(12),
    fontFamily: 'Inter-Regular',
    lineHeight: responsiveFontSize(20),
    marginBottom: responsiveHeight(10),
  },
  listItem: {
    fontSize: responsiveFontSize(12),
    fontFamily: 'Inter-Thin-BETA',
    lineHeight: responsiveFontSize(20),
    marginLeft: responsiveWidth(10),
    marginBottom: responsiveHeight(5),
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
    fontWeight: 'bold',
  },
});

export default TermsAndConditionsScreen;
