
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, SafeAreaView, Platform, Dimensions, Modal, Pressable, ImageBackground } from 'react-native';
import { back, bg, p2 } from '../../../assets/images';
import Header from '../../../components/Header';
import theme from '../../../themes/theme';

const { width, height } = Dimensions.get('window');
const scale = (size) => (width / 375) * size; // assuming 375 is the base width
const verticalScale = (size) => (height / 812) * size; // assuming 812 is the base height
const responsiveWidth = (size) => (width / 375) * size;
const responsiveHeight = (size) => (width / 375) * size;
const responsiveFontSize = (size) => (width / 375) * size;

const ReportProblemScreen = ({ }) => {

  // const mockNavigation = {
  //   navigate: (screenName, params) => console.log(`Navigating to: ${screenName}`, params),
  //   goBack: () => console.log('Going back'),
  // };
  // const currentNavigation = navigation || mockNavigation;

  const [selectedIssueType, setSelectedIssueType] = useState('Select Issue Type');
  const [issueTypeDropdownVisible, setIssueTypeDropdownVisible] = useState(false);
  const [problemDescription, setProblemDescription] = useState('');
  const [deviceInfo, setDeviceInfo] = useState('');
  const [selectedResponseTime, setSelectedResponseTime] = useState('Preferred Response Time');
  const [responseTimeDropdownVisible, setResponseTimeDropdownVisible] = useState(false);

  const issueTypes = [
    'Login or Account issue',
    'Payment & Billing Problem',
    'Trading Plan Issue',
    'App Bug / Crash',
    'Course Not Loading',
    'Other',
  ];

  const responseTimes = [
    'Immediate (within 1 hour)',
    'Within 24 hours',
    'Within 3 days',
    'Flexible',
  ];

  const CustomDropdown = ({ label, selectedValue, options, onSelect, isVisible, toggleVisibility }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleVisibility}>
        <Text style={styles.dropdownButtonText}>{selectedValue}</Text>
        <Image
          source={back}
          style={[
            styles.dropdownArrowIcon,
            isVisible && { transform: [{ rotate: '270deg' }] },
          ]}
        />
      </TouchableOpacity>

      {isVisible &&
        <View style={styles.dropdownModalContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.modalOptionItem}
              onPress={() => {
                onSelect(option);
                toggleVisibility();
              }}
            >
              <Text style={styles.modalOptionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      }
    </View>
  );

  const handleSubmit = () => {
    console.log({
      selectedIssueType,
      problemDescription,
      deviceInfo,
      selectedResponseTime,
    });
    // Implement submission logic
    alert('Problem Reported!');
    currentNavigation.goBack();
  };

  const handleReset = () => {
    setSelectedIssueType('Select Issue Type');
    setProblemDescription('');
    setDeviceInfo('');
    setSelectedResponseTime('Preferred Response Time');
    alert('Form Reset!');
  };

  return (
    <ImageBackground source={bg} style={{ flex: 1, }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <Header title={"Report Problem"}></Header>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Issue Type Dropdown */}
            <CustomDropdown
              label="Issue Type"
              selectedValue={selectedIssueType}
              options={issueTypes}
              onSelect={setSelectedIssueType}
              isVisible={issueTypeDropdownVisible}
              toggleVisibility={() => setIssueTypeDropdownVisible(!issueTypeDropdownVisible)}
            />

            {/* Problem Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Describes the Issue?</Text>
              <TextInput
                style={[styles.textInput, styles.multilineTextInput]}
                placeholder="Start typing..."
                placeholderTextColor="#B0B0B0"
                multiline
                numberOfLines={4}
                value={problemDescription}
                onChangeText={setProblemDescription}
                textAlignVertical="top" // Align text to top for multiline
              />
            </View>

            {/* Device and App Info */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Device and App Info</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Auto-filled (e.g., iPhone 13, iOS 17.5, App v1.0.0)"
                placeholderTextColor="#B0B0B0"
                value={deviceInfo}
                onChangeText={setDeviceInfo}
              />
            </View>

            {/* Preferred Response Time Dropdown */}
            <CustomDropdown
              label="Preferred Response Time"
              selectedValue={selectedResponseTime}
              options={responseTimes}
              onSelect={setSelectedResponseTime}
              isVisible={responseTimeDropdownVisible}
              toggleVisibility={() => setResponseTimeDropdownVisible(!responseTimeDropdownVisible)}
            />

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>

      <View style={styles.absoluteFooter}>
        <View style={styles.footerWrapper}>
          <TouchableOpacity style={styles.profileButton} onPress={() => console.log('Edit Profile')}>
            <Image source={p2} style={styles.profileButtonIcon} />
            <Text style={styles.profileButtonText}>Report a Problem</Text>
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
    paddingHorizontal: responsiveWidth(25),
  },
  scrollContent: {
    paddingBottom: responsiveHeight(120),
  },
  inputGroup: {
    marginBottom: responsiveHeight(20),
  },
  inputLabel: {
    fontSize: responsiveFontSize(12),
    fontFamily: "Inter-Regular",
    color: '#E0E0E0',
    marginBottom: responsiveHeight(5),
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0a1d2e',
    borderRadius: responsiveWidth(10),
    paddingHorizontal: responsiveWidth(15),
    height: responsiveHeight(50),
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 0.9, borderColor: theme.borderColor,
    borderRadius: 8,
  },
  dropdownButtonText: {
    fontSize: responsiveFontSize(12),
    color: '#E0E0E0',
  },
  dropdownArrowIcon: {
    transform: [{ rotate: `90deg` }],
    width: responsiveWidth(13),
    height: responsiveHeight(13),
    resizeMode: 'contain',
    tintColor: '#B0B0B0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModalContainer: {
    backgroundColor: '#0a1d2e',
    width: "100%", // 80% of screen width
    maxHeight: height * 0.5, // Max 50% of screen height
    overflow: 'hidden',
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 0.9, borderColor: theme.borderColor,
    borderRadius: 8,

  },
  modalOptionItem: {
    paddingVertical: responsiveHeight(15),
    paddingHorizontal: responsiveWidth(15),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalOptionText: {
    fontFamily: "Inter-Light-BETA",
    fontSize: responsiveFontSize(12),
    color: '#E0E0E0',
  },
  textInput: {
    backgroundColor: '#0a1d2e',
    borderRadius: responsiveWidth(10),
    paddingHorizontal: responsiveWidth(15),
    color: '#E0E0E0',
    fontSize: responsiveFontSize(12),
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 0.9, borderColor: theme.borderColor,
    borderRadius: 8,
    height: responsiveHeight(50), // Fixed height for single line
  },
  multilineTextInput: {
    height: responsiveHeight(120), // Height for multiline input
    paddingTop: responsiveHeight(10), // Adjust padding for multiline
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: responsiveHeight(10),
  },
  submitButton: {
    width: responsiveWidth(10),
    backgroundColor: theme.primaryColor,
    borderRadius: responsiveWidth(13),
    paddingVertical: responsiveHeight(15),
    alignItems: 'center',
    flex: 1,
    marginRight: responsiveWidth(10),
  },
  submitButtonText: {
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

export default ReportProblemScreen;
