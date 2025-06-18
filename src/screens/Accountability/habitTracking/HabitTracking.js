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
import { postHabit, updateHabit } from "../../../functions/habbitFunctions";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { useQueryClient } from "@tanstack/react-query";

export default function HabitTracking({ route }) {
  const editingHabit = route?.params?.habit;
  const [habitName, setHabitName] = useState("");
  const [habitType, setHabitType] = useState("Daily");
  const [habitStatus, setHabitStatus] = useState("Pending");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const quertClient = useQueryClient();
  const userId = useSelector((state) => state.auth.userId);
  const dispatch = useDispatch();

  const habitTypeOptions = ["Daily", "Weekly", "Monthly"];
  const habitStatusOptions = ["Pending", "Completed", "Failed"];
  React.useEffect(() => {
    if (editingHabit) {
      setHabitName(editingHabit.title || "");
      setHabitType(capitalizeFirst(editingHabit.type || "Daily"));
      setHabitStatus(capitalizeFirst(editingHabit.status || "Pending"));
      setDescription(editingHabit.description || "");
    }
  }, [editingHabit]);

  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);


  const handleSubmit = async () => {
    dispatch(startLoading());

    const payload = {
      userId,
      title: habitName,
      description,
      type: habitType.toLowerCase(),
      status: habitStatus.toLowerCase(),
    };

    const result = editingHabit
      ? await updateHabit(editingHabit._id, payload)
      : await postHabit(payload);

    dispatch(stopLoading());

    if (result.error) {
      console.warn(`${editingHabit ? "Update" : "Creation"} failed:`, result.error);
    } else {
      quertClient.invalidateQueries(['Habit', userId]);
      console.log(`Habit ${editingHabit ? "updated" : "created"}:`, result);
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        if (!editingHabit) {
          setHabitName("");
          setHabitType("Daily");
          setHabitStatus("Pending");
          setDescription("");
        }
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
                <Text style={styles.submitButtonText}>{editingHabit ? "Update" : "Submit"}</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </>
        {showModal && <ConfirmationModal title={editingHabit ? "Habit Updated" : "Habit Added!"} message={editingHabit ? "Your habit has been updated successfully" : "Your habit has been added successfully "} onClose={() => setShowModal(false)}
          icon={tick} />}
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
