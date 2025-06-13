import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image,
    ImageBackground, ScrollView, Pressable, Alert, TouchableWithoutFeedback,
    KeyboardAvoidingView, Keyboard, Platform
} from 'react-native';
import { bg, userLock, G, eyeClose } from '../../../assets/images';
import theme from '../../../themes/theme';
import LinearGradient from 'react-native-linear-gradient';
import CustomInput from '../../../components/CustomInput';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { loginUser } from '../../../redux/slice/authSlice'; // ✅ correct
import loginApi from '../../../functions/auth';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
    const dispatch = useDispatch();
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

            // 🌐 Call the actual API
            const data = await loginApi(username, password); // assuming username = email

            // ✅ Dispatch login info to Redux
            await dispatch(loginUser({
                token: data.token,
                user: data.user,
                themeType: 'dark', // adjust as needed
            }));

            // Optional: redirect depending on profiling
            // navigation.replace("GenderScreen"); // if needed, remove and let AppNavContainer handle it

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
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
                <ImageBackground source={bg} style={styles.container}>
                    <Image source={userLock} style={styles.image} />
                    <ScrollView contentContainerStyle={{ alignItems: "center" }} style={styles.bottomcontainer}>
                        <Pressable onPress={() => navigation.navigate("WithdrawScreen")}>
                            <Text style={styles.title}>Login</Text>
                        </Pressable>
                        <Text style={styles.subtitle}>Welcome back, we missed you</Text>

                        <CustomInput
                            label="Username"
                            placeholder="Enter your username"
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

                        <TouchableOpacity style={styles.forgot} onPress={() => navigation.navigate("ForgotPassword")}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, { opacity: loading ? 0.7 : 1 }]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? "Signing in..." : "Sign in"}
                            </Text>
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

                        <LinearGradient
                            start={{ x: 0.0, y: 0.95 }} end={{ x: 1.0, y: 1.0 }}
                            colors={['rgba(255, 255, 255, 0.16)', 'rgba(204, 204, 204, 0)']}
                            style={styles.googleBtn}
                        >
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={G} style={{ width: 20, height: 20, resizeMode: "contain" }} />
                                <Text style={styles.googleText}>Continue with Google</Text>
                            </TouchableOpacity>
                        </LinearGradient>

                        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
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
    // (Same as yours – no changes made here)
    container: { flex: 1, width: "100%", backgroundColor: '#010b13', alignItems: 'center' },
    bottomcontainer: {
        flex: 1,
        backgroundColor: theme.darkBlue,
        width: "100.5%",
        paddingHorizontal: 43,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
        marginTop: 25,
    },
    image: { width: 134, height: 134, resizeMode: 'contain', marginTop: 30 },
    title: { fontSize: 28, color: '#EFEFEF', fontFamily: "Inter-SemiBold", marginTop: 25, marginBottom: 8 },
    subtitle: { color: '#FFFFFF', fontSize: 12, fontFamily: "Inter-Regular", textAlign: 'center', marginBottom: 25 },
    forgot: { alignSelf: 'flex-end', marginBottom: 20 },
    forgotText: { color: '#FFFFFF', fontSize: 11, fontFamily: "Inter-Medium" },
    button: {
        backgroundColor: theme.primaryColor,
        width: '100%',
        padding: 15,
        borderRadius: 14,
        marginTop: 20,
        alignItems: 'center'
    },
    buttonText: { color: '#fff', fontSize: 17, fontWeight: '600', fontFamily: "Inter-SemiBold" },
    orContainer: {
        marginVertical: 28,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    Line: { flex: 1, height: 0.8 },
    or: {
        fontFamily: "Inter-Regular",
        color: '#ccc',
        fontSize: 12,
        marginHorizontal: 10,
    },
    googleBtn: {
        flexDirection: 'row',
        borderWidth: 0.3,
        borderColor: "#B6B6B6",
        borderRadius: 14,
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 40
    },
    googleText: { color: '#fff', marginLeft: 10, fontFamily: "Inter-Medium" },
    footer: { color: '#ccc', marginTop: 33, marginBottom: 40, fontFamily: "Inter-Regular", fontSize: 12 },
    link: { color: theme.primaryColor },
});

export default LoginScreen;
