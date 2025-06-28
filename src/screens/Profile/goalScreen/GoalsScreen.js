import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Image,
    Alert
} from 'react-native';
import { bg, check, uncheck } from '../../../assets/images';
import theme from '../../../themes/theme';
import axios from 'axios';
import { API_URL } from '@env';
import { useDispatch } from 'react-redux';
import { loginUser,setProfilingDone } from '../../../redux/slice/authSlice';

const GoalsScreen = ({ navigation, route }) => {
    const { request, user, token, question: allQuestions } = route.params || {};
    const [currentIndex, setCurrentIndex] = useState(0);
    const [onboarding, setOnboarding] = useState([]);
    const [selectedGoalTexts, setSelectedGoalTexts] = useState([]);
    const [selectedOptionText, setSelectedOptionText] = useState(null);
    const dispatch=useDispatch();
    // Exclude age and gender questions
    const questions = allQuestions?.filter(
        q => q.title.toLowerCase() !== 'age' && q.title.toLowerCase() !== 'gender'
    ) || [];

    const currentQuestion = questions[currentIndex];
    const isGoalQuestion = currentQuestion?.title.toLowerCase().includes('goal');

    const handleSelect = (text) => {
        if (isGoalQuestion) {
            setSelectedGoalTexts(prev =>
                prev.includes(text) ? prev.filter(t => t !== text) : [...prev, text]
            );
        } else {
            setSelectedOptionText(text);
        }
    };

    const handleNext = async () => {
        if (isGoalQuestion) {
            if (selectedGoalTexts.length === 0) return;
        } else {
            if (!selectedOptionText) return;
            setOnboarding(prev => [...prev, selectedOptionText]);
        }

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOptionText(null);
        } else {
            const payload = {
                gender: request.gender?.toLowerCase(),
                ageRange: request.ageRange,
                goals: selectedGoalTexts,
                onboarding: [...onboarding, selectedOptionText].filter(Boolean)
            };
            console.log('====================================');
            console.log(payload);
            console.log('====================================');

            setupProfile(payload, user._id);
            await dispatch(loginUser({
                token: token,
                user: user,
                themeType: 'dark', // or read from API/config
            }));

            dispatch(setProfilingDone(true));
        }
    };

    const setupProfile = async (data, userId) => {
        try {
            await axios.post(
                `${API_URL}/api/auth/setup-profile/${userId}`,
                data,
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            Alert.alert('Success', 'Profile setup completed');
            navigation.navigate('Home');
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to complete setup');
        }
    };

    if (!currentQuestion) {
        return (
            <View style={styles.center}>
                <Text style={styles.title}>No onboarding questions found.</Text>
            </View>
        );
    }

    return (
        <ImageBackground source={bg} style={styles.container}>
            <View style={styles.wrapper}>
                {/* Title + Subtitle */}
                <View style={styles.header}>
                    <Text style={styles.title}>{currentQuestion.title}</Text>
                    <Text style={styles.subtitle}>{currentQuestion.subTitle}</Text>
                </View>

                {/* Scrollable Options */}
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {(currentQuestion.questions || []).map((opt) => {
                        const isSelected = isGoalQuestion
                            ? selectedGoalTexts.includes(opt.text)
                            : selectedOptionText === opt.text;

                        return (
                            <TouchableOpacity
                                key={opt._id}
                                style={[styles.option, isSelected && styles.selectedOption]}
                                onPress={() => handleSelect(opt.text)}
                            >
                                {currentQuestion.images && opt.image ? (
                                    <Image source={{ uri: opt.image }} style={styles.optionImage} />
                                ) : null}
                                <Text style={[styles.optionText, isSelected && { color: '#70C2E8' }]}>
                                    {opt.text}
                                </Text>
                                <Image
                                    source={isSelected ? check : uncheck}
                                    style={styles.checkbox}
                                />
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* Bottom Button */}
                <View style={styles.bottomButton}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            (isGoalQuestion && selectedGoalTexts.length === 0) ||
                                (!isGoalQuestion && !selectedOptionText)
                                ? styles.disabledButton
                                : null
                        ]}
                        disabled={
                            (isGoalQuestion && selectedGoalTexts.length === 0) ||
                            (!isGoalQuestion && !selectedOptionText)
                        }
                        onPress={handleNext}
                    >
                        <Text style={styles.buttonText}>
                            {currentIndex === questions.length - 1 ? 'Finish' : 'Next'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.darkBlue },
    wrapper: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20
    },
    header: {
        marginBottom: 20
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'flex-start'
    },
    bottomButton: {
        marginTop: 10
    },
    title: {
        textAlign: 'center',
        fontSize: 28,
        color: '#fff',
        fontFamily: 'Inter-SemiBold',
        marginBottom: 10
    },
    subtitle: {
        fontSize: 14,
        color: '#fff',
        fontFamily: 'Inter-Regular',
        textAlign: 'center',
        marginBottom: 20
    },
    option: {
        width: '100%',
        backgroundColor: '#0d151e',
        borderRadius: 10,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: theme.borderColor,
        borderWidth: 0.8,
        marginBottom: 15
    },
    selectedOption: {
        backgroundColor: 'rgba(112,194,232,0.3)',
        borderColor: theme.primaryColor
    },
    optionImage: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
        marginRight: 10
    },
    optionText: {
        width: '80%',
        color: '#fff',
        fontSize: 13,
        fontFamily: 'Inter-Light-BETA'
    },
    checkbox: {
        width: 20,
        height: 25,
        resizeMode: 'contain',
        marginLeft: 'auto'
    },
    button: {
        backgroundColor: theme.primaryColor,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%'
    },
    disabledButton: {
        backgroundColor: 'gray'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Inter-SemiBold'
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default GoalsScreen;
