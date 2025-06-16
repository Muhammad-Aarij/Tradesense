import React, { useState } from "react";
import {
  SafeAreaView, StyleSheet, View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, ImageBackground, Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomInput from "../../../components/CustomInput";
import { bg, calendar, tick } from "../../../assets/images";
import Header from "../../../components/Header";
import theme from "../../../themes/theme";
import { postGoal } from "../../../functions/Goal";
import { useDispatch, useSelector } from 'react-redux';
import ConfirmationModal from "../../../components/ConfirmationModal";
import { startLoading, stopLoading } from "../../../redux/slice/loaderSlice";
import CustomDropdown from "../../../components/CustomSelector";

export default function AddGoal() {
  const [goalName, setGoalName] = useState("");
  const [goalType, setGoalType] = useState("Daily");
  const [status, setStatus] = useState("Active");
  const [targetDate, setTargetDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const userId = useSelector((state) => state.auth.userId);
  const dispatch = useDispatch();

  // Picker options
  const goalTypeOptions = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
  ];

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Completed", value: "completed" },
    { label: "Dropped", value: "dropped" },
  ];

  // Date picker handlers
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || targetDate;
    setShowDatePicker(Platform.OS === "ios"); // On iOS, keep showing until done button is pressed
    setTargetDate(currentDate);
  };

  const handleDatePress = () => {
    setShowDatePicker(true);
  };

  // Submit handler
  const handleSubmit = async () => {
    dispatch(startLoading());
    const formData = {
      userId,
      title: goalName,
      status: status.toLowerCase(),
      description,
      frequency: goalType.toLowerCase(),
      targetDate: targetDate.toISOString().split('T')[0],
    };

    const result = await postGoal(formData);
    console.log(formData); formData

    if (result.error) {
      console.warn('Goal creation failed:', result.error);
      dispatch(stopLoading());
    } else {
      console.log('Goal created:', result);
      dispatch(stopLoading());
      setShowConfirmationModal(true);
      // setTimeout(() => {
      //   setShowConfirmationModal(false);
      //   // Optionally reset form fields
      //   setGoalName("");
      //   setGoalType("Daily");
      //   setStatus("Active");
      //   setDescription("");
      //   setTargetDate(new Date());
      // }, 2000);
    }
  };

  return (
    <ImageBackground source={bg} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Header */}
          <Header title={"Set Goal"} />

          <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
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
                <Image style={{ width: 20, height: 20 }} source={calendar} />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker testID="datePicker" value={targetDate} mode="date" display="default" onChange={onDateChange} />
              )}
            </View>

            <CustomDropdown
              label="Goal Type"
              options={goalTypeOptions.map((item) => item.label)} // Just labels
              selectedValue={goalType}
              onValueChange={setGoalType}
            />

            <CustomDropdown
              label="Status"
              options={statusOptions.map((item) => item.label)}
              selectedValue={status}
              onValueChange={setStatus}
            />

            {/* Description */}
            <CustomInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Add more details..."
              isMultiline={true}
              style={{ height: 100 }}
            />

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </ScrollView>
        {showConfirmationModal && <ConfirmationModal title={"Goal Added!"} message={"Your goal has been added successfully "} icon={tick} onClose={() => setShowConfirmationModal(false)} />}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,

  },
  formContainer: {
    paddingBottom: 40,
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
  pickerTxt: {
    fontFamily: "Inter-Medium",
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
    color: "#fff",
    fontFamily: "Inter-Regular",
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
    fontFamily: "Inter-Light-BETA",
    paddingVertical: 15,
    fontSize: 10,

  },
  submitButton: {
    backgroundColor: theme.primaryColor,
    width: "100%",
    padding: 15,
    borderRadius: 14,
    marginTop: 20,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
  },
});

