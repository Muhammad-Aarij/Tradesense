import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ImageBackground,
    ScrollView,
} from 'react-native';
import theme from '../../../themes/theme';
import { bg, age1, age2, age3, age4, age5, age6 } from '../../../assets/images';

const ageImageMap = {
    '18-24': age1,
    '25-30': age2,
    '31-35': age3,
    '36-40': age4,
    '41-50': age5,
    '50+': age6,
};

const AgeScreen = ({ navigation, route }) => {
    const { request, user, token, question } = route.params || {};
    const [selectedAge, setSelectedAge] = useState(null);
    const [ageQuestion, setAgeQuestion] = useState(null);

    useEffect(() => {
        if (Array.isArray(question)) {
            const ageObj = question.find((item) =>
                item.title.toLowerCase().includes('age')
            );
            if (ageObj) {
                setAgeQuestion(ageObj);
            }
        }
    }, [question]);

    const handleAgeSelection = (ageObj) => {
        setSelectedAge(ageObj);
    };

    const handleNext = () => {
        if (selectedAge && ageQuestion?._id) {
            const updatedRequest = {
                ...request,
                ageRange: {
                    questionId: ageQuestion._id,
                    answerId: selectedAge._id,
                    value: selectedAge.text,
                },
            };

            navigation.navigate('GoalScreen', {
                request: updatedRequest,
                user,
                token,
                question,
            });
        }
    };

    return (
        <ImageBackground source={bg} style={styles.container}>
            <ScrollView
                style={{ flex: 1, width: '100%' }}
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Age</Text>
                <Text style={styles.subtitle}>
                    {ageQuestion?.subTitle || 'What is your age?'}
                </Text>

                <View style={styles.optionsContainer}>
                    {(ageQuestion?.questions || []).map((ageOption) => {
                        const isSelected = selectedAge?._id === ageOption._id;
                        return (
                            <TouchableOpacity
                                key={ageOption._id}
                                style={[
                                    styles.option,
                                    isSelected && styles.selectedOption,
                                ]}
                                onPress={() => handleAgeSelection(ageOption)}
                            >
                                {ageImageMap[ageOption.text] && (
                                    <Image
                                        source={ageImageMap[ageOption.text]}
                                        style={{
                                            width: 45,
                                            height: 45,
                                            resizeMode: 'contain',
                                        }}
                                    />
                                )}
                                <Text
                                    style={[
                                        styles.optionText,
                                        isSelected && { color: '#70C2E8' },
                                    ]}
                                >
                                    {ageOption.text}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <TouchableOpacity
                    style={[
                        styles.button,
                        !selectedAge && styles.disabledButton,
                    ]}
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
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: theme.darkBlue,
        paddingHorizontal: 50,
        paddingBottom: 10,
    },
    title: {
        fontSize: 28,
        fontFamily: 'Inter-SemiBold',
        color: '#FFFFFF',
        marginTop: 50,
    },
    subtitle: {
        fontSize: 13,
        fontFamily: 'Inter-Medium',
        color: '#FFFFFF',
        marginBottom: 20,
        textAlign: 'center',
    },
    optionsContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
        paddingVertical: 10,
    },
    option: {
        width: '100%',
        backgroundColor: '#0d151e',
        fontFamily: 'Inter-Medium',
        borderRadius: 8,
        paddingVertical: 13,
        borderWidth: 0.8,
        borderColor: theme.borderColor,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedOption: {
        backgroundColor: 'rgba(112, 194, 232, 0.38)',
        borderColor: theme.primaryColor,
    },
    optionText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontFamily: 'Inter-Medium',
        marginLeft: 13,
    },
    button: {
        backgroundColor: theme.primaryColor,
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
        marginBottom: 40,
    },
    disabledButton: {
        backgroundColor: 'gray',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Inter-SemiBold',
    },
});

export default AgeScreen;
 