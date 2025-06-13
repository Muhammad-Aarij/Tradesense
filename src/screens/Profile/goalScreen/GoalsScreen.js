import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, ScrollView, Image } from 'react-native';
import { trophy, wallet, bg, alarm, board, health, hearts, check, uncheck } from '../../../assets/images';
import theme from '../../../themes/theme';

const GoalsScreen = ({ navigation, route }) => {
    const [selectedGoals, setSelectedGoals] = useState([]);
    const [request, setRequest] = useState(route.params?.request || { gender: null, ageRange: null, goals: [], choosenArea: [] });

    console.log(request);

    const toggleGoal = (goal) => {
        setSelectedGoals((prev) => {
            const updatedGoals = prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal];
            setRequest(prevRequest => ({
                ...prevRequest,
                goals: updatedGoals
            }));
            return updatedGoals;
        });
    };



    const goals = [
        { label: 'Win at work', icon: trophy },
        { label: 'Have more money', icon: wallet },
        { label: 'Be productive', icon: alarm },
        { label: 'Stick to trading plan', icon: board },
        { label: 'Have a healthy body', icon: health },
        { label: 'Love & beloved', icon: hearts },
    ];

    return (
        <ImageBackground source={bg} style={styles.container}>
            <Text style={styles.title}>Goals</Text>
            <Text style={styles.subtitle}>What is your goal?</Text>
            <ScrollView style={{ width: '100%', flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.tilesContainer}>
                    {goals.map((goal) => (
                        <TouchableOpacity
                            key={goal.label}
                            style={[
                                styles.option,
                                selectedGoals.includes(goal.label) && styles.selectedOption,
                            ]}
                            onPress={() => toggleGoal(goal.label)}
                        >
                            <Image source={goal.icon} style={styles.goalIcon} />
                            <Text style={[styles.optionText, selectedGoals.includes(goal.label) && { color: '#70C2E8' }]}>
                                {goal.label}
                            </Text>
                            <Image style={styles.checkbox} source={selectedGoals.includes(goal.label) ? check : uncheck} />
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity
                    style={[styles.button, selectedGoals.length === 0 && styles.disabledButton]}
                    disabled={selectedGoals.length === 0}
                    onPress={() => navigation.navigate('AreasScreen', { request })}
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
    subtitle: { fontSize: 13, fontFamily: 'Inter-Medium', color: '#fff', marginBottom: 20 },
    tilesContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 15, width: '100%' },
    option: {
        width: '100%', backgroundColor: "#0d151e", fontFamily: "Inter-Medium",
        borderRadius: 8, padding: 12, borderWidth: 0.8, borderColor: theme.borderColor,
        flexDirection: "row", justifyContent: "center",
        alignItems: "center",
    },
    selectedOption: { backgroundColor: 'rgba(112,194,232,0.3)', borderColor: theme.primaryColor },
    optionText: { fontSize: 13.5, color: '#fff', fontFamily: 'Inter-Regular' },
    button: {
        backgroundColor: theme.primaryColor,
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 50,
        alignItems: 'center',
    },
    goalIcon: { width: 40, height: 40, resizeMode: 'contain', marginRight: 10 },
    checkbox: { width: 20, height: 25, resizeMode: "contain", marginLeft: 'auto' },

    disabledButton: { backgroundColor: 'gray' },
    buttonText: { color: '#fff', fontSize: 16, fontFamily: 'Inter-SemiBold' },
});

export default GoalsScreen;
