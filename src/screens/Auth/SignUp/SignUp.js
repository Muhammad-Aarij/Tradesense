import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image,
    ImageBackground,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
} from 'react-native';
import { bg, G, eyeClose, secureUser, applePay, tick } from '../../../assets/images';
import LinearGradient from 'react-native-linear-gradient';
import CustomInput from '../../../components/CustomInput';
import { sendOTP } from '../../../functions/otpService';
import validateUser from '../../../functions/validateUser';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { ThemeContext } from '../../../context/ThemeProvider';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { setProfilingDone } from '../../../redux/slice/authSlice';
import { googleLoginApi } from '../../../functions/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import SnackbarMessage from '../../../functions/SnackbarMessage';

const { width, height } = Dimensions.get('window');

const SignUp = ({ navigation }) => {
    const dispatch = useDispatch();
    const { theme, isDarkMode } = useContext(ThemeContext);

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordVisible2, setPasswordVisible2] = useState(false);
    const [name, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalIcon, setModalIcon] = useState(null);

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('error');

    const showSnackbar = (message, type = 'error') => {
        setSnackbarMessage(message);
        setSnackbarType(type);
        setSnackbarVisible(true);
        setTimeout(() => setSnackbarVisible(false), 3000);
    };


    GoogleSignin.configure({
        webClientId: "719765624558-bl0hf7hi55squfiqi4eiv4ockm0css0s.apps.googleusercontent.com",
        iosClientId: "719765624558-q8auutbabdfgqjiscmcd16vm7673h6v0.apps.googleusercontent.com",
        scopes: ['profile', 'email'],
        offlineAccess: true,
    });

    const googleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            await GoogleSignin.signOut();
            await new Promise(resolve => setTimeout(resolve, 200));
            const response = await GoogleSignin.signIn();
            console.log('Google Sign-In raw response:', JSON.stringify(response, null, 2));
            dispatch(startLoading());

            // Extract google user details (defensive in case structure changes)
            const googleUser = response?.user || response?.data?.user || response;
            console.log('Parsed googleUser to be sent to backend:', JSON.stringify(googleUser, null, 2));

            const data = await googleLoginApi(googleUser);
            const answers = data.existingUser?.questionnaireAnswers;

            const isProfilingPending =
                !answers ||
                (typeof answers === 'object' && Object.keys(answers).length === 0) ||
                (typeof answers === 'object' && Object.values(answers).every(arr => Array.isArray(arr) && arr.length === 0));

            await dispatch(loginUser({ token: data.token, user: data.existingUser, themeType: 'dark' }));

            if (pendingDeepLink) {
                if (!isProfilingPending) dispatch(setProfilingDone(true));
                navigation.replace('CourseDeepLink', {
                    courseId: pendingDeepLink.courseId,
                    affiliateToken: pendingDeepLink.token,
                });
            } else if (isProfilingPending) {
                console.log('data.user++++>>>>> in login', data.existingUser);
                console.log('data.token++++>>>>> in login', data.token);
                navigation.replace("GenderScreen", {
                    user: data.existingUser,
                    token: data.token,
                });
            } else {
                dispatch(setProfilingDone(true));
                navigation.replace('MainFlow');
            }

        } catch (error) {
            console.error("Google Sign-In error:", error.response.data);

            const message = {
                [statusCodes.SIGN_IN_CANCELLED]: 'Sign-in cancelled.',
                [statusCodes.IN_PROGRESS]: 'Sign-in already in progress.',
                [statusCodes.PLAY_SERVICES_NOT_AVAILABLE]: 'Play Services not available.',
            }[error.code] || 'Google Sign-In failed.';

            Snackbar.show({
                text: message,
                duration: 3000,
                backgroundColor: '#010b13b6',
                textColor: '#fff',
            });
        } finally {
            dispatch(stopLoading());
        }
    };

    const showConfirmationModal = ({ title, message, icon }) => {
        setModalTitle(title);
        setModalMessage(message);
        setModalIcon(icon);
        setModalVisible(true);
    };

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const isValidNumber = (number) => {
        const regex = /^[0-9]{10,15}$/; // adjust length based on your needs
        return regex.test(number);
    };


    const handleSignUp = async () => {
        if (!name || !phone || !email || !password || !confirmPassword) {
            showSnackbar("Please fill all fields.");
            return;
        }

        if (!/^\d{10,15}$/.test(phone)) {
            showSnackbar("Phone number must be 10 to 15 digits.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showSnackbar("Invalid email format.");
            return;
        }

        if (password.length < 6) {
            showSnackbar("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            showSnackbar("Passwords do not match.");
            return;
        }

        const userData = { name, phone, email, password, role: 'user' };

        try {
            dispatch(startLoading());

            try {
                await validateUser(email, phone);
            } catch (validationError) {
                dispatch(stopLoading());
                const errorMessage = validationError?.response?.data?.message || 'User validation failed';

                if (errorMessage.includes('email') && errorMessage.includes('phone')) {
                    showConfirmationModal({
                        title: 'User Already Exists',
                        message: 'An account with this email and phone number already exists.',
                        icon: tick.fail,
                    });
                } else if (errorMessage.includes('email')) {
                    showConfirmationModal({
                        title: 'Email Already Exists',
                        message: 'An account with this email already exists.',
                        icon: tick.fail,
                    });
                } else if (errorMessage.includes('phone')) {
                    showConfirmationModal({
                        title: 'Phone Already Exists',
                        message: 'An account with this phone number already exists.',
                        icon: tick.fail,
                    });
                } else {
                    showConfirmationModal({
                        title: 'Validation Error',
                        message: errorMessage,
                        icon: tick.fail,
                    });
                }

                return;
            }

            const response = await sendOTP(email, true);
            dispatch(stopLoading());

            if (response) {
                navigation.navigate('EmailVerification', {
                    email,
                    userData,
                    status: 'register',
                });
            } else {
                showConfirmationModal({
                    title: 'OTP Failed',
                    message: 'OTP confirmation failed. Please try again.',
                    icon: tick.fail,
                });
            }
        } catch (error) {
            dispatch(stopLoading());
            const serverMessage = error?.response?.data?.message || 'Something went wrong. Please try again.';
            showConfirmationModal({
                title: 'Error',
                message: serverMessage,
                icon: tick.fail,
            });
        }
    };


    return (
        <ImageBackground source={theme.bg} style={[styles.container, { backgroundColor: theme.bg }]}>
            <SafeAreaView style={{ flex: 1 }}>
                {modalVisible &&
                    <ConfirmationModal
                        visible={modalVisible}
                        title={modalTitle}
                        message={modalMessage}
                        icon={modalIcon}
                        onClose={() => setModalVisible(false)}
                    />}

                <SnackbarMessage
                    visible={snackbarVisible}
                    message={snackbarMessage}
                    type={snackbarType}
                />


                <KeyboardAvoidingView
                    style={styles.keyboardAvoiding}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <Image source={secureUser} style={styles.image} />

                        <View style={[styles.bottomcontainer, { backgroundColor: isDarkMode ? theme.isDarkMode : 'white' }]}>
                            <Text style={[styles.title, { color: theme.textColor }]}>Register Now</Text>
                            <Text style={[styles.subtitle, { color: theme.subTextColor }]}>Create a new account</Text>

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

                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: theme.primaryColor }]}
                                onPress={handleSignUp}
                            >
                                <Text style={styles.buttonText}>Sign Up</Text>
                            </TouchableOpacity>

                            <View style={styles.orContainer}>
                                <LinearGradient
                                    start={{ x: 0.0, y: 0.95 }}
                                    end={{ x: 1.0, y: 1.0 }}
                                    colors={['rgba(204, 204, 204, 0.07)', 'rgba(255, 255, 255, 0.32)']}
                                    style={styles.Line}
                                />
                                <Text style={[styles.or, { color: theme.subTextColor }]}>Or continue with</Text>
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
                                    <TouchableOpacity onPress={googleSignIn} style={styles.googleBtnInner}
                                    >
                                        <Image source={G} style={styles.socialIcon} />
                                        <Text style={[styles.googleText, { color: theme.textColor }]}>Continue with Google</Text>
                                    </TouchableOpacity>
                                </LinearGradient>

                                <TouchableOpacity style={styles.appleBtn}>
                                    <Image source={applePay} style={styles.socialIcon} />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={[styles.footer, { color: theme.subTextColor }]}>
                                    Already have an account? <Text style={[styles.link, { color: theme.primaryColor }]}>Sign In</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView >
        </ImageBackground>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        fontSize: width * 0.06,
        fontFamily: 'Outfit-SemiBold',
        marginTop: height * 0.03,
        marginBottom: height * 0.01,
    },
    subtitle: {
        fontSize: width * 0.03,
        fontFamily: 'Outfit-Medium',
        width: width * 0.5,
        textAlign: 'center',
        marginBottom: height * 0.025,
    },
    button: {
        width: '100%',
        paddingVertical: height * 0.02,
        borderRadius: width * 0.035,
        marginTop: height * 0.025,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: width * 0.035,
        fontWeight: '600',
        fontFamily: 'Outfit-SemiBold',
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
        fontFamily: 'Outfit-Medium',
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
        marginLeft: width * 0.025,
        fontSize: width * 0.032,
        fontFamily: 'Outfit-Medium',
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
        marginTop: height * 0.04,
        // marginBottom: height * 0.05,
        fontFamily: 'Outfit-Medium',
        fontSize: width * 0.03,
    },
    link: {
        fontFamily: 'Outfit-Medium',
    },
});

export default SignUp;
