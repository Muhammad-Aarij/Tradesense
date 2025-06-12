import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomInput from '../../../components/CustomInput';
import { bg } from '../../../assets/images';
import Header from '../../../components/Header';
import theme from '../../../themes/theme';
// CustomPicker Component for consistent styling
const CustomPicker = ({ label, selectedValue, onValueChange, items }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
        itemStyle={styles.pickerItem} // Apply style to picker items
        dropdownIconColor="#FFF" // Set dropdown arrow color
      >
        {items.map((item, index) => (
          <Picker.Item style={styles.picker} key={index} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  </View>
);

export default function Acc_FormData() {
  // State variables for form fields
  const [tradeDate, setTradeDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [setupName, setSetupName] = useState('Reversal');
  const [direction, setDirection] = useState('Short');
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfitTarget, setTakeProfitTarget] = useState('2x');
  const [actualExitPrice, setActualExitPrice] = useState('');
  const [result, setResult] = useState('Profit');
  const [emotionalState, setEmotionalState] = useState('Calm');
  const [reflectionNotes, setReflectionNotes] = useState('');

  // Dummy data for pickers
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
    { label: '1x', value: '1x' },
    { label: '2x', value: '2x' },
    { label: '3x', value: '3x' },
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

  // Date picker handlers
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || tradeDate;
    setShowDatePicker(Platform.OS === 'ios'); // On iOS, keep showing until done button is pressed if you had one.
    setTradeDate(currentDate);
  };

  const handleDatePress = () => {
    setShowDatePicker(true);
  };

  // Submit handler
  const handleSubmit = () => {
    const formData = {
      tradeDate: tradeDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      setupName,
      direction,
      entryPrice: parseFloat(entryPrice),
      exitPrice: parseFloat(exitPrice),
      quantity: parseInt(quantity),
      stopLoss: parseFloat(stopLoss),
      takeProfitTarget,
      actualExitPrice: parseFloat(actualExitPrice),
      result,
      emotionalState,
      reflectionNotes,
    };
    console.log('Form Submitted:', formData);
    // Here you would typically send this data to a server or save it locally.
  };

  return (
    <ImageBackground source={bg} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <Header title={"Form Data"} />

          <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
            {/* Trade Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Trade Date</Text>
              <TouchableOpacity onPress={handleDatePress} style={styles.datePickerInput}>
                <Text style={styles.textInputContent}>{tradeDate.toLocaleDateString()}</Text>
                {/* Dropdown arrow placeholder */}
                {/* <Text style={styles.dropdownArrow}>V</Text> */}
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

            {/* Setup Name Picker */}
            <CustomPicker
              label="Setup Name"
              selectedValue={setupName}
              onValueChange={(itemValue) => setSetupName(itemValue)}
              items={setupNameOptions}
            />

            {/* Direction Picker */}
            <CustomPicker
              label="Direction"
              selectedValue={direction}
              onValueChange={(itemValue) => setDirection(itemValue)}
              items={directionOptions}
            />

            {/* Entry Price */}
            <CustomInput
              label="Entry Price"
              value={entryPrice}
              onChangeText={setEntryPrice}
              keyboardType="numeric"
            />

            {/* Exit Price */}
            <CustomInput
              label="Exit Price"
              value={exitPrice}
              onChangeText={setExitPrice}
              keyboardType="numeric"
            />

            {/* Quantity */}
            <CustomInput
              label="Quantity"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />

            {/* Stop Loss */}
            <CustomInput
              label="Stop Loss"
              value={stopLoss}
              onChangeText={setStopLoss}
              keyboardType="numeric"
            />

            {/* Take Profit Target Picker */}
            <CustomPicker
              label="Take Profit Target"
              selectedValue={takeProfitTarget}
              onValueChange={(itemValue) => setTakeProfitTarget(itemValue)}
              items={takeProfitTargetOptions}
            />

            {/* Actual Exit Price */}
            <CustomInput
              label="Actual Exit Price"
              value={actualExitPrice}
              onChangeText={setActualExitPrice}
              keyboardType="numeric"
            />

            {/* Result Picker */}
            <CustomPicker
              label="Result"
              selectedValue={result}
              onValueChange={(itemValue) => setResult(itemValue)}
              items={resultOptions}
            />

            {/* Emotional State Picker */}
            <CustomPicker
              label="Emotional State"
              selectedValue={emotionalState}
              onValueChange={(itemValue) => setEmotionalState(itemValue)}
              items={emotionalStateOptions}
            />

            {/* Reflection Notes */}
            <CustomInput
              label="Reflection Notes"
              value={reflectionNotes}
              onChangeText={setReflectionNotes}
              placeholder="What happened..."
              isMultiline={true}
            />

            {/* Attach Charts */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Attach Charts</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={() => console.log('Upload chart pressed')}>
                <Text style={styles.uploadButtonIcon}>☁️</Text>
                <Text style={styles.uploadButtonText}>Upload chart image or screenshot</Text>
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    paddingVertical: 0
  },
  formContainer: {
    // paddingHorizontal: 20,
    paddingBottom: 40, // Add padding at the bottom for scrolling
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 13,
    color: "#fff",
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: '#1C1C1C', // Darker background for input fields
    borderRadius: 10,
    color: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#fff',
    fontFamily: "Inter-Regular",
    paddingVertical: 15,
    fontSize: 13,
  },
  multilineInput: {
    height: 100, // Fixed height for multiline input
    textAlignVertical: 'top', // Align text to the top
  },
  datePickerInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 0.9, borderColor: theme.borderColor,
    borderRadius: 8,
    paddingHorizontal: 15,
    // paddingVertical: 4,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInputContent: {
    color: '#fff',
    fontFamily: "Inter-Regular",
    paddingVertical: 15,
    fontSize: 13,
  },
  pickerTxt: {
    fontFamily: "Inter-Medium",
    fontSize: 13,
    color: "#fff",
    marginBottom: 5,
  },
  dropdownArrow: {
    color: '#FFF',
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 0.9, borderColor: theme.borderColor,
    borderRadius: 8,
    paddingHorizontal: 15,

    overflow: 'hidden', // Ensures picker content stays within bounds
  },
  picker: {
    height: 55,
    color: '#fff',
    fontFamily: "Inter-Regular",
    paddingVertical: 15,
    fontSize: 10,

  },
  pickerItem: {
    color: '#FFF', // Ensure picker items are white on iOS
  },
  uploadButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 0.9, borderColor: theme.borderColor,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333', // Slightly lighter border
  },
  uploadButtonIcon: {
    fontSize: 20,
    color: '#FFF',
    marginRight: 10,
  },
  uploadButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '500',
    fontFamily: "Inter-Regular",

  },
  submitButton: {
    backgroundColor: theme.primaryColor,
    width: '100%',
    padding: 15,
    borderRadius: 14,
    marginTop: 20,
    alignItems: 'center'
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: "Inter-SemiBold",
  },
});
