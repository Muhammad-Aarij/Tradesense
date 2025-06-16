import React, { useState } from "react";
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
  Image,
} from "react-native";
import CustomInput from "../../../components/CustomInput";
import CustomDropdown from "../../../components/CustomSelector";
import { bg, tick } from "../../../assets/images";
import Header from "../../../components/Header";
import theme from "../../../themes/theme";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "../../../redux/slice/loaderSlice";
import { postHabit } from "../../../functions/habbitFunctions";
import ConfirmationModal from "../../../components/ConfirmationModal";

export default function HabitTracking() {
  const [habitName, setHabitName] = useState("");
  const [habitType, setHabitType] = useState("Daily");
  const [habitStatus, setHabitStatus] = useState("Pending");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);

  const userId = useSelector((state) => state.auth.userId);
  const dispatch = useDispatch();

  const habitTypeOptions = ["Daily", "Weekly", "Monthly"];
  const habitStatusOptions = ["Pending", "Completed", "Failed"];

  const handleSubmit = async () => {
    dispatch(startLoading());

    const payload = {
      userId,
      title: habitName,
      description,
      type: habitType.toLowerCase(),
      status: habitStatus.toLowerCase(),
    };

    const result = await postHabit(payload);
    dispatch(stopLoading());

    if (result.error) {
      console.warn("Habit creation failed:", result.error);
    } else {
      console.log("Habit created successfully:", result);
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        // Optionally reset form fields
        setHabitName("");
        setHabitType("Daily");
        setHabitStatus("Pending");
        setDescription("");
      }, 2000);
       
    }
  };

  return (
    <ImageBackground source={bg} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Header title="Habit Tracking" />

            <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
              <CustomInput
                label="Habit Name"
                value={habitName}
                onChangeText={setHabitName}
                placeholder="Enter your habit..."
              />

              <CustomDropdown
                label="Habit Type"
                options={habitTypeOptions}
                selectedValue={habitType}
                onValueChange={setHabitType}
              />

              <CustomDropdown
                label="Status"
                options={habitStatusOptions}
                selectedValue={habitStatus}
                onValueChange={setHabitStatus}
              />

              <CustomInput
                label="Description"
                value={description}
                onChangeText={setDescription}
                placeholder="Add more details..."
                isMultiline={true}
                style={{ height: 100 }}
              />

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </>
        {showModal && <ConfirmationModal title={"Habit Added!"} message={"Your habit has been added successfully "} icon={tick} />}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    // paddingVertical: 0,
  },
  formContainer: {
    paddingBottom: 40,
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
