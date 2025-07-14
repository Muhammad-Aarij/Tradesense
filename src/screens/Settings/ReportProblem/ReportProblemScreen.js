import React, { useState, useContext, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image,
  SafeAreaView, Dimensions, ImageBackground
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DeviceInfo from 'react-native-device-info';
import { back, bg, p2, tick } from '../../../assets/images';
import Header from '../../../components/Header';
import { ThemeContext } from '../../../context/ThemeProvider';
import { useDispatch, useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window');
const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;
const responsiveWidth = (size) => (width / 375) * size;
const responsiveHeight = (size) => (width / 375) * size;
const responsiveFontSize = (size) => (width / 375) * size;

import { API_URL } from "@env";
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import axios from 'axios';
import ConfirmationModal from '../../../components/ConfirmationModal';


const ReportProblemScreen = () => {
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { userId } = useSelector(state => state.auth);
  const [selectedIssueType, setSelectedIssueType] = useState('Select Issue Type');
  const [issueTypeDropdownVisible, setIssueTypeDropdownVisible] = useState(false);
  const [problemDescription, setProblemDescription] = useState('');
  const [deviceInfo, setDeviceInfo] = useState('');
  const [selectedResponseTime, setSelectedResponseTime] = useState('Preferred Response Time');
  const [responseTimeDropdownVisible, setResponseTimeDropdownVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('success'); // 'success' or 'error'
  const [modalMessage, setModalMessage] = useState('');

  // Function to get device information
  const getDeviceInfo = async () => {
    try {
      const deviceName = await DeviceInfo.getDeviceName();
      const systemVersion = await DeviceInfo.getSystemVersion();
      const appVersion = await DeviceInfo.getVersion();
      const buildNumber = await DeviceInfo.getBuildNumber();
      
      const deviceInfoString = `${deviceName}, ${DeviceInfo.getSystemName()} ${systemVersion}, App v${appVersion} (${buildNumber})`;
      setDeviceInfo(deviceInfoString);
    } catch (error) {
      console.error('Error fetching device info:', error);
      setDeviceInfo('Device information unavailable');
    }
  };

  // Fetch device info when component mounts
  useEffect(() => {
    getDeviceInfo();
  }, []);

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
      <Text style={[styles.inputLabel, { color: theme.textColor }]}>{label}</Text>
      <LinearGradient
        start={{ x: 0.0, y: 0.95 }}
        end={{ x: 1.0, y: 1.0 }}
        colors={['rgba(0, 0, 0, 0.04)', 'rgba(255, 255, 255, 0)']}
        style={[styles.dropdownButton, { borderColor: theme.borderColor }]}
      >
        <TouchableOpacity
          onPress={toggleVisibility}
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text style={[styles.dropdownButtonText, { color: theme.textColor }]}>{selectedValue}</Text>
          <Image
            source={back}
            style={[styles.dropdownArrowIcon, isVisible && { transform: [{ rotate: '270deg' }] }]}
          />
        </TouchableOpacity>
      </LinearGradient>

      {isVisible && (
        <View style={[styles.dropdownModalContainer, { borderColor: theme.borderColor }]}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.modalOptionItem}
              onPress={() => {
                onSelect(option);
                toggleVisibility();
              }}
            >
              <Text style={[styles.modalOptionText, { color: theme.textColor }]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );


  const handleSubmit = async () => {
    if (selectedIssueType === 'Select Issue Type' || !problemDescription) {
      alert('Please select issue type and provide a description');
      return;
    }

    try {
      dispatch(startLoading());

      const response = await axios.post(`${API_URL}/api/problem`, {
        userId,
        type: selectedIssueType,
        description: problemDescription,
      });

      // Success modal
      setModalType('success');
      setModalMessage('Problem reported successfully!');
      setModalVisible(true);

      // Reset fields
      setSelectedIssueType('Select Issue Type');
      setProblemDescription('');
      setDeviceInfo('');
      setSelectedResponseTime('Preferred Response Time');
    } catch (error) {
      console.error('Report error:', error?.response?.data || error.message || error);

      // Failure modal
      setModalType('error');
      setModalMessage('Something went wrong while reporting the problem.');
      setModalVisible(true);
    } finally {
      dispatch(stopLoading());
    }
  };



  return (
    <ImageBackground source={theme.bg || bg} style={{ flex: 1 }}>
      <ConfirmationModal
        isVisible={modalVisible}
        title={modalType === 'success' ? 'Success' : 'Error'}
        message={modalMessage}
        icon={modalType === 'success' ? tick : back}
        onClose={() => setModalVisible(false)}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Header title={"Report Problem"} />

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <CustomDropdown
              label="Issue Type"
              selectedValue={selectedIssueType}
              options={issueTypes}
              onSelect={setSelectedIssueType}
              isVisible={issueTypeDropdownVisible}
              toggleVisibility={() => setIssueTypeDropdownVisible(!issueTypeDropdownVisible)}
            />

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textColor }]}>Describes the Issue?</Text>
              <LinearGradient
                start={{ x: 0.0, y: 0.95 }}
                end={{ x: 1.0, y: 1.0 }}
                colors={['rgba(0, 0, 0, 0.04)', 'rgba(255, 255, 255, 0)']}
                style={[styles.textInput, styles.multilineTextInput, { borderColor: theme.borderColor }]}
              >
                <TextInput
                  placeholder="Start typing..."
                  placeholderTextColor={theme.placeholderTextColor}
                  multiline
                  numberOfLines={4}
                  value={problemDescription}
                  onChangeText={setProblemDescription}
                  style={{ color: theme.textColor, fontSize: 12, flex: 1, fontFamily: 'Inter-Regular' }}
                  textAlignVertical="top"
                />
              </LinearGradient>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textColor }]}>Device and App Info</Text>
              <LinearGradient
                start={{ x: 0.0, y: 0.95 }}
                end={{ x: 1.0, y: 1.0 }}
                colors={['rgba(0, 0, 0, 0.04)', 'rgba(255, 255, 255, 0)']}
                style={[styles.textInput, { borderColor: theme.borderColor }]}
              >
                <TextInput
                  placeholder="Auto-filled (e.g., iPhone 13, iOS 17.5, App v1.0.0)"
                  placeholderTextColor={theme.placeholderTextColor}
                  value={deviceInfo}
                  onChangeText={setDeviceInfo}
                  style={{ color: theme.textColor, fontSize: 12, flex: 1, fontFamily: 'Inter-Regular' }}
                />
              </LinearGradient>
            </View>

            <CustomDropdown
              label="Preferred Response Time"
              selectedValue={selectedResponseTime}
              options={responseTimes}
              onSelect={setSelectedResponseTime}
              isVisible={responseTimeDropdownVisible}
              toggleVisibility={() => setResponseTimeDropdownVisible(!responseTimeDropdownVisible)}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: theme.primaryColor }]}
                onPress={() => handleSubmit()}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>

      <View style={styles.absoluteFooter}>
        <View style={[styles.footerWrapper, { borderColor: theme.borderColor }]}>
          <LinearGradient
            start={{ x: 0.0, y: 0.95 }}
            end={{ x: 1.0, y: 1.0 }}
            colors={['rgba(0, 0, 0, 0.04)', 'rgba(255, 255, 255, 0)']}
            style={[styles.profileButton, { backgroundColor: theme.primaryColor }]}
          >
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={p2} style={styles.profileButtonIcon} />
              <Text style={styles.profileButtonText}>Report a Problem</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: responsiveWidth(25) },
  scrollContent: { paddingBottom: responsiveHeight(120) },
  inputGroup: { marginBottom: responsiveHeight(20) },
  inputLabel: {
    fontSize: responsiveFontSize(12),
    fontFamily: "Inter-Regular",
    marginBottom: responsiveHeight(5),
  },
  dropdownButton: {
    borderWidth: 0.9,
    borderRadius: 8,
    paddingHorizontal: responsiveWidth(15),
    height: responsiveHeight(50),
    justifyContent: 'center',
  },
  dropdownButtonText: {
    fontSize: responsiveFontSize(12),
    fontFamily: 'Inter-Regular',
  },
  dropdownArrowIcon: {
    transform: [{ rotate: `90deg` }],
    width: responsiveWidth(13),
    height: responsiveHeight(13),
    resizeMode: 'contain',
    tintColor: '#B0B0B0',
  },
  dropdownModalContainer: {
    width: "100%",
    maxHeight: height * 0.5,
    marginTop: 10,
    borderWidth: 0.9,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
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
  },
  textInput: {
    borderWidth: 0.9,
    borderRadius: 8,
    paddingHorizontal: responsiveWidth(15),
    height: responsiveHeight(50),
    justifyContent: 'center',
  },
  multilineTextInput: {
    height: responsiveHeight(120),
    paddingTop: responsiveHeight(10),
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'center',
    marginTop: responsiveHeight(10),
  },
  submitButton: {
    width: responsiveWidth(140),
    borderRadius: responsiveWidth(13),
    paddingVertical: responsiveHeight(15),
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(12),
    fontFamily: "Inter-Medium"
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
    borderWidth: 1,
    borderRadius: scale(102),
    padding: scale(14),
    paddingHorizontal: scale(26),
    justifyContent: 'center',
    flexDirection: 'row',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: scale(120),
    padding: scale(12),
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
