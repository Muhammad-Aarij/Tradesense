import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image,
    ImageBackground, ScrollView, Pressable, Alert, TouchableWithoutFeedback,
    KeyboardAvoidingView, Keyboard, Platform
} from 'react-native';
import { bg, login as userLock, G, eyeClose, applePay } from '../../../assets/images';
import theme from '../../../themes/theme';
import LinearGradient from 'react-native-linear-gradient';
import CustomInput from '../../../components/CustomInput';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { loginUser } from '../../../redux/slice/authSlice'; // ✅ correct
import loginApi from '../../../functions/auth';

const { width, height } = Dimensions.get('window');


const LoginScreen = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const pendingDeepLink = route?.params?.pendingDeepLink;

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // optional UI feedback

    const handleLogin = async () => {
        try {
            if (!username || !password) {
                Alert.alert("Please enter both username and password.");
                return;
            }

            setLoading(true);
            dispatch(startLoading());

            const data = await loginApi(username, password);

            if (Array.isArray(data.user?.onboarding) && data.user.onboarding.length === 0) {
                // 👣 Navigate to profiling stack
                navigation.replace("GenderScreen", {
                    user: data.user,
                    token: data.token,
                });
            } else {
                // ✅ User already profiled — proceed to Redux + home flow
                await dispatch(loginUser({ token: data.token, user: data.user, themeType: 'dark' }));
                if (pendingDeepLink) {
                    navigation.replace('CourseDeepLink', {
                        courseId: pendingDeepLink.courseId,
                        affiliateToken: pendingDeepLink.token
                    });
                } else {
                    navigation.replace('MainFlow');
                }
            }

        } catch (error) {
            Alert.alert("Login failed", "Please check your credentials and try again.");
            console.error("Login error:", error);
        } finally {
            setLoading(false);
            dispatch(stopLoading());
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                <ImageBackground source={bg} style={styles.container}>
                    <Image source={userLock} style={styles.image} />

                    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.bottomcontainer}>
                        <Pressable onPress={() => navigation.navigate('WithdrawScreen')}>
                            <Text style={styles.title}>Login</Text>
                        </Pressable>

                        <Text style={styles.subtitle}>Welcome back, we missed you</Text>

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

                        <TouchableOpacity style={styles.forgot} onPress={() => navigation.navigate('ForgotPassword')}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, { opacity: loading ? 0.7 : 1 }]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign in'}</Text>
                        </TouchableOpacity>

                        <View style={styles.orContainer}>
                            <LinearGradient
                                start={{ x: 0.0, y: 0.95 }} end={{ x: 1.0, y: 1.0 }}
                                colors={['rgba(204, 204, 204, 0.07)', 'rgba(255, 255, 255, 0.32)']}
                                style={styles.Line}
                            />
                            <Text style={styles.or}>Or continue with</Text>
                            <LinearGradient
                                start={{ x: 0.0, y: 0.95 }} end={{ x: 1.0, y: 1.0 }}
                                colors={['rgba(255, 255, 255, 0.32)', 'rgba(204, 204, 204, 0.07)']}
                                style={styles.Line}
                            />
                        </View>

                        <View style={styles.row}>
                            <LinearGradient
                                start={{ x: 0.0, y: 0.95 }} end={{ x: 1.0, y: 1.0 }}
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

                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={styles.footer}>
                                Don't have any account? <Text style={styles.link}>Sign up here!</Text>
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </ImageBackground>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#010b13',
        alignItems: 'center',
    },
    bottomcontainer: {
        flex: 1,
        width: width,
        paddingHorizontal: width * 0.1,
        borderTopLeftRadius: width * 0.08,
        borderTopRightRadius: width * 0.08,
        overflow: 'hidden',
        marginTop: height * 0.03,
    },
    scrollContent: {
        alignItems: 'center',
    },
    image: {
        width: width * 0.45,
        height: height * 0.2,
        resizeMode: 'contain',
        marginTop: height * 0.01,
    },
    title: {
        fontSize: width * 0.07,
        color: '#EFEFEF',
        fontFamily: 'Inter-SemiBold',
        marginBottom: height * 0.01,
    },
    subtitle: {
        color: '#FFFFFF',
        fontSize: width * 0.03,
        fontFamily: 'Inter-Regular',
        textAlign: 'center',
        marginBottom: height * 0.03,
    },
    forgot: {
        alignSelf: 'flex-end',
        marginBottom: height * 0.02,
    },
    forgotText: {
        color: '#FFFFFF',
        fontSize: width * 0.028,
        fontFamily: 'Inter-Medium',
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
    row: {
        flexDirection: 'row',
    },
    googleBtn: {
        flexDirection: 'row',
        borderWidth: 0.3,
        borderColor: '#B6B6B6',
        borderRadius: width * 0.035,
        alignItems: 'center',
        height: height * 0.065,
        justifyContent: 'center',
        flexGrow: 1,
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
        height: height * 0.065,
        width: height * 0.065,
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

export default LoginScreen;