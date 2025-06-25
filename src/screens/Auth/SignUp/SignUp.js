import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image, ImageBackground, ScrollView, Alert, KeyboardAvoidingView } from 'react-native';
import { bg, G, eyeClose, secureUser, applePay } from '../../../assets/images';
import theme from '../../../themes/theme'
import LinearGradient from 'react-native-linear-gradient';
import CustomInput from '../../../components/CustomInput';
import registerUser from '../../../functions/registerUser';
import { sendOTP } from '../../../functions/otpService';
import handleGoogleLogin from '../../../functions/handleGoogleLogin';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';

const { width, height } = Dimensions.get('window');

const SignUp = ({ navigation }) => {

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordVisible2, setPasswordVisible2] = useState(false);
    const [name, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Passwords do not match!");
            return;
        }

        const userData = { name, phone, email, password, role: "user" };

        try {
            dispatch(startLoading());

            const response = await sendOTP(email, true);
            console.log("OTP sent successfully");

            if (response) {
                dispatch(stopLoading());
                navigation.navigate("EmailVerification", {
                    email: email,
                    userData: userData,
                    status: "register",
                });
            } else {
                dispatch(stopLoading());
                Alert.alert("OTP confirmation failed", "Please try again");
                console.error("OTP failed");
            }
        } catch (error) {
            dispatch(stopLoading());

            const serverMessage =
                error?.response?.data?.message || "Something went wrong. Please try again.";
            Alert.alert("Error", serverMessage);
            console.error("Error signing up:", error);
        }
    };
    return (
        <ImageBackground source={bg} style={styles.container}>
            <KeyboardAvoidingView style={styles.keyboardAvoiding} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Image source={secureUser} style={styles.image} />
                    <View style={styles.bottomcontainer}>
                        <Text style={styles.title}>Register Now</Text>
                        <Text style={styles.subtitle}>Create a new account</Text>

                        <CustomInput label="Full Name" placeholder="Enter Full Name" value={name} onChangeText={setFullName} />
                        <CustomInput label="Phone" placeholder="Enter Phone Number" value={phone} onChangeText={setPhone} />
                        <CustomInput label="Email" placeholder="Email Address" value={email} onChangeText={setEmail} />

                        <CustomInput
                            label="Password"
                            placeholder="Password"
                            secureTextEntry={!passwordVisible}
                            value={password}
                            onChangeText={setPassword}
                            icon={eyeClose}
                            onIconPress={() => setPasswordVisible(!passwordVisible)}
                        />

                        <CustomInput
                            label="Confirm Password"
                            placeholder="Confirm Password"
                            secureTextEntry={!passwordVisible2}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            icon={eyeClose}
                            onIconPress={() => setPasswordVisible2(!passwordVisible2)}
                        />

                        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>

                        <View style={styles.orContainer}>
                            <LinearGradient
                                start={{ x: 0.0, y: 0.95 }}
                                end={{ x: 1.0, y: 1.0 }}
                                colors={['rgba(204, 204, 204, 0.07)', 'rgba(255, 255, 255, 0.32)']}
                                style={styles.Line}
                            />
                            <Text style={styles.or}>Or continue with</Text>
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.32)', 'rgba(204, 204, 204, 0.07)']}
                                style={styles.Line}
                            />
                        </View>

                        <View style={styles.socialRow}>
                            <LinearGradient
                                start={{ x: 0.0, y: 0.95 }}
                                end={{ x: 1.0, y: 1.0 }}
                                colors={['rgba(255, 255, 255, 0.16)', 'rgba(204, 204, 204, 0)']}
                                style={styles.googleBtn}
                            >
                                <TouchableOpacity style={styles.googleBtnInner}>
                                    <Image source={G} style={styles.socialIcon} />
                                    <Text style={styles.googleText}>Continue with Google</Text>
                                </TouchableOpacity>
                            </LinearGradient>

                            <TouchableOpacity style={styles.appleBtn}>
                                <Image source={applePay} style={styles.socialIcon} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.footer}>
                                Already have an account? <Text style={styles.link}>Sign In</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#010b13',
        alignItems: 'center',
    },
    keyboardAvoiding: {
        width: '100%',
        flex: 1,
    },
    scrollView: {
        width: '100%',
        flex: 1,
    },
    scrollContent: {
        alignItems: 'center',
    },
    bottomcontainer: {
        flex: 1,
        backgroundColor: theme.darkBlue,
        width: width,
        paddingHorizontal: width * 0.1,
        borderTopLeftRadius: width * 0.07,
        borderTopRightRadius: width * 0.07,
        overflow: 'hidden',
        marginTop: height * 0.03,
        alignItems: 'center',
    },
    image: {
        width: width * 0.35,
        height: width * 0.35,
        resizeMode: 'contain',
        marginTop: height * 0.04,
    },
    title: {
        fontSize: width * 0.07,
        color: '#EFEFEF',
        fontFamily: 'Inter-SemiBold',
        marginTop: height * 0.03,
        marginBottom: height * 0.01,
    },
    subtitle: {
        color: '#FFFFFF',
        fontSize: width * 0.032,
        fontFamily: 'Inter-Medium',
        width: width * 0.5,
        textAlign: 'center',
        marginBottom: height * 0.025,
    },
    button: {
        backgroundColor: theme.primaryColor,
        width: '100%',
        paddingVertical: height * 0.02,
        borderRadius: width * 0.035,
        marginTop: height * 0.025,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: width * 0.04,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
    },
    orContainer: {
        marginVertical: height * 0.035,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    Line: {
        flex: 1,
        height: 0.8,
        backgroundColor: '#ccc',
    },
    or: {
        fontFamily: 'Inter-Medium',
        color: '#ccc',
        fontSize: width * 0.03,
        marginHorizontal: width * 0.025,
    },
    socialRow: {
        flexDirection: 'row',
    },
    googleBtn: {
        flexDirection: 'row',
        borderWidth: 0.3,
        borderColor: '#B6B6B6',
        borderRadius: width * 0.035,
        alignItems: 'center',
        paddingVertical: height * 0.018,
        paddingHorizontal: width * 0.1,
    },
    googleBtnInner: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    googleText: {
        color: '#fff',
        marginLeft: width * 0.025,
        fontSize: width * 0.032,
        fontFamily: 'Inter-Medium',
    },
    appleBtn: {
        marginLeft: width * 0.015,
        borderWidth: 2,
        borderColor: '#003145',
        height: width * 0.15,
        width: width * 0.15,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(13,25,35,0.1)',
    },
    socialIcon: {
        width: width * 0.05,
        height: width * 0.05,
        resizeMode: 'contain',
    },
    footer: {
        color: '#ccc',
        marginTop: height * 0.04,
        marginBottom: height * 0.05,
        fontFamily: 'Inter-Medium',
        fontSize: width * 0.03,
    },
    link: {
        color: theme.primaryColor,
    },
});

export default SignUp;