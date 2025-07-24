import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ImageBackground,
} from 'react-native';
import theme from '../../../themes/theme';
import { resetPassword } from '../../../functions/passwordService';
import CustomInput from '../../../components/CustomInput';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import ConfirmationModal from '../../../components/ConfirmationModal';
import SnackbarMessage from '../../../functions/SnackbarMessage';
import { fail, success, tick } from '../../../assets/images';

const { width } = Dimensions.get('window');

const ResetPassword = ({ navigation, route }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordVisible2, setPasswordVisible2] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalText, setModalText] = useState('');
    const [modalIcon, setModalcon] = useState(null);

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('error'); // 'success' or 'error'

    const dispatch = useDispatch();
    const token = route.params?.token || '';

    const showSnackbar = (message, type = 'error') => {
        setSnackbarMessage(message);
        setSnackbarType(type);
        setSnackbarVisible(true);
        setTimeout(() => setSnackbarVisible(false), 3000);
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            showSnackbar('Passwords do not match!');
            return;
        }

        if (!token) {
            showSnackbar('Reset token is missing. Please try again.');
            navigation.navigate('ForgotPassword');
            return;
        }

        try {
            dispatch(startLoading());
            const response = await resetPassword(token, newPassword);
            dispatch(stopLoading());
            setModalText('Your password has been reset successfully!');
            setModalVisible(true);
            setModalcon(tick);
        } catch (error) {
            dispatch(stopLoading());
            console.error('Error resetting password:', error);
            setModalText('Failed to reset password. Please try again.');
            setModalcon(fail);
            setModalVisible(true);
        }
    };

    const handleModalClose = () => {
        setModalVisible(false);
        if (modalText.includes('successfully')) {
            navigation.navigate('Login');
        }
    };

    return (
        <ImageBackground style={styles.container}>
            <View style={styles.bottomcontainer}>
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>Create your new password</Text>

                <CustomInput
                    label="New Password"
                    placeholder="New Password"
                    secureTextEntry={!passwordVisible}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    onIconPress={() => setPasswordVisible(!passwordVisible)}
                />

                <CustomInput
                    label="Confirm New Password"
                    placeholder="Confirm New Password"
                    secureTextEntry={!passwordVisible2}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onIconPress={() => setPasswordVisible2(!passwordVisible2)}
                />

                <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            </View>

            {modalVisible &&
                <ConfirmationModal
                    visible={modalVisible}
                    message={modalText}
                    icon={modalIcon}
                    onClose={handleModalClose}
                />}

            <SnackbarMessage
                visible={snackbarVisible}
                message={snackbarMessage}
                type={snackbarType}
            />
        </ImageBackground>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#010b13', alignItems: 'center', },
    bottomcontainer: {
        flex: 1,
        backgroundColor: theme.darkBlue,
        width: "100.5%",
        paddingHorizontal: 43,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 25,
    },
    image: { width: 134, height: 134, resizeMode: 'contain', marginTop: 30 },
    title: { fontSize: 28, color: '#EFEFEF', fontFamily: "Inter-SemiBold", marginTop: 25, marginBottom: 8, },
    subtitle: { color: '#FFFFFF', fontSize: 14, marginBottom: 25, fontFamily: "Inter-Medium", textAlign: 'center', marginBottom: 25 },
    passwordContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    input: {
        width: '100%',
        flex: 1, // Ensures input fills the available space
        backgroundColor: "#0d151e",
        color: '#fff',
        fontFamily: "Inter-Regular",
        borderRadius: 8,
        padding: 15,
        borderWidth: 0.8,
        marginTop: 10,
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

export default ResetPassword;
