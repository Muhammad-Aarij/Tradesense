import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, ScrollView } from 'react-native';
import theme from '../../../themes/theme';
import { age1, age2, age3, age4, age5, age6, bg } from '../../../assets/images';

const AgeScreen = ({ navigation, route }) => {
    const [selectedAge, setSelectedAge] = useState(null);
    const { request } = route.params || {};
    console.log(request);

    const ageGroups = [
        { label: '18-24', icon: age2 },
        { label: '25-34', icon: age3 },
        { label: '35-44', icon: age4 },
        { label: '45-54', icon: age5 },
        { label: '55-64', icon: age1 },
        { label: '65+', icon: age6 }
    ];
    const handleAgeSelection = (age) => {
        setSelectedAge(age);
    };

    const handleNext = () => {
        if (selectedAge) {
            const updatedRequest = {
                ...request,
                ageRange: selectedAge.label
            };
            navigation.navigate('GoalScreen', { request: updatedRequest });
        }
    };

    return (
        <ImageBackground source={bg} style={styles.container}>
            <ScrollView style={{ flex: 1, width: "100%" }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Age</Text>
                <Text style={styles.subtitle}>What is your age?</Text>
                <View style={styles.optionsContainer}>
                    {ageGroups.map((age) => (
                        <TouchableOpacity
                            key={age.label}
                            style={[styles.option, selectedAge?.label === age.label && styles.selectedOption]}
                            onPress={() => handleAgeSelection(age)

                            }                        >
                            <Image source={age.icon} style={{ width: 45, height: 45, resizeMode: "contain" }} />
                            <Text style={[styles.optionText, selectedAge?.label === age.label && { color: "#70C2E8" }]}>{age.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity
                    style={[styles.button, !selectedAge && styles.disabledButton]}
                    disabled={!selectedAge}
                    onPress={handleNext}
                >
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </ScrollView>

        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', backgroundColor: theme.darkBlue, paddingHorizontal: 50, paddingBottom: 10 },
    title: { fontSize: 28, fontFamily: "Inter-SemiBold", color: "#FFFFFF", marginTop: 50 },
    subtitle: { fontSize: 13, fontFamily: "Inter-Medium", color: "#FFFFFF", marginBottom: 20 },
    optionsContainer: { flex: 1, width: '100%', justifyContent: 'center', alignItems: "center", gap: 15 },
    option: {
        width: '100%', backgroundColor: "#0d151e", fontFamily: "Inter-Medium",
        borderRadius: 8, paddingVertical: 13, borderWidth: 0.8, borderColor: theme.borderColor,
        flexDirection: "row", justifyContent: "center",
        alignItems: "center",
    },
    selectedOption: { backgroundColor: "rgba(112, 194, 232, 0.38)", borderColor: theme.primaryColor },
    optionText: { fontSize: 18, color: "#FFFFFF", fontFamily: "Inter-Medium", marginLeft: 13, },
    button: {
        backgroundColor: theme.primaryColor, padding: 15, borderRadius: 10, marginTop: 20, width: '100%', alignItems: 'center', marginBottom: 40,
    },
    disabledButton: { backgroundColor: "gray" },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', fontFamily: "Inter-SemiBold", }
});

export default AgeScreen;
