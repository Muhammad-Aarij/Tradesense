import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image, ImageBackground, ScrollView, Pressable, ActivityIndicator, Alert, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard } from 'react-native';
import { bg, userLock, G, eyeClose } from '../../../assets/images';
import theme from '../../../themes/theme'
import LinearGradient from 'react-native-linear-gradient';
import CustomInput from '../../../components/CustomInput';
import loginUser from '../../../functions/auth';
import { useGoogleSignIn } from '../../../functions/handleGoogleLogin';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
    // const { signInWithGoogle } = useGoogleSignIn(); // ✅ Hook is called here

    const dispatch = useDispatch();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            dispatch(startLoading());
            console.log("Function Called");
            const userData = await loginUser(username, password);
            dispatch(stopLoading());
            navigation.navigate("GenderScreen");
        } catch (error) {
            dispatch(stopLoading());
            Alert.alert("Login failed. Please check your username and password.");
            console.log("Error logging in:", error);
        }
    };




    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
                <ImageBackground source={bg} style={styles.container}>
                    <Image source={userLock} style={styles.image} />
                    <ScrollView contentContainerStyle={{ alignItems: "center" }} style={styles.bottomcontainer}>
                        <Text style={styles.title}>Login</Text>
                        <Text style={styles.subtitle}>welcome back we missed you</Text>
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
                            icon={passwordVisible ? eyeClose : eyeClose}
                            onIconPress={() => setPasswordVisible(!passwordVisible)}
                        />

                        <TouchableOpacity style={styles.forgot} onPress={() => navigation.navigate("ForgotPassword")}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => handleLogin()}>
                            <Text style={styles.buttonText}>Sign in</Text>
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
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} >
                                <Image source={G} style={{ width: 20, height: 20, resizeMode: "contain" }} />
                                <Text style={styles.googleText}>Continue with Google</Text>
                            </TouchableOpacity>

                        </LinearGradient>
                        <TouchableOpacity onPress={() => navigation.navigate("Signup")} >
                            <Text style={styles.footer}>Don't have any account? <Text style={styles.link}>Sign up here!</Text></Text>
                        </TouchableOpacity>
                    </ScrollView>
                </ImageBackground>
            </KeyboardAvoidingView >
        </TouchableWithoutFeedback >
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, width: "100%", backgroundColor: '#010b13', alignItems: 'center', },
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
    title: { fontSize: 28, color: '#EFEFEF', fontFamily: "Inter-SemiBold", marginTop: 25, marginBottom: 8, },
    subtitle: { color: '#FFFFFF', fontSize: 12, marginBottom: 25, fontFamily: "Inter-Regular", width: "100%", textAlign: 'center', marginBottom: 25 },
    passwordContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    input: {
        width: '100%',
        flex: 1, // Ensures input fills the available space
        color: '#fff',
        fontFamily: "Inter-Regular",
        borderRadius: 8,
        padding: 15,
        marginTop: 10,
        borderWidth: 0.8,
        backgroundColor: "#0d151e",
        borderColor: theme.borderColor,
        paddingRight: 40, // Adds space for the eye icon
    },
    inputsimple: { width: '100%', backgroundColor: "#0d151e", color: '#fff', fontFamily: "Inter-Regular", borderRadius: 8, padding: 15, marginTop: 10, borderWidth: 0.8, borderColor: theme.borderColor, justifyContent: "space-between", flexDirection: "row", height: 50, },
    eyeButton: {
        position: "absolute",
        right: 15, // Positions eye icon inside the input field
        padding: 5,
    },
    eyeIcon: {
        width: 20,
        height: 20,
        tintColor: "#aaa",
    },
    forgot: { alignSelf: 'flex-end', marginBottom: 20 },
    forgotText: { color: '#FFFFFF', fontSize: 11, fontFamily: "Inter-Medium", },
    label: { fontFamily: "Inter-Medium", width: "100%", textAlign: "left", color: '#FFFFFF', fontSize: 13, marginTop: 17, marginBottom: 5 },
    button: {
        backgroundColor: theme.primaryColor, width: '100%',
        padding: 15, borderRadius: 14, marginTop: 20, alignItems: 'center'
    },
    buttonText: { color: '#fff', fontSize: 17, fontWeight: '600', fontFamily: "Inter-SemiBold", },
    orContainer: {
        marginVertical: 28,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    Line: {
        flex: 1,  // Makes each line take up equal available space
        height: 0.8,
    },
    or: {
        fontFamily: "Inter-Regular",
        color: '#ccc',
        fontSize: 12,
        marginHorizontal: 10, // Adds spacing between the lines and text
    },

    googleBtn: {
        flexDirection: 'row', borderWidth: 0.3, borderColor: "#B6B6B6", borderRadius: 14,
        alignItems: 'center', paddingVertical: 15, paddingHorizontal: 40
    },
    googleText: { color: '#fff', marginLeft: 10, fontFamily: "Inter-Medium", },
    footer: { color: '#ccc', marginTop: 33, marginBottom: 40, fontFamily: "Inter-Regular", fontSize: 12, },
    link: { color: theme.primaryColor },
});

export default LoginScreen;
