import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, Dimensions } from 'react-native';
import theme from '../../../themes/theme';
import { male, female, third, bg } from '../../../assets/images'; // Ensure correct icons
const { height } = Dimensions.get('window');

const GenderScreen = ({ navigation }) => {
    const [selectedGender, setSelectedGender] = useState(null);
    const [request, setRequest] = useState({
        "gender": null,
        "ageRange": null,
        "goals": [],
        "choosenArea": []
    })
    const genders = [
        { label: "Male", value: "male", icon: male },
        { label: "Female", value: "female", icon: female },
        { label: "Other", value: "other", icon: third }
    ];

    const handleGenderSelection = (gender) => {
        console.log("Handling Gender: ", gender);
        setSelectedGender(gender);
        setRequest(prevRequest => ({
            ...prevRequest,
            gender: gender
        }));
    };




    return (
        <ImageBackground source={bg} style={styles.container}>
            <Text style={styles.title}>Gender</Text>
            <Text style={styles.subtitle}>Select Your Gender</Text>
            <View style={styles.optionsContainer}>
                {genders.map((gender) => (
                    <TouchableOpacity
                        key={gender.label}
                        style={[styles.option, selectedGender === gender.label && styles.selectedOption]}
                        onPress={() => handleGenderSelection(gender.value)}
                    >
                        <Image source={gender.icon} style={styles.icon} />
                        <Text style={[styles.optionText, selectedGender === gender.label && styles.selectedOptiontext]}

                        >{gender.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity
                style={[styles.button, !selectedGender && styles.disabledButton]}
                disabled={!selectedGender}
                onPress={() => {
                    if (selectedGender) {
                        navigation.navigate('AgeScreen', { request });
                    }
                }}
            >
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>

        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.darkBlue, paddingVertical: 40, },
    title: { fontSize: 28, fontFamily: "Inter-SemiBold", color: "#FFFFFF", },
    subtitle: { fontSize: 13, fontFamily: "Inter-Medium", color: "#FFFFFF", marginBottom: 20 },
    optionsContainer: { flex: 1, flexDirection: 'column', justifyContent: 'center', marginBottom: 20, gap: 20 },
    option: {
        alignItems: 'center',
        padding: 15,
        backgroundColor: theme.inputBackground,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: "#CACACA",
        marginHorizontal: 10,
        height: height / 5.2,
        width: height / 5,
    },
    selectedOption: { backgroundColor: "rgba(112, 194, 232, 0.38)", borderColor: theme.primaryColor },
    icon: { width: 110, height: "80%", width: "90%", marginBottom: 10, resolveMode: 'contain' },
    optionText: { color: "#FFFFFF", fontSize: 16, fontFamily: "Inter-Medium" },
    selectedOptiontext: { color: theme.primaryColor, fontSize: 16, fontFamily: "Inter-Medium" },
    button: { backgroundColor: theme.primaryColor, padding: 15, borderRadius: 10, marginTop: 20, width: '80%', alignItems: 'center' },
    disabledButton: { backgroundColor: "gray" },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', fontFamily: "Inter-SemiBold" }
});

export default GenderScreen;
