import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image, ImageBackground, ScrollView } from 'react-native';
import { bg, lock, } from '../../../assets/images';
import theme from '../../../themes/theme'
import CustomInput from '../../../components/CustomInput';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { sendOTP } from '../../../functions/otpService';

const { width, height } = Dimensions.get('window');

const ForgetPassword = ({ navigation }) => {
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const handleVerify = async () => {
        if (!email) {
            alert("Please enter your email address");
            return;
        }

        try {
            dispatch(startLoading());
            const response = await sendOTP(email, false);
            console.log("Reset email sent:", response);
            dispatch(stopLoading());
            alert("Password reset email sent successfully");
            navigation.navigate("EmailVerification", { email: email, status: "forget", token: response.token });
        } catch (error) {
            dispatch(stopLoading());
            console.error("Error sending reset email:", error);
            alert("Failed to send password reset email. Please try again.");
        }
    };

    return (
        <ImageBackground source={bg} style={styles.container}>
            <Image source={lock} style={styles.image} />
            <View style={styles.bottomcontainer}>
                <Text style={styles.title}>Forgot Password</Text>
                <Text style={styles.subtitle}>Enter your email address</Text>
                <CustomInput
                    placeholder="Enter your Email Address"
                    value={email}
                    onChangeText={setEmail}
                />

                <TouchableOpacity style={styles.button} onPress={() => handleVerify()}>
                    <Text style={styles.buttonText}>Verify</Text>
                </TouchableOpacity>


            </View >
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
        width: width,
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
        marginTop: height * 0.015,
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
        fontFamily: 'Inter-Medium',
        textAlign: 'center',
        marginBottom: height * 0.03,
    },
    passwordContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    input: {
        width: '100%',
        flex: 1,
        backgroundColor: '#0d151e',
        color: '#fff',
        fontFamily: 'Inter-Regular',
        borderRadius: width * 0.02,
        padding: width * 0.04,
        borderWidth: 0.8,
        marginTop: height * 0.012,
        borderColor: theme.borderColor,
        paddingRight: 40,
    },
    inputsimple: {
        width: '100%',
        backgroundColor: '#0d151e',
        color: '#fff',
        fontFamily: 'Inter-Regular',
        borderRadius: width * 0.02,
        padding: width * 0.04,
        marginTop: height * 0.012,
        borderWidth: 0.8,
        borderColor: theme.borderColor,
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: height * 0.06,
    },
    eyeButton: {
        position: 'absolute',
        right: 15,
        padding: 5,
    },
    eyeIcon: {
        width: width * 0.05,
        height: width * 0.05,
        tintColor: '#aaa',
    },
    forgot: {
        alignSelf: 'flex-end',
        marginBottom: height * 0.025,
    },
    forgotText: {
        color: '#FFFFFF',
        fontSize: width * 0.028,
        fontFamily: 'Inter-Medium',
    },
    label: {
        fontFamily: 'Inter-Medium',
        width: '100%',
        textAlign: 'left',
        color: '#FFFFFF',
        fontSize: width * 0.032,
        marginTop: height * 0.02,
        marginBottom: height * 0.008,
    },
    button: {
        backgroundColor: theme.primaryColor,
        width: '100%',
        padding: height * 0.017,
        borderRadius: width * 0.04,
        marginTop: height * 0.02,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: width * 0.041,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
    },

});


export default ForgetPassword;
