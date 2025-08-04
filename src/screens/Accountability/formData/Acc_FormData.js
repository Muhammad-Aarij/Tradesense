import React, { useState, useContext, useMemo } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Modal,
  Alert,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import CustomInput from '../../../components/CustomInput';
import { bg, fail, tick } from '../../../assets/images';
import Header from '../../../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { submitTradeForm, useSubmitTrade } from '../../../functions/Trades';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../../context/ThemeProvider';
import LinearGradient from 'react-native-linear-gradient';
import ConfirmationModal from '../../../components/ConfirmationModal';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import { API_URL } from "@env";


const API_BASE_URL = API_URL;

const CustomPicker = ({ label, selectedValue, onValueChange, items, styles, theme, isDarkMode }) => {
  const [showPicker, setShowPicker] = useState(false);
  const selectedItem = items.find(item => item.value === selectedValue);

  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: theme.textColor }]}>{label}</Text>
      <TouchableOpacity
        style={[styles.pickerContainer, { borderColor: theme.borderColor }]}
        onPress={() => setShowPicker(true)}
      >
        <Text style={[styles.pickerText, { color: theme.textColor }]}>
          {selectedItem ? selectedItem.label : 'Select an option'}
        </Text>
        <Text style={[styles.pickerArrow, { color: theme.textColor }]}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.pickerModal, { backgroundColor: isDarkMode ? '#000000' : '#FFFFFF' }]}>
            <View style={styles.pickerHeader}>
              <Text style={[styles.pickerHeaderText, { color: theme.textColor }]}>{label}</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Text style={[styles.pickerDoneButton, { color: theme.primaryColor }]}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pickerOptionsContainer}>
              {items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.pickerOption,
                    selectedValue === item.value && styles.pickerOptionSelected
                  ]}
                  onPress={() => {
                    onValueChange(item.value);
                    setShowPicker(false);
                  }}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    { color: selectedValue === item.value ? theme.primaryColor : theme.textColor }
                  ]}>
                    {item.label}
                  </Text>
                  {selectedValue === item.value && (
                    <Text style={[styles.pickerCheckmark, { color: theme.primaryColor }]}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default function Acc_FormData({ route }) {
  const { theme, isDarkMode } = useContext(ThemeContext);
  const styles = useMemo(() => getStyles(theme), [theme]);
  const { emotion } = route.params || {};
  console.log("Emotion", emotion);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // State for form fields
  const [tradeDate, setTradeDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tradeType, setTradeType] = useState('Intraday');
  const [setupName, setSetupName] = useState('Reversal');
  const [direction, setDirection] = useState('Short');
  const [stock, setStock] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfitTarget, setTakeProfitTarget] = useState(2);
  const [actualExitPrice, setActualExitPrice] = useState('');
  const [result, setResult] = useState('Profit');
  const [emotionalState, setEmotionalState] = useState(emotion || 'Calm');
  const [reflectionNotes, setReflectionNotes] = useState('');

  // State for file uploads
  const [imageFile, setImageFile] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [uploading, setUploading] = useState(false); // To manage loading state during upload

  // State for modals
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const userData = useSelector(state => state.auth);
  const studentId = userData.userObject?._id;

  const tradeTypeOptions = [
    { label: 'Intra', value: 'intra' },
    { label: 'Swing', value: 'swing' },
    { label: 'Scalp', value: 'scalp' },
  ];

  const directionOptions = [
    { label: 'Buy', value: 'buy' },
    { label: 'Sell', value: 'sell' },
  ];
  const resultOptions = [
    { label: 'Profit', value: 'Profit' },
    { label: 'Loss', value: 'Loss' },
    { label: 'Breakeven', value: 'Breakeven' },
  ];
  const emotionalStateOptions = [
    { label: 'Good', value: 'Good' },
    { label: 'Cool', value: 'Cool' },
    { label: 'Happy', value: 'Happy' },
    { label: 'Sad', value: 'Sad' },
    { label: 'Angry', value: 'Angry' },
  ];

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === 'ios') {
      // On iOS, the picker stays visible until user taps "Done"
      if (event.type === 'dismissed') {
        setShowDatePicker(false);
      } else {
        setTradeDate(selectedDate || tradeDate);
      }
    } else {
      // On Android, hide the picker after selection
      setShowDatePicker(false);
      if (selectedDate) {
        setTradeDate(selectedDate);
      }
    }
  };

  const { mutate: submitTrade } = useSubmitTrade(studentId);

  const pickImage = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      setImageFile(res);
      console.log('Image picked:', res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled image picker');
      } else {
        console.error('Error picking image:', err);
        Alert.alert('Error', 'Failed to pick image.');
      }
    }
  };

  const pickCsv = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles], // You might want to specify DocumentPicker.types.csv if available
      });
      setCsvFile(res);
      console.log('CSV picked:', res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled CSV picker');
      } else {
        console.error('Error picking CSV:', err);
        Alert.alert('Error', 'Failed to pick CSV.');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      dispatch(startLoading()); // Start global loading indicator
      setUploading(true); // Set local uploading indicator

      // let imageUrl = '';
      // if (imageFile) {
      //   const formData = new FormData();
      //   formData.append('file', {
      //     uri: imageFile.uri,
      //     name: imageFile.name,
      //     type: imageFile.type,
      //   });

      //   console.log('Uploading image...');
      //   const imageRes = await axios.post(`${API_BASE_URL}/upload/image`, formData, {
      //     headers: { 'Content-Type': 'multipart/form-data' },
      //   });
      //   imageUrl = imageRes?.data?.url || '';
      //   console.log('Image upload response:', imageRes.data);
      // }

      // let csvUrl = '';
      // if (csvFile) {
      //   const formData = new FormData();
      //   formData.append('file', {
      //     uri: csvFile.uri,
      //     name: csvFile.name,
      //     type: csvFile.type,
      //   });

      //   console.log('Uploading CSV...');
      //   const csvRes = await axios.post(`${API_BASE_URL}/upload/csv`, formData, {
      //     headers: { 'Content-Type': 'multipart-data' },
      //   });
      //   csvUrl = csvRes?.data?.url || '';
      //   console.log('CSV upload response:', csvRes.data);
      // }

      // Prepare the main trade form data
      const tradeFormData = {
        tradeDate: tradeDate.toISOString().split('T')[0],
        stockName: stock,
        userId: studentId,
        tradeType,
        setupName,
        direction,
        entryPrice: parseFloat(entryPrice),
        exitPrice: parseFloat(exitPrice),
        quantity: parseInt(quantity),
        stopLoss: parseFloat(stopLoss),
        takeProfitTarget: Number(takeProfitTarget),
        actualExitPrice: parseFloat(actualExitPrice),
        result,
        emotionalState,
        notes: reflectionNotes,
        // chartImageUrl: imageUrl
        // csvDocumentUrl: csvUrl,    
      };

      console.log('Form Submitted with files:', tradeFormData);
      const response = await submitTrade(tradeFormData); // Use the useSubmitTrade mutation
      console.log('Trade submitted successfully:', response);
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Failed to submit trade:', error);
      setShowErrorModal(true);
      // More detailed error handling
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data || error.message);
        Alert.alert('Submission Error', error.response?.data?.message || 'Failed to submit trade due to a network error.');
      } else {
        Alert.alert('Submission Error', 'An unexpected error occurred while submitting the trade.');
      }
    } finally {
      dispatch(stopLoading()); // Stop global loading indicator
      setUploading(false); // Stop local uploading indicator
    }
  };

  return (
    <ImageBackground source={isDarkMode ? bg : null} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={styles.formContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
          >
            <Header title="Form Data" />
            {/* All Inputs */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textColor }]}>Trade Date</Text>
              <TouchableOpacity onPress={() => {
                if (showDatePicker) {
                  // If picker is already open, close it
                  setShowDatePicker(false);
                } else {
                  // If picker is closed, open it
                  setShowDatePicker(true);
                }
              }} style={styles.datePickerInput}>
                <Text style={styles.textInputContent}>{tradeDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <>
                  <DateTimePicker
                    testID="datePicker"
                    value={tradeDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                  />
                  {Platform.OS === 'ios' && (
                    <View style={styles.iosPickerButtons}>
                      <TouchableOpacity
                        style={styles.iosPickerButton}
                        onPress={() => setShowDatePicker(false)}
                      >
                        <Text style={[styles.iosPickerButtonText, { color: theme.primaryColor }]}>Done</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </View>

            <CustomInput label="Product Name"
              placeholder={"Enter Product Name"}
              value={stock} onChangeText={setStock} />
            <CustomPicker label="Trade Type" selectedValue={tradeType} onValueChange={setTradeType} items={tradeTypeOptions} styles={styles} theme={theme} isDarkMode={isDarkMode} />
            <CustomInput
              label="Setup Name"
              placeholder={"Enter Trade Setup Name"}
              value={setupName}
              onChangeText={setSetupName}
            />
            <CustomPicker label="Direction" selectedValue={direction} onValueChange={setDirection} items={directionOptions} styles={styles} theme={theme} isDarkMode={isDarkMode} />

            <CustomInput label="Entry Price" placeholder={"Enter Entry Price"} value={entryPrice} onChangeText={setEntryPrice} keyboardType="numeric" />
            <CustomInput label="Exit Price" placeholder={"Enter Exit Price"} value={exitPrice} onChangeText={setExitPrice} keyboardType="numeric" />
            <CustomInput label="Quantity" placeholder={"Enter Trade Quantity"} value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
            <CustomInput label="Stop Loss" placeholder={"Stop Loss"} value={stopLoss} onChangeText={setStopLoss} keyboardType="numeric" />
            <CustomInput
              label="Take Profit "
              keyboardType="numeric"
              value={String(takeProfitTarget)}
              onChangeText={(text) => setTakeProfitTarget((text))}
            />
            <CustomInput label="Actual Exit Price" placeholder={"Enter Actual Exit Price"} value={actualExitPrice} onChangeText={setActualExitPrice} keyboardType="numeric" />
            {/* <CustomPicker label="Result" selectedValue={result} onValueChange={setResult} items={resultOptions} styles={styles} theme={theme} /> */}
            <CustomPicker label="Emotional State" selectedValue={emotionalState} onValueChange={setEmotionalState} items={emotionalStateOptions} styles={styles} theme={theme} isDarkMode={isDarkMode} />
            <CustomInput label="Reflection Notes" value={reflectionNotes} onChangeText={setReflectionNotes} placeholder="What happened..." isMultiline={true} />
            {/* 
            <LinearGradient
              start={{ x: 0, y: 0.95 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 8,
              }}
              colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}>

              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.uploadButtonIcon}>☁️</Text>
                <Text style={styles.uploadButtonText}>Upload chart image or screenshot</Text>
                {imageFile && <Text style={{ color: theme.subTextColor, marginLeft: 10 }}>{imageFile.name}</Text>}
              </TouchableOpacity>
            </LinearGradient>

            <View style={{ height: 15, }} />

            <LinearGradient
              start={{ x: 0, y: 0.95 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 8,
              }}
              colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}>
              <TouchableOpacity style={styles.uploadButton} onPress={pickCsv}>
                <View>
                  <Text style={styles.uploadButtonIcon}>📄</Text>
                  <Text style={styles.uploadButtonText}>Upload CSV file</Text>
                </View>
                {csvFile && <Text style={{ color: theme.subTextColor, marginLeft: 10 }}>{csvFile.name}</Text>}
              </TouchableOpacity>
            </LinearGradient> */}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={uploading}>
              <Text style={styles.submitButtonText}>{uploading ? 'Uploading...' : 'Submit'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {(showSuccessModal || showErrorModal) &&
        <ConfirmationModal
          visible={showSuccessModal || showErrorModal}
          title={showSuccessModal ? 'Success' : 'Error'}
          message={
            showSuccessModal
              ? 'Trade submitted successfully!'
              : ' Failed to submit trade.'
          }
          icon={showSuccessModal ? tick : fail}
          onClose={() => {
            if (showSuccessModal) {
              setShowSuccessModal(false);
              navigation.goBack();
            } else {
              setShowErrorModal(false);
            }
          }}
        />}

    </ImageBackground>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: { flex: 1, padding: 25, paddingVertical: 0 },
    formContainer: { paddingBottom: 100 }, // Add extra padding to ensure content is not hidden behind keyboard
    inputGroup: { marginBottom: 15 },
    inputLabel: {
      fontFamily: 'Inter-Medium',
      fontSize: 12,
      color: '#fff',
      marginBottom: 5,
    },
    datePickerInput: {
      backgroundColor: 'rgba(255,255,255,0.06)',
      borderWidth: 0.9,
      borderColor: theme.borderColor,
      borderRadius: 8,
      paddingHorizontal: 15,
      height: 60,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    textInputContent: {
      color: theme.subTextColor,
      fontFamily: 'Inter-Medium',
      fontSize: 13,
      paddingVertical: 15,
    },
    pickerContainer: {
      backgroundColor: 'rgba(255,255,255,0.06)',
      borderWidth: 0.9,
      borderColor: theme.borderColor,
      borderRadius: 8,
      paddingHorizontal: 15,
      height: 55,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    pickerText: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      flex: 1,
    },
    pickerArrow: {
      fontSize: 12,
      marginLeft: 10,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    pickerModal: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 30,
      maxHeight: '70%',
    },
    pickerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    pickerHeaderText: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      fontWeight: '600',
    },
    pickerDoneButton: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      fontWeight: '600',
    },
    pickerOptionsContainer: {
      paddingVertical: 10,
    },
    pickerOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    pickerOptionSelected: {
      backgroundColor: 'rgba(255,255,255,0.05)',
    },
    pickerOptionText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
    },
    pickerCheckmark: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
    },
    uploadButton: {
      backgroundColor: 'rgba(255,255,255,0.06)',
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 8,
      flexDirection: "column",
      paddingHorizontal: 15,
      paddingVertical: 35,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: "hidden",
    },
    uploadButtonIcon: { fontSize: 20, color: theme.textColor, marginRight: 10 },
    uploadButtonText: {
      color: theme.textColor,
      fontSize: 13,
      fontWeight: '500',
      fontFamily: 'Inter-Regular',
    },
    submitButton: {
      backgroundColor: theme.primaryColor,
      width: '100%',
      padding: 15,
      borderRadius: 14,
      marginTop: 20,
      alignItems: 'center',
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 17,
      fontWeight: '600',
      fontFamily: 'Inter-SemiBold',
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#222',
      padding: 25,
      borderRadius: 15,
      width: '80%',
      alignItems: 'center',
    },
    modalText: {
      color: '#fff',
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      marginBottom: 15,
      textAlign: 'center',
    },
    modalButton: {
      backgroundColor: theme.primaryColor,
      paddingVertical: 10,
      paddingHorizontal: 25,
      borderRadius: 8,
    },
    modalButtonText: {
      color: '#fff',
      fontSize: 15,
      fontFamily: 'Inter-SemiBold',
    },
    iosPickerButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: 15,
      paddingVertical: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      borderLeftWidth: 0.9,
      borderRightWidth: 0.9,
      borderBottomWidth: 0.9,
      borderColor: theme.borderColor,
    },
    iosPickerButton: {
      paddingHorizontal: 15,
      paddingVertical: 8,
    },
    iosPickerButtonText: {
      fontSize: 16,
      fontFamily: "Inter-Medium",
      fontWeight: "600",
    },
  });