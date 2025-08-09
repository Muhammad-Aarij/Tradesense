import React, { useState, useContext } from "react";
import {
  SafeAreaView, StyleSheet, View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, ImageBackground, Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomInput from "../../../components/CustomInput";
import { bg, calendar, tick } from "../../../assets/images";
import Header from "../../../components/Header";
import { ThemeContext } from '../../../context/ThemeProvider';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmationModal from "../../../components/ConfirmationModal";
import { startLoading, stopLoading } from "../../../redux/slice/loaderSlice";
import CustomDropdown from "../../../components/CustomSelector";
import { useQueryClient } from '@tanstack/react-query';
import { postHabit, updateHabit } from "../../../functions/habbitFunctions";
import SnackbarMessage from "../../../functions/SnackbarMessage";

export default function AddGoal({ route, navigation }) {
  const [goalName, setGoalName] = useState("");
  const [goalType, setGoalType] = useState("Daily");
  const [status, setStatus] = useState("Active");
  const [targetDate, setTargetDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const queryClient = useQueryClient();
  const { theme } = useContext(ThemeContext); // Use the theme context
  const [activeDropdown, setActiveDropdown] = useState(null); // 'goalType' or 'status'
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'error' });

  const userId = useSelector((state) => state.auth.userId);
  const dispatch = useDispatch();
  // const route = useRoute();
  const editingGoal = route.params?.goal;

  // Picker options
  const goalTypeOptions = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
  ];

  const statusOptions = [
    // { label: "Active", value: "active" },
    // { label: "Completed", value: "completed" },
    { label: "Pending", value: "pending" },
    { label: "Active", value: "active" },
  ];

  // Date picker handlers
  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === 'ios') {
      // On iOS, the picker stays visible until user taps "Done"
      if (event.type === 'dismissed') {
        setShowDatePicker(false);
      } else {
        setTargetDate(selectedDate || targetDate);
      }
    } else {
      // On Android, hide the picker after selection
      setShowDatePicker(false);
      if (selectedDate) {
        setTargetDate(selectedDate);
      }
    }
  };

  const handleDatePress = () => {
    if (showDatePicker) {
      // If picker is already open, close it
      setShowDatePicker(false);
    } else {
      // If picker is closed, open it
      setShowDatePicker(true);
    }
  };

  const styles = getStyles(theme); // Generate themed styles

  const handleSubmit = async () => {
    if (!goalName.trim()) {
      return setSnackbar({ visible: true, message: 'Please enter a goal name.', type: 'error' });
    }
    if (!goalType) {
      return setSnackbar({ visible: true, message: 'Please select a goal type.', type: 'error' });
    }
    if (!status) {
      return setSnackbar({ visible: true, message: 'Please select a status.', type: 'error' });
    }
    if (!description.trim()) {
      return setSnackbar({ visible: true, message: 'Please enter a description.', type: 'error' });
    }
    if (!targetDate) {
      return setSnackbar({ visible: true, message: 'Please select a target date.', type: 'error' });
    }

    dispatch(startLoading());

    const formData = {
      userId,
      title: goalName,
      status: status.toLowerCase(),
      description,
      type: goalType.toLowerCase(),
      targetDate: targetDate.toISOString().split('T')[0],
    };

    let result;

    if (editingGoal) {
      result = await updateHabit(editingGoal._id, formData);
    } else {
      result = await postHabit(formData);
    }

    dispatch(stopLoading());

    if (result.error) {
      setSnackbar({ visible: true, message: 'Something went wrong. Please try again.', type: 'error' });
    } else {
      setShowConfirmationModal(true);
      queryClient.invalidateQueries(['goals', userId]);
    }
  };


  React.useEffect(() => {
    if (snackbar.visible) {
      const timer = setTimeout(() => {
        setSnackbar({ ...snackbar, visible: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar]);


  React.useEffect(() => {
    console.log(" useeffect Editing Goal:", editingGoal);
    if (editingGoal) {
      setGoalName(editingGoal.title || "");
      setGoalType(capitalizeFirst(editingGoal.type || "Daily"));
      setStatus(capitalizeFirst(editingGoal.status || "Active"));
      setDescription(editingGoal.description || "");
      if (editingGoal.targetDate) {
        setTargetDate(new Date(editingGoal.targetDate));
      }
    }
  }, [editingGoal]);

  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);


  return (
    <ImageBackground source={theme.bg} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <SnackbarMessage
          visible={snackbar.visible}
          message={snackbar.message}
          type={snackbar.type}
        // Auto-hide after 3s
        />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          {/* Header */}
          <Header title={editingGoal ? "Edit Goal" : "Add New Goal"} style={{ marginBottom: 35 }} />

          <ScrollView 
            contentContainerStyle={styles.formContainer} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="Outfitactive"
            automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
          >
            {/* Goal Name */}
            <CustomInput
              label="Goal Name"
              value={goalName}
              onChangeText={setGoalName}
              placeholder="Enter your goal name..."
            />

            {/* Target Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Target Date</Text>
              <TouchableOpacity onPress={handleDatePress} style={styles.datePickerInput}>
                <Text style={styles.textInputContent}>{targetDate.toLocaleDateString()}</Text>
                <Image style={{ width: 20, height: 20, tintColor: theme.subTextColor }} source={calendar} />
              </TouchableOpacity>
              {showDatePicker && (
                <>
                  <DateTimePicker 
                    testID="datePicker" 
                    minimumDate={new Date()}
                    value={targetDate} 
                    mode="date" 
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'} 
                    onChange={onDateChange}
                    textColor={theme.textColor}
                    accentColor={theme.primaryColor}
                    themeVariant="dark"
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

            <CustomDropdown
              label="Goal Type"
              options={goalTypeOptions.map((item) => item.label)}
              selectedValue={goalType}
              onValueChange={setGoalType}
              dropdownId="goalType"
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            />

            <CustomDropdown
              label="Status"
              options={statusOptions.map((item) => item.label)}
              selectedValue={status}
              onValueChange={setStatus}
              dropdownId="status"
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            />

            {/* Description */}
            <CustomInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Add more details..."
              isMultiline={true}
            />

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>{editingGoal ? "Edit" : "Submit"}</Text>
            </TouchableOpacity>
          </ScrollView>
          {showConfirmationModal && (
            <ConfirmationModal
              title={editingGoal ? "Goal Updated!" : "Goal Added!"}
              message={
                editingGoal
                  ? "Your goal has been updated successfully."
                  : "Your goal has been added successfully."
              }
              icon={tick}
              onClose={() => {
                setShowConfirmationModal(false);
                navigation.goBack()
              }}
            />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}


const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    padding: 25,

  },
  formContainer: {
    paddingBottom: 100, // Add extra padding to ensure content is not hidden behind keyboard
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontFamily: "Outfit-Medium",
    fontSize: 12,
    color: theme.textColor,
    marginBottom: 5,
  },
  pickerTxt: {
    fontFamily: "Outfit-Medium",
    fontSize: 13,
    color: "#fff",
    marginBottom: 5,
  },
  datePickerInput: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 0.9,
    borderColor: theme.borderColor,
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textInputContent: {
    color: theme.subTextColor,
    fontFamily: "Outfit-Regular",
    paddingVertical: 15,
    fontSize: 13,
  },
  pickerContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 0.9,
    borderColor: theme.borderColor,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  picker: {
    height: 55,
    color: "#fff",
    fontFamily: "Outfit-Light-BETA",
    paddingVertical: 15,
    fontSize: 10,

  },
  submitButton: {
    backgroundColor: theme.primaryColor,
    width: "100%",
    padding: 15,
    borderRadius: 14,
    marginTop: 50,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    fontFamily: "Outfit-SemiBold",
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
    fontFamily: "Outfit-Medium",
    fontWeight: "600",
  },
});

