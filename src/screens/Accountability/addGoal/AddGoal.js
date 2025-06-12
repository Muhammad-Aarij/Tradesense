import React, { useState } from "react";
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
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomInput from "../../../components/CustomInput";
import { bg, calendar } from "../../../assets/images";
import Header from "../../../components/Header";
import theme from "../../../themes/theme";

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
          <Picker.Item style={styles.pickerTxt} key={index} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  </View>
);

export default function AddGoal() {
  // State variables for form fields
  const [goalName, setGoalName] = useState("");
  const [goalType, setGoalType] = useState("Personal");
  const [priority, setPriority] = useState("High");
  const [status, setStatus] = useState("Not Started");
  const [targetDate, setTargetDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState("");

  // Picker options
  const goalTypeOptions = [
    { label: "Personal", value: "Personal" },
    { label: "Work", value: "Work" },
    { label: "Health", value: "Health" },
  ];

  const priorityOptions = [
    { label: "High", value: "High" },
    { label: "Medium", value: "Medium" },
    { label: "Low", value: "Low" },
  ];

  const statusOptions = [
    { label: "Not Started", value: "Not Started" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
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
  const handleSubmit = () => {
    const formData = {
      goalName,
      goalType,
      priority,
      status,
      targetDate: targetDate.toISOString().split("T")[0], // Format date as YYYY-MM-DD
      description,
    };
    console.log("Form Submitted:", formData);
    // Here, you would typically send this data to a server or save it locally.
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

            {/* Goal Type Picker */}
            <CustomPicker label="Goal Type" selectedValue={goalType} onValueChange={setGoalType} items={goalTypeOptions} />

            {/* Priority Picker */}
            <CustomPicker label="Priority Level" selectedValue={priority} onValueChange={setPriority} items={priorityOptions} />

            {/* Status Picker */}
            <CustomPicker label="Status" selectedValue={status} onValueChange={setStatus} items={statusOptions} />

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
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    paddingVertical: 0,
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

