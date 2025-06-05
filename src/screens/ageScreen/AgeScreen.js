import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import theme from '../../themes/theme';
import { age1, age2, age3, age4, age5, age6, bg } from '../../assets/images';

const AgeScreen = ({ navigation }) => {
    const [selectedAge, setSelectedAge] = useState(null);

    const ageGroups = [
        { label: '18-24', icon: age2 },
        // { label: '25-34', icon: age3 },
        // { label: '35-44', icon: age4 },
        // { label: '45-54', icon: age5 },
        { label: '55-64', icon: age1 },
        { label: '65+', icon: age6 }
    ];

    return (
        <ImageBackground source={bg} style={styles.container}>
            <Text style={styles.title}>Select Your Age Group</Text>
            <View style={styles.optionsContainer}>
                {ageGroups.map((age) => (
                    <TouchableOpacity
                        key={age.label}
                        style={[styles.option, selectedAge === age && styles.selectedOption]}
                        onPress={() => setSelectedAge(age)}
                    >
                        <Image source={age.icon} style={{ width: 50, height: 50, resizeMode: "contain" }} />
                        <Text style={styles.optionText}>{age.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity
                style={[styles.button, !selectedAge && styles.disabledButton]}
                disabled={!selectedAge}
                onPress={() => navigation.navigate('GoalsScreen')}
            >
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.darkBlue, padding: 40 },
    title: { fontSize: 24, fontFamily: "Inter-SemiBold", color: "#FFFFFF", marginBottom: 20 },
    optionsContainer: { flexDirection: 'column', fontFamily: "Inter-SemiBold", justifyContent: 'center', marginBottom: 20, gap: 15, },
    option: {
        // flexDirection: "row",
        // alignItems: 'center',
        // padding: 15,
        // backgroundColor: theme.inputBackground,
        // borderRadius: 10,
        // margin: 8,
        // width: 100,
        width: '100%', backgroundColor: "#0d151e", fontFamily: "Inter-Medium",
        borderRadius: 8, paddingVertical: 15, borderWidth: 0.8, borderColor: theme.borderColor,
        justifyContent: "center", flexDirection: "row",
    },
    selectedOption: { backgroundColor: theme.primaryColor },
    optionText: { width: "100%", color: "#FFFFFF", fontSize: 16, fontFamily: "Inter-Medium" },
    disabledButton: { backgroundColor: theme.disabledButton },
    button: { backgroundColor: theme.primaryColor, padding: 15, borderRadius: 10, marginTop: 20, width: '80%', alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', fontFamily: "Inter-SemiBold" }
});

export default AgeScreen;
