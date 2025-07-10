import React, { useState, useContext } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image,
    ImageBackground, ScrollView, Pressable, Modal, KeyboardAvoidingView, Platform,
    TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import { bg, login as userLock, G, eyeClose, applePay, tick, fail } from '../../../assets/images';
import themeBase from '../../../themes/theme';
import { ThemeContext } from '../../../context/ThemeProvider';
import LinearGradient from 'react-native-linear-gradient';
import CustomInput from '../../../components/CustomInput';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { loginUser } from '../../../redux/slice/authSlice';
import loginApi from '../../../functions/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Snackbar from 'react-native-snackbar';
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID, GOOGLE_ANDROID_CLIENT_ID } from '@env';
import ConfirmationModal from '../../../components/ConfirmationModal';

GoogleSignin.configure({
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    scopes: ['profile', 'email'],
});

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const { theme } = useContext(ThemeContext);
    const pendingDeepLink = route?.params?.pendingDeepLink;
    const [confirmation, setConfirmation] = useState({
        visible: false,
        title: '',
        message: '',
        icon: fail, // or tick.success
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const showConfirmationModal = ({ title, message, icon }) => {
        setConfirmation({
            visible: true,
            title,
            message,
            icon,
        });
    };

    const handleLogin = async () => {
        if (!username || !password) {
            setShowModal(true);
            return;
        }

        try {
            setLoading(true);
            dispatch(startLoading());

            const data = await loginApi(username, password);

            // ✅ FIRST: Check if pending deep link
            if (pendingDeepLink) {
                await dispatch(loginUser({ token: data.token, user: data.user, themeType: 'dark' }));
                navigation.replace('CourseDeepLink', {
                    courseId: pendingDeepLink.courseId,
                    affiliateToken: pendingDeepLink.token,
                });
            }

            // ❌ THEN: Check onboarding
            else if (Array.isArray(data.user?.onboarding) && data.user.questionnaireAnswers.length === 0) {
                navigation.replace("GenderScreen", {
                    user: data.user,
                    token: data.token,
                });
            }

            // ✅ Otherwise: Go to MainFlow
            else {
                await dispatch(loginUser({ token: data.token, user: data.user, themeType: 'dark' }));
                navigation.replace('MainFlow');
            }
        } catch (error) {
            showConfirmationModal({
                title: 'Login Failed',
                message: 'Please check your credentials and try again.',
                icon: tick.fail,
            });
            console.error("Login error:", error);
        } finally {
            setLoading(false);
            dispatch(stopLoading());
        }
    };


    const googleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            await GoogleSignin.signOut();
            await new Promise(resolve => setTimeout(resolve, 200));
            const response = await GoogleSignin.signIn();
            console.log('Google login response:', response);
        } catch (error) {
            const message = {
                [statusCodes.SIGN_IN_CANCELLED]: 'Sign-in cancelled.',
                [statusCodes.IN_PROGRESS]: 'Sign-in already in progress.',
                [statusCodes.PLAY_SERVICES_NOT_AVAILABLE]: 'Play Services not available.',
            }[error.code] || 'Google Sign-In failed.';

            Snackbar.show({
                text: message,
                duration: 3000,
                backgroundColor: '#010b13',
                textColor: '#fff',
            });
        }
    };

    return (
        <>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles(theme).container}>
                    <ImageBackground source={theme.bg} style={styles(theme).container}>
                        <Image source={userLock} style={styles(theme).image} />

                        <ScrollView contentContainerStyle={styles(theme).scrollContent} style={styles(theme).bottomcontainer}>
                            <Text style={styles(theme).title}>Login</Text>
                            <Text style={styles(theme).subtitle}>Welcome back, we missed you</Text>

                            <CustomInput
                                label="Email"
                                placeholder="Email Address"
                                value={username}
                                onChangeText={setUsername}
                            />

                            <CustomInput
                                label="Password"
                                placeholder="Enter your password"
                                secureTextEntry={!passwordVisible}
                                value={password}
                                onChangeText={setPassword}
                                icon={eyeClose}
                                onIconPress={() => setPasswordVisible(!passwordVisible)}
                            />

                            <TouchableOpacity style={styles(theme).forgot} onPress={() => navigation.navigate('ForgotPassword')}>
                                <Text style={styles(theme).forgotText}>Forgot Password?</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles(theme).button, { opacity: loading ? 0.7 : 1 }]}
                                onPress={handleLogin}
                                disabled={loading}
                            >
                                <Text style={styles(theme).buttonText}>{loading ? 'Signing in...' : 'Sign in'}</Text>
                            </TouchableOpacity>

                            <View style={styles(theme).orContainer}>
                                <LinearGradient colors={['rgba(204,204,204,0.07)', 'rgba(255,255,255,0.32)']} style={styles(theme).Line} />
                                <Text style={styles(theme).or}>Or continue with</Text>
                                <LinearGradient colors={['rgba(255,255,255,0.32)', 'rgba(204,204,204,0.07)']} style={styles(theme).Line} />
                            </View>

                            <View style={styles(theme).row}>
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.16)', 'rgba(204,204,204,0)']}
                                    style={styles(theme).googleBtn}
                                >
                                    <TouchableOpacity onPress={googleSignIn} style={styles(theme).googleBtnInner}>
                                        <Image source={G} style={styles(theme).socialIcon} />
                                        <Text style={styles(theme).googleText}>Continue with Google</Text>
                                    </TouchableOpacity>
                                </LinearGradient>

                                <TouchableOpacity style={styles(theme).appleBtn}>
                                    <Image source={applePay} style={styles(theme).socialIcon} />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                <Text style={styles(theme).footer}>
                                    Don't have an account? <Text style={styles(theme).link}>Sign up here!</Text>
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </ImageBackground>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>

            {confirmation.visible && <ConfirmationModal
                visible={confirmation.visible}
                title={confirmation.title}
                message={confirmation.message}
                icon={confirmation.icon}
                onClose={() => setConfirmation(prev => ({ ...prev, visible: false }))}
            />}



        </>
    );
};

const styles = (theme) => StyleSheet.create({
    container: { flex: 1, width: '100%', backgroundColor: theme.bgColor, alignItems: 'center' },
    bottomcontainer: {
        flex: 1, width, paddingHorizontal: width * 0.1,
        borderTopLeftRadius: width * 0.08,
        borderTopRightRadius: width * 0.08,
        overflow: 'hidden', marginTop: height * 0.03
    },
    scrollContent: { alignItems: 'center' },
    image: { width: width * 0.45, height: height * 0.2, resizeMode: 'contain', marginTop: height * 0.01 },
    title: { fontSize: width * 0.07, color: theme.textColor, fontFamily: 'Inter-SemiBold', marginBottom: height * 0.01 },
    subtitle: { color: theme.subTextColor, fontSize: width * 0.03, fontFamily: 'Inter-Regular', marginBottom: height * 0.03 },
    forgot: { alignSelf: 'flex-end', marginBottom: height * 0.02 },
    forgotText: { color: theme.textColor, fontSize: width * 0.028, fontFamily: 'Inter-Medium' },
    button: {
        backgroundColor: theme.primaryColor, width: '100%',
        paddingVertical: height * 0.02, borderRadius: width * 0.035,
        marginTop: height * 0.025, alignItems: 'center'
    },
    buttonText: { color: '#fff', fontSize: width * 0.04, fontFamily: 'Inter-SemiBold' },
    orContainer: { marginVertical: height * 0.035, flexDirection: 'row', alignItems: 'center' },
    Line: { flex: 1, height: 0.8, backgroundColor: '#ccc' },
    or: { fontFamily: 'Inter-Medium', color: theme.subTextColor, fontSize: width * 0.03, marginHorizontal: width * 0.025 },
    row: { flexDirection: 'row' },
    googleBtn: {
        flexDirection: 'row', borderWidth: 0.5, borderColor: '#B6B6B6',
        borderRadius: width * 0.035, alignItems: 'center', height: height * 0.065,
        justifyContent: 'center', flexGrow: 1
    },
    googleBtnInner: { flexDirection: 'row', alignItems: 'center' },
    googleText: { color: theme.textColor, marginLeft: width * 0.025, fontSize: width * 0.032, fontFamily: 'Inter-Medium' },
    appleBtn: {
        marginLeft: width * 0.015, borderWidth: 2, borderColor: '#003145',
        height: height * 0.065, width: height * 0.065, borderRadius: 100,
        justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(13,25,35,0.1)'
    },
    socialIcon: { width: width * 0.05, height: width * 0.05, resizeMode: 'contain' },
    footer: { color: '#ccc', marginTop: height * 0.04, marginBottom: height * 0.05, fontFamily: 'Inter-Medium', fontSize: width * 0.03 },
    link: { color: theme.primaryColor },

    modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: theme.bgColor, padding: 25, borderRadius: 15, alignItems: 'center' },
    modalTitle: { color: theme.textColor, fontSize: 18, fontFamily: 'Inter-SemiBold', marginBottom: 10 },
    modalText: { color: theme.subTextColor, fontSize: 14, textAlign: 'center', marginBottom: 20 },
    modalButton: { backgroundColor: theme.primaryColor, paddingHorizontal: 30, paddingVertical: 10, borderRadius: 10 },
    modalButtonText: { color: '#fff', fontSize: 14, fontFamily: 'Inter-Medium' }
});

export default LoginScreen;
