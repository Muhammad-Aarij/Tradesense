import React, { useState, useContext, useEffect } from 'react';
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
import { loginUser, setProfilingDone } from '../../../redux/slice/authSlice';
import { loginApi, googleLoginApi, appleLoginApi } from '../../../functions/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Snackbar from 'react-native-snackbar';
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID, GOOGLE_ANDROID_CLIENT_ID } from '@env';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { decode as atob } from 'base-64';


// GoogleSignin.configure({
//     webClientId: GOOGLE_WEB_CLIENT_ID,
//     iosClientId: GOOGLE_IOS_CLIENT_ID,
//     scopes: ['profile', 'email'],
//     offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
// });
GoogleSignin.configure({
    webClientId: "719765624558-bl0hf7hi55squfiqi4eiv4ockm0css0s.apps.googleusercontent.com",
    iosClientId: "719765624558-q8auutbabdfgqjiscmcd16vm7673h6v0.apps.googleusercontent.com",
    scopes: ['profile', 'email'],
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
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

    // useEffect(() => {
    //     dispatch(startLoading());
    //     return () => {
    //         dispatch(stopLoading());
    //     };
    // }, []);

    const handleLogin = async () => {
        if (!username || !password) {
            setShowModal(true);
            return;
        }

        try {
            setLoading(true);
            dispatch(startLoading());
            console.log('username++++>>>>> in login', username);
            const data = await loginApi(username, password);
            const answers = data.user?.questionnaireAnswers;
            // console.log(data.user);
            const isProfilingPending = !answers || // undefined/null
                (typeof answers === 'object' &&
                    Object.keys(answers).length === 0) || // empty object
                (typeof answers === 'object' &&
                    Object.values(answers).every(arr => Array.isArray(arr) && arr.length === 0)); // all arrays empty

            // ✅ FIRST: Check if pending deep link
            if (pendingDeepLink) {
                await dispatch(loginUser({ token: data.token, user: data.user, themeType: 'dark' }));
                if (!isProfilingPending) {
                    dispatch(setProfilingDone(true));
                }
                navigation.replace('CourseDeepLink', {
                    courseId: pendingDeepLink.courseId,
                    affiliateToken: pendingDeepLink.token,
                });
            }
            else if (isProfilingPending) {

                console.log("Profiling Pending → Navigating to GenderScreen");
                navigation.replace("GenderScreen", {
                    user: data.user,
                    token: data.token,
                });
            }
            else {
                await dispatch(loginUser({ token: data.token, user: data.user, themeType: 'dark' }));
                dispatch(setProfilingDone(true));
                console.log("Navigating to MainFlow");
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
            console.log('Google Sign-In raw response:', JSON.stringify(response, null, 2));
            if (response.data.user && response.data.user.email) {
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
            }
            else{
                return;
            }

        } catch (error) {
            console.error("Google Sign-In error:", error.response?.data || error.message || error);

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

    async function AppleLogin() {
        try {
            const authRes = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
            });

            console.log('Apple login response:', authRes);

            const credentialState = await appleAuth.getCredentialStateForUser(authRes.user);
            console.log('Credential state:', credentialState);

            if (authRes.identityToken) {
                console.log('Apple login successful - proceeding with identity token');
                const jwtParts = authRes.identityToken.split('.');
                if (jwtParts.length === 3) {
                    try {
                        const base64Payload = jwtParts[1].replace(/-/g, '+').replace(/_/g, '/');
                        const paddedPayload = base64Payload.padEnd(
                            base64Payload.length + (4 - (base64Payload.length % 4)) % 4,
                            '='
                        );

                        const decodedData = atob(paddedPayload);
                        const payload = JSON.parse(decodedData);

                        console.log('Decoded JWT payload:', payload);

                        // Extract email and user ID from JWT or authRes
                        const email = payload.email || authRes.email;
                        const userId = payload.sub;

                        console.log('Extracted email:', email);
                        console.log('Extracted user ID:', userId);

                        // Store the email in the authRes object for use in SocialLogin
                        authRes.email = email;

                        // Store user information in AsyncStorage
                        try {
                            const data = await appleLoginApi(authRes);
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
                            console.error('Error in apple login:', error.response?.data || error.message || error);
                        }
                    } catch (decodeError) {
                        console.error('Error decoding JWT:', decodeError);
                        // Use email from authRes if JWT decoding fails
                        if (authRes.email) {
                            console.log('Using email from authRes:', authRes.email);
                        }
                    }
                }

                // Proceed with social login if we have identity token (works on both simulator and device)
                // await SocialLogin('apple', authRes);

            } else {
                // Only show error if we don't have identity token
                console.log('No identity token received - authentication failed');
                throw new Error('Apple authentication failed - no identity token');
            }

            // setAppleData(authRes);

            if (authRes.email) {
                try {
                    // await AsyncStorage.setItem('appleData', authRes.email);
                    console.log('JSON data', authRes.email);
                } catch (error) {
                    console.error('Error saving data to Async Storage:', error);
                }
            }
        } catch (error) {
            console.error('Apple login error:', error);
            Snackbar.show({
                text: 'Apple login failed',
                duration: 3000,
                backgroundColor: colours.error,
                textColor: colours.black,
            });
        }
    }

    return (
        <>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles(theme).container}>
                    <ImageBackground source={theme.bg} style={styles(theme).container}>
                        <Image source={userLock} style={styles(theme).image} />

                        <ScrollView contentContainerStyle={styles(theme).scrollContent} style={styles(theme).bottomcontainer} bounces={false} showsVerticalScrollIndicator={false}>
                            <Text style={styles(theme).title}>Login</Text>
                            <Text style={styles(theme).subtitle}>Welcome back, we missed you.</Text>

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
                                <Text style={styles(theme).or}>or continue with</Text>
                                <LinearGradient colors={['rgba(255,255,255,0.32)', 'rgba(204,204,204,0.07)']} style={styles(theme).Line} />
                            </View>

                            <View style={styles(theme).row}>
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.10)', 'rgba(204,204,204,0)']}
                                    style={styles(theme).googleBtn}
                                >
                                    <TouchableOpacity onPress={googleSignIn} style={styles(theme).googleBtnInner}>
                                        <Text style={styles(theme).googleText}>Continue with   </Text>
                                        <Image source={G} style={styles(theme).socialIcon} />
                                    </TouchableOpacity>
                                </LinearGradient>
                                {Platform.OS === 'ios' && (
                                    <>
                                        <View style={{ width: width * 0.025 }} />
                                        <LinearGradient
                                            colors={['rgba(255,255,255,0.10)', 'rgba(204,204,204,0)']}
                                            style={styles(theme).googleBtn}
                                        >
                                            <TouchableOpacity onPress={AppleLogin} style={styles(theme).googleBtnInner}>
                                                <Text style={styles(theme).googleText}>Continue with   </Text>
                                                <Image source={applePay} style={styles(theme).socialIcon} />
                                            </TouchableOpacity>
                                        </LinearGradient>
                                    </>
                                )}
                                {/* <TouchableOpacity 
                                onPress={AppleLogin}
                                style={styles(theme).appleBtn}>
                                    <Image source={applePay} style={styles(theme).socialIcon} />
                                </TouchableOpacity> */}
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