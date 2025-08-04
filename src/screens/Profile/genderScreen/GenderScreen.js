import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ImageBackground,
    Dimensions,
    BackHandler,
    SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchQuestionnaire } from '../../../functions/profiling';
import theme from '../../../themes/theme';
import { bg } from '../../../assets/images';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { useSelector } from 'react-redux';

const { height } = Dimensions.get('window');

const GenderScreen = ({ navigation, route }) => {
    const { user, token } = route.params;
    const dispatch = useDispatch();
    const [selectedGender, setSelectedGender] = useState(null);
    const [genderQuestions, setGenderQuestions] = useState([]);
    const [genderQuestionId, setGenderQuestionId] = useState(null);
    const [question, setQuestions] = useState([]);

    const [request, setRequest] = useState({
        gender: null,
        ageRange: null,
        goals: [],
        choosenArea: [],
    });

    const handleGenderSelection = (genderObj, questionId) => {
        setSelectedGender(genderObj._id);
        setRequest((prev) => ({
            ...prev,
            gender: {
                questionId,
                answerId: genderObj._id,
                value: genderObj.text,
            },
        }));
    };

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                BackHandler.exitApp();
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    useEffect(() => {
        const loadGenderQuestions = async () => {
            dispatch(startLoading());
            const data = await fetchQuestionnaire();
            if (data) {
                setQuestions(data);

                const genderSection = data.find(
                    (section) =>
                        section.title.toLowerCase().includes('gender') &&
                        section.questions &&
                        section.questions.length
                );

                if (genderSection) {
                    setGenderQuestions(genderSection.questions);
                    setGenderQuestionId(genderSection._id); // 👈 Store gender questionId
                }
            }
            dispatch(stopLoading());
        };

        loadGenderQuestions();
    }, []);

    return (
        <ImageBackground source={bg} style={{flex: 1}}>
        <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Gender</Text>
                <Text style={styles.subtitle}>Select Your Gender</Text>

                <View style={styles.optionsContainer}>
                    {genderQuestions.map((genderOption) => (
                        <TouchableOpacity
                            key={genderOption._id}
                            style={[
                                styles.option,
                                selectedGender === genderOption._id && styles.selectedOption,
                            ]}
                            onPress={() => handleGenderSelection(genderOption, genderQuestionId)}
                        >
                            {genderOption.image && (
                                <Image source={{ uri: genderOption.image }} style={styles.icon} />
                            )}
                            <Text
                                style={[
                                    styles.optionText,
                                    selectedGender === genderOption._id && styles.selectedOptiontext,
                                ]}
                            >
                                {genderOption.text}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={[styles.button, !selectedGender && styles.disabledButton]}
                    disabled={!selectedGender}
                    onPress={() => {
                        if (selectedGender) {
                            navigation.navigate('AgeScreen', {
                                request,
                                user,
                                token,
                                question,
                            });
                        }
                    }}
                >
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </ImageBackground>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.darkBlue,
        paddingVertical: 40,
    },
    title: {
        fontSize: 28,
        marginBottom:5,
        fontFamily: 'Outfit-Medium',
        color: '#FFFFFF',
    },
    subtitle: {
        fontSize: 11,
        fontFamily: 'Outfit-Regular',
        color: '#FFFFFF',
        marginBottom: 20,
    },
    optionsContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginBottom: 20,
        gap: 20,
    },
    option: {
        alignItems: 'center',
        padding: 15,
        backgroundColor: theme.inputBackground,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#CACACA',
        marginHorizontal: 10,
        height: height / 5.2,
        width: height / 5,
    },
    selectedOption: {
        backgroundColor: 'rgba(112, 194, 232, 0.38)',
        borderColor: theme.primaryColor,
    },
    icon: {
        width: '90%',
        height: '80%',
        resizeMode: 'contain',
        marginBottom: 10,
    },
    optionText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontFamily: 'Outfit-Regular',
    },
    selectedOptiontext: {
        color: theme.primaryColor,
        fontSize: 14,
        fontFamily: 'Outfit-Regular',
    },
    button: {
        backgroundColor: theme.primaryColor,
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        width: '80%',
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: 'gray',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Outfit-SemiBold',
    },
});

export default GenderScreen;
