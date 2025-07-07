import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Image, Alert } from 'react-native';
import { bg, check, tick, uncheck } from '../../../assets/images';
import theme from '../../../themes/theme';
import axios from 'axios';
import { API_URL } from '@env';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../redux/slice/authSlice';
import ConfirmationModal from '../../../components/ConfirmationModal';

const GoalsScreen = ({ navigation, route }) => {
    const { request, user, token, question: allQuestions } = route.params || {};
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOptionsMap, setSelectedOptionsMap] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const dispatch = useDispatch();

    const questions = allQuestions?.filter(
        q => q.title.toLowerCase() !== 'age' && q.title.toLowerCase() !== 'gender'
    ) || [];

    const currentQuestion = questions[currentIndex];

    const handleSelect = (optionId) => {
        const qId = currentQuestion._id;
        setSelectedOptionsMap(prev => {
            const selected = prev[qId] || [];
            const updated = selected.includes(optionId)
                ? selected.filter(id => id !== optionId)
                : [...selected, optionId];
            return { ...prev, [qId]: updated };
        });
    };

    const handleNext = async () => {
        const qId = currentQuestion._id;
        const selected = selectedOptionsMap[qId] || [];
        if (selected.length === 0) return;

        const isLast = currentIndex === questions.length - 1;

        if (!isLast) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // Build new payload format
            const questionnaireAnswers = {};
            questions.forEach(q => {
                const selectedIds = selectedOptionsMap[q._id] || [];
                if (selectedIds.length > 0) {
                    questionnaireAnswers[q._id] = selectedIds;
                }
            });

            const payload = {
                gender: request.gender?.toLowerCase(),
                ageRange: request.ageRange,
                questionnaireAnswers
            };

            console.log('Submitting Payload:', JSON.stringify(payload, null, 2));

            try {
                await axios.post(
                    `${API_URL}/api/auth/setup-profile/${user._id}`,
                    payload,
                    { headers: { 'Content-Type': 'application/json' } }
                );

                await dispatch(loginUser({
                    token,
                    user,
                    themeType: 'dark',
                }));

                setShowSuccessModal(true);
            } catch (err) {
                console.error(err);
                Alert.alert('Error', 'Failed to complete setup');
            }
        }
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
        navigation.navigate('GetStarted');
    };

    if (!currentQuestion) {
        return (
            <View style={styles.center}>
                <Text style={styles.title}>No onboarding questions found.</Text>
            </View>
        );
    }

    const selected = selectedOptionsMap[currentQuestion._id] || [];

    return (
        <>
            {showSuccessModal &&
                <ConfirmationModal
                    visible={showSuccessModal}
                    title={"Success!"}
                    icon={tick}
                    message={"Profile setup completed successfully"}
                    onClose={handleCloseModal}
                />
            }
            <ImageBackground source={bg} style={styles.container}>
                <View style={styles.wrapper}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{currentQuestion.title}</Text>
                        <Text style={styles.subtitle}>{currentQuestion.subTitle}</Text>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {(currentQuestion.questions || []).map((opt) => {
                            const isSelected = selected.includes(opt._id);
                            return (
                                <TouchableOpacity
                                    key={opt._id}
                                    style={[styles.option, isSelected && styles.selectedOption]}
                                    onPress={() => handleSelect(opt._id)}
                                >
                                    {currentQuestion.images && opt.image && (
                                        <Image source={{ uri: opt.image }} style={styles.optionImage} />
                                    )}
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

                    <View style={styles.bottomButton}>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                selected.length === 0 ? styles.disabledButton : null
                            ]}
                            disabled={selected.length === 0}
                            onPress={handleNext}
                        >
                            <Text style={styles.buttonText}>
                                {currentIndex === questions.length - 1 ? 'Finish' : 'Next'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.darkBlue },
    wrapper: {
        flex: 1,
        paddingHorizontal: 25,
        paddingTop: 60,
        paddingBottom: 20
    },
    header: { marginBottom: 20 },
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
        fontFamily: 'Inter-Light-BETA',
        textAlign: 'center',
        marginBottom: 20
    },
    option: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: 10,
        padding: 15,
        // padddingRight:15,
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
        width: 30,
        height: 30,
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
        marginLeft: 'auto',
        marginRight:15,
    },
    disabledButton: {
        backgroundColor: 'gray'
    },
    button: {
        backgroundColor: theme.primaryColor,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%'
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
