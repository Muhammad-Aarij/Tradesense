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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomInput from '../../../components/CustomInput';
import { bg } from '../../../assets/images';
import Header from '../../../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { submitTradeForm } from '../../../functions/Trades';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../../context/ThemeProvider'; // ✅ import theme context
import LinearGradient from 'react-native-linear-gradient';
import ConfirmationModal from '../../../components/ConfirmationModal';

const CustomPicker = ({ label, selectedValue, onValueChange, items, styles, theme }) => (
  <View style={styles.inputGroup}>
    <Text style={[styles.inputLabel, { color: theme.textColor }]}>{label}</Text>
    <View style={[styles.pickerContainer, { borderColor: theme.borderColor }]}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={[{ fontSize: 12, }, { color: theme.textColor }]}
        itemStyle={[styles.pickerItem, { fontSize: 6, }]}
        dropdownIconColor={theme.textColor}
      >
        {items.map((item, index) => (
          <Picker.Item key={index} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  </View>
);

export default function Acc_FormData() {
  const { theme, isDarkMode } = useContext(ThemeContext); // ✅ use theme
  const styles = useMemo(() => getStyles(theme), [theme]);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  // State
  const [tradeDate, setTradeDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tradeType, setTradeType] = useState('Intraday');
  const [setupName, setSetupName] = useState('Reversal');
  const [direction, setDirection] = useState('Short');
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfitTarget, setTakeProfitTarget] = useState(2);
  const [actualExitPrice, setActualExitPrice] = useState('');
  const [result, setResult] = useState('Profit');
  const [emotionalState, setEmotionalState] = useState('Calm');
  const [reflectionNotes, setReflectionNotes] = useState('');

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const userData = useSelector(state => state.auth);
  const studentId = userData.userObject?._id;

  const tradeTypeOptions = [
    { label: 'Intraday', value: 'Intraday' },
    { label: 'Swing', value: 'Swing' },
    { label: 'Scalp', value: 'Scalp' },
  ];
  const setupNameOptions = [
    { label: 'Reversal', value: 'Reversal' },
    { label: 'Breakout', value: 'Breakout' },
    { label: 'Continuation', value: 'Continuation' },
  ];
  const directionOptions = [
    { label: 'Short', value: 'Short' },
    { label: 'Long', value: 'Long' },
  ];
  const takeProfitTargetOptions = [
    { label: '1x', value: 1 },
    { label: '2x', value: 2 },
    { label: '3x', value: 3 },
  ];
  const resultOptions = [
    { label: 'Profit', value: 'Profit' },
    { label: 'Loss', value: 'Loss' },
    { label: 'Breakeven', value: 'Breakeven' },
  ];
  const emotionalStateOptions = [
    { label: 'Calm', value: 'Calm' },
    { label: 'Excited', value: 'Excited' },
    { label: 'Anxious', value: 'Anxious' },
    { label: 'Frustrated', value: 'Frustrated' },
  ];

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || tradeDate;
    setShowDatePicker(Platform.OS === 'ios');
    setTradeDate(currentDate);
  };

  const handleSubmit = async () => {
    const formData = {
      tradeDate: tradeDate.toISOString().split('T')[0],
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
    };

    console.log('Form Submitted:', formData);
    try {
      dispatch(startLoading());
      const response = await submitTradeForm(formData);
      console.log('Trade submitted successfully:', response);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to submit trade:', error);
      setShowErrorModal(true);
    } finally {
      dispatch(stopLoading());
    }
  };

  return (
    <ImageBackground source={isDarkMode ? bg : null} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Header title="Form Data" />
          <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
            {/* All Inputs */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textColor }]}>Trade Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerInput}>
                <Text style={styles.textInputContent}>{tradeDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  testID="datePicker"
                  value={tradeDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </View>

            <CustomPicker label="Trade Type" selectedValue={tradeType} onValueChange={setTradeType} items={tradeTypeOptions} styles={styles} theme={theme} />
            <CustomPicker label="Setup Name" selectedValue={setupName} onValueChange={setSetupName} items={setupNameOptions} styles={styles} theme={theme} />
            <CustomPicker label="Direction" selectedValue={direction} onValueChange={setDirection} items={directionOptions} styles={styles} theme={theme} />

            <CustomInput label="Entry Price" value={entryPrice} onChangeText={setEntryPrice} keyboardType="numeric" />
            <CustomInput label="Exit Price" value={exitPrice} onChangeText={setExitPrice} keyboardType="numeric" />
            <CustomInput label="Quantity" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
            <CustomInput label="Stop Loss" value={stopLoss} onChangeText={setStopLoss} keyboardType="numeric" />
            <CustomPicker label="Take Profit Target" selectedValue={takeProfitTarget} onValueChange={setTakeProfitTarget} items={takeProfitTargetOptions} styles={styles} theme={theme} />
            <CustomInput label="Actual Exit Price" value={actualExitPrice} onChangeText={setActualExitPrice} keyboardType="numeric" />
            <CustomPicker label="Result" selectedValue={result} onValueChange={setResult} items={resultOptions} styles={styles} theme={theme} />
            <CustomPicker label="Emotional State" selectedValue={emotionalState} onValueChange={setEmotionalState} items={emotionalStateOptions} styles={styles} theme={theme} />
            <CustomInput label="Reflection Notes" value={reflectionNotes} onChangeText={setReflectionNotes} placeholder="What happened..." isMultiline={true} />

            <LinearGradient
              start={{ x: 0, y: 0.95 }}
              end={{ x: 1, y: 1 }}
              colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}>

              <TouchableOpacity style={styles.uploadButton} onPress={() => console.log('Upload chart pressed')}>
                <Text style={styles.uploadButtonIcon}>☁️</Text>
                <Text style={styles.uploadButtonText}>Upload chart image or screenshot</Text>
              </TouchableOpacity>
            </LinearGradient>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {(showSuccessModal || showErrorModal) && <ConfirmationModal
        visible={showSuccessModal || showErrorModal}
        title={showSuccessModal ? 'Success' : 'Error'}
        message={
          showSuccessModal
            ? '✅ Trade submitted successfully!'
            : '❌ Failed to submit trade.'
        }
        icon={showSuccessModal ? '✅' : '❌'}
        onClose={() => {
          if (showSuccessModal) {
            setShowSuccessModal(false);
            navigation.goBack(); // Adjust screen name as needed
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
    formContainer: { paddingBottom: 40 },
    inputGroup: { marginBottom: 15 },
    inputLabel: {
      fontFamily: 'Inter-Medium',
      fontSize: 13,
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
      overflow: 'hidden',
    },
    picker: {
      height: 55,
      color: '#fff',
      fontFamily: 'Inter-Regular',
      fontSize: 10,
    },
    pickerItem: { color: '#fff' },
    uploadButton: {
      backgroundColor: 'rgba(255,255,255,0.06)',
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 8,
      paddingHorizontal: 15,
      paddingVertical: 35,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
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
  });
