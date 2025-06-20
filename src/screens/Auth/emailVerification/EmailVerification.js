import React, { useRef, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions,
    Image, ImageBackground
} from 'react-native';
import { bg, tick, verify } from '../../../assets/images';
import theme from '../../../themes/theme';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { verifyOTP } from '../../../functions/otpService';
import registerUser from '../../../functions/registerUser';
import { useDispatch } from 'react-redux';
import { startLoading ,stopLoading} from '../../../redux/slice/loaderSlice';


const { width } = Dimensions.get('window');

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
                            alert("Registration failed.");
                            console.error("No response from registerUser.");
                        }
                    } catch (regError) {
                        console.error("Registration failed:", regError);
                        alert("Something went wrong during registration.");
                    }
                } else {
                    dispatch(stopLoading());
                    navigation.navigate("ResetPassword", { email, token });
                }

            } else {
                alert("Invalid OTP, please try again.");
                console.error("OTP verification failed");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            alert("An error occurred, please try again.");
        } finally {
            dispatch(stopLoading());
        }
    };



    return (
        <ImageBackground source={bg} style={styles.container}>
            <Image source={verify} style={styles.image} />

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
    container: { flex: 1, backgroundColor: '#010b13', alignItems: 'center' },
    bottomcontainer: {
        flex: 1,
        backgroundColor: theme.darkBlue,
        width: "100%",
        paddingHorizontal: 43,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 25,
    },
    image: { width: 134, height: 134, resizeMode: 'contain', marginTop: 30 },
    title: {
        fontSize: 28,
        color: '#EFEFEF',
        fontFamily: "Inter-SemiBold",
        marginTop: 25,
        marginBottom: 8,
    },
    subtitle: {
        color: '#FFFFFF',
        fontSize: 15,
        fontFamily: "Inter-Thin",
        textAlign: 'center',
        marginBottom: 5
    },
    email: {
        color: theme.primaryColor,
        fontSize: 16,
        fontFamily: "Inter-Medium",
        textAlign: 'center',
        marginBottom: 25
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
        gap: 10,
    },
    codeInput: {
        width: width / 5.5,
        height: width / 5.5,
        borderWidth: 2,
        borderColor: theme.borderColor,
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 22,
        color: '#fff',
        fontFamily: 'Inter-SemiBold',
    },
    filledInput: {
        borderColor: theme.primaryColor,
    },
    button: {
        backgroundColor: theme.primaryColor,
        width: '100%',
        padding: 15,
        borderRadius: 14,
        marginTop: 20,
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
        fontFamily: "Inter-SemiBold",
    },
});

export default EmailVerification;
