import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, ScrollView, Image } from 'react-native';
import { check, uncheck, bg } from '../../../assets/images';
import theme from '../../../themes/theme';
import { fetchGoals } from '../../../functions/profiling';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';

const GoalsScreen = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const [goals, setGoals] = useState([]);
    const [selectedGoals, setSelectedGoals] = useState([]);
    const [request, setRequest] = useState(route.params?.request || {
        gender: null,
        ageRange: null,
        goals: [],
        choosenArea: [],
    });


    useEffect(() => {

        const MAX_RETRIES = 5;

        const loadGoals = async (retryCount = 0) => {
            dispatch(startLoading());

            try {
                const data = await fetchGoals();
                setGoals(data);
                dispatch(stopLoading());
            } catch (error) {
                console.warn(`Fetch failed (attempt ${retryCount + 1}):`, error);

                if (retryCount < MAX_RETRIES) {
                    const delay = Math.pow(2, retryCount) * 500; // exponential backoff
                    setTimeout(() => {
                        loadGoals(retryCount + 1);
                    }, delay);
                } else {
                    dispatch(stopLoading());
                    Alert.alert('Error', 'Failed to fetch goals after multiple attempts.');
                }
            }
        };

        loadGoals();
    }, []);


    const toggleGoal = (goalId) => {
        setSelectedGoals((prev) => {
            const updatedGoals = prev.includes(goalId)
                ? prev.filter((g) => g !== goalId)
                : [...prev, goalId];

            setRequest((prevRequest) => ({
                ...prevRequest,
                goals: updatedGoals,
            }));

            return updatedGoals;
        });
    };

    return (
        <ImageBackground source={bg} style={styles.container}>
            <Text style={styles.title}>Goals</Text>
            <Text style={styles.subtitle}>What is your goal?</Text>
            <ScrollView style={{ width: '100%', flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.tilesContainer}>
                    {goals.map((goal) => (
                        <TouchableOpacity
                            key={goal._id}
                            style={[
                                styles.option,
                                selectedGoals.includes(goal._id) && styles.selectedOption,
                            ]}
                            onPress={() => toggleGoal(goal._id)}
                        >
                            <Image source={{ uri: goal.image }} style={styles.goalIcon} />
                            <Text style={[styles.optionText, selectedGoals.includes(goal._id) && { color: '#70C2E8' }]}>
                                {goal.text}
                            </Text>
                            <Image style={styles.checkbox} source={selectedGoals.includes(goal._id) ? check : uncheck} />
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
