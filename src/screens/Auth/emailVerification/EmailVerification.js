import React, { useRef, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions,
    Image, ImageBackground, Alert
} from 'react-native';
import { bg, lock, tick, } from '../../../assets/images';
import theme from '../../../themes/theme';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { verifyOTP } from '../../../functions/otpService';
import registerUser from '../../../functions/registerUser';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';


const { width, height } = Dimensions.get('window');

const EmailVerification = ({ navigation, route }) => {
    const email = route.params?.email || "";
    const reset = route.params?.reset || false;
    const token = route.params?.token || "";
    const userData = route.params?.userData || null;
    const status = route.params?.status || "";
    const dispatch = useDispatch();

    const [code, setCode] = useState(['', '', '', '']);
    const inputs = useRef([]);

    const handleChange = (text, index) => {
        if (!/^[a-zA-Z0-9]*$/.test(text)) return; // Allow only alphanumeric characters
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        if (text && index < 3) {
            inputs.current[index + 1].focus();
        }
    };


    const handleKeyPress = ({ nativeEvent }, index) => {
        if (nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
            inputs.current[index - 1].focus();
        }

    };

    const [modalVisible, setModalVisible] = useState(false);

    const handleVerify = async () => {
        console.log("Verifying OTP for email");
        const otp = code.join("");

        if (otp.length !== 4) {
            alert("Please enter a 4-digit OTP");
            return;
        }

        try {
            dispatch(startLoading());

            const response = await verifyOTP(email, otp);

            if (response?.message === "OTP verified") {
                console.log("OTP Verified successfully");

                if (status === "register") {
                    try {
                        const regResponse = await registerUser(userData);
                        if (regResponse) {
                            console.log("User registered successfully:", regResponse);
                            setModalVisible(true); // Show success modal

                            setTimeout(() => {
                                dispatch(stopLoading());
                                navigation.navigate("Login"); // Navigate after delay
                            }, 2000);
                        } else {
                            dispatch(stopLoading());
                            Alert.alert(
                                "Registration Failed",
                                "The registration could not be completed. This might be due to duplicate information. Please try again with different details or contact support.",
                                [
                                    {
                                        text: "Go Back",
                                        onPress: () => navigation.goBack(),
                                    },
                                    {
                                        text: "Try Login",
                                        onPress: () => navigation.navigate("Login"),
                                    }
                                ]
                            );
                        }
                    } catch (regError) {
                        dispatch(stopLoading());
                        console.error("Registration failed:", regError);

                        // Check if it's a duplicate error
                        const errorMessage = regError?.response?.data?.message || regError.message || "Registration failed";

                        if (errorMessage.includes("E11000") || errorMessage.includes("duplicate")) {
                            Alert.alert(
                                "Account Already Exists",
                                "An account with this information already exists. Please try logging in instead.",
                                [
                                    {
                                        text: "Go Back",
                                        onPress: () => navigation.goBack(),
                                    },
                                    {
                                        text: "Login",
                                        onPress: () => navigation.navigate("Login"),
                                    }
                                ]
                            );
                        } else {
                            Alert.alert(
                                "Registration Error",
                                "Something went wrong during registration. Please try again.",
                                [
                                    {
                                        text: "Go Back",
                                        onPress: () => navigation.goBack(),
                                    },
                                    {
                                        text: "Retry",
                                        onPress: () => handleVerify(),
                                    }
                                ]
                            );
                        }
                    }
                } else {
                    dispatch(stopLoading());
                    navigation.navigate("ResetPassword", { email, token });
                }

            } else {
                dispatch(stopLoading());
                Alert.alert("Invalid OTP", "The OTP you entered is invalid. Please try again.");
                console.error("OTP verification failed");
            }
        } catch (error) {
            dispatch(stopLoading());
            console.error("Error verifying OTP:", error);
            const errorMessage = error?.response?.data?.message || error.message || "An error occurred";
            Alert.alert("Verification Error", errorMessage);
        }
    };



    return (
        <ImageBackground source={bg} style={styles.container}>
            <Image source={lock} style={styles.image} />

            <View style={styles.bottomcontainer}>
                <Text style={styles.title}>Email Verification</Text>
                <Text style={styles.subtitle}>
                    Enter the verification code we just sent to your email address.
                </Text>
                <Text style={styles.email}>{email}</Text>

                <View style={styles.codeContainer}>
                    {code.map((digit, index) => (
                        <TextInput
                            key={index}
                            keyboardType="numeric"
                            ref={ref => inputs.current[index] = ref}
                            value={digit}
                            onChangeText={text => handleChange(text, index)}
                            onKeyPress={e => handleKeyPress(e, index)}
                            maxLength={1}
                            style={[
                                styles.codeInput,
                                digit !== '' ? styles.filledInput : {}, // Apply filledInput style when value exists
                                inputs.current[index]?.isFocused?.() && { borderColor: theme.primaryColor }
                            ]}
                            autoFocus={index === 0}
                            selectionColor={theme.primaryColor}
                        />
                    ))}
                </View>

                <TouchableOpacity style={styles.button} onPress={handleVerify}>
                    <Text style={styles.buttonText}>Verify</Text>
                </TouchableOpacity>

            </View>

            <ConfirmationModal
                isVisible={modalVisible}
                icon={tick}
                onClose={() => setModalVisible(false)}
                title="Account Created!"
                message="Your account has been successfully created"
            />

        </ImageBackground>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#010b13',
        alignItems: 'center',
    },
    bottomcontainer: {
        flex: 1,
        backgroundColor: theme.darkBlue,
        width: '100%',
        paddingHorizontal: width * 0.1,
        borderTopLeftRadius: width * 0.08,
        borderTopRightRadius: width * 0.08,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: height * 0.03,
    },
    image: {
        width: width * 0.55,
        height: width * 0.45,
        resizeMode: 'contain',
        marginTop: height * 0.02,
    },
    title: {
        fontSize: width * 0.07,
        color: '#EFEFEF',
        fontFamily: 'Inter-SemiBold',
        marginTop: height * 0.03,
        marginBottom: height * 0.015,
    },
    subtitle: {
        color: '#FFFFFF',
        fontSize: width * 0.035,
        fontFamily: 'Inter-Light-BETA',
        textAlign: 'center',
        marginBottom: height * 0.015,
    },
    email: {
        color: theme.primaryColor,
        fontSize: width * 0.038,
        fontFamily: 'Inter-Regular',
        textAlign: 'center',
        marginBottom: height * 0.04,
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: height * 0.03,
        gap: width * 0.025,
    },
    codeInput: {
        width: width * 0.16,
        height: width * 0.16,
        borderWidth: 2,
        borderColor: theme.borderColor,
        borderRadius: width * 0.03,
        textAlign: 'center',
        fontSize: width * 0.055,
        color: '#fff',
        fontFamily: 'Inter-SemiBold',
    },
    filledInput: {
        borderColor: theme.primaryColor,
    },
    button: {
        backgroundColor: theme.primaryColor,
        width: '100%',
        paddingVertical: height * 0.018,
        borderRadius: width * 0.035,
        marginTop: height * 0.03,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: width * 0.042,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
    },
});

export default EmailVerification;
