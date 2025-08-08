import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Switch,
    ImageBackground,
    Dimensions,
    TextInput,
    Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { API_URL } from '@env';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import Header from '../../../components/Header';
import { ThemeContext } from '../../../context/ThemeProvider';
import { back, bg, fail, tick } from '../../../assets/images';
import { requestAccountDeletion } from '../../../functions/auth';

const { width, height } = Dimensions.get('window');
const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;

const AccountSecurityScreen = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const dispatch = useDispatch();
    const { userToken, userId } = useSelector(state => state.auth);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState('success');
    const [modalMessage, setModalMessage] = useState('');
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    const [isFactorAuthEnabled, setIsFactorAuthEnabled] = useState(true);

    // Correct state variables for each functionality
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showDeleteAccount, setShowDeleteAccount] = useState(false);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [deletionReason, setDeletionReason] = useState('');

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setIsKeyboardVisible(true);
        });

        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setIsKeyboardVisible(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const styles = getStyles(theme);

    const handleChangePassword = async () => {
        if (!newPassword || !confirmPassword) {
            setModalType('error');
            setModalMessage('Please fill in all fields.');
            setModalVisible(true);
            return;
        }

        if (newPassword !== confirmPassword) {
            setModalType('error');
            setModalMessage("Passwords don't match.");
            setModalVisible(true);
            return;
        }

        try {
            dispatch(startLoading());

            const response = await axios.patch(`${API_URL}/api/auth/forget-password/create/new`, {
                token: userToken,
                password: newPassword,
            });

            if (response.data?.message?.toLowerCase().includes('password updated')) {
                setModalType('success');
                setModalMessage('Password changed successfully!');
                setModalVisible(true);
                setNewPassword('');
                setConfirmPassword('');
                setShowChangePassword(false);
            } else {
                setModalType('error');
                setModalMessage(response.data?.message || 'Unexpected response.');
                setModalVisible(true);
            }

        } catch (error) {
            const errMsg = error?.response?.data?.message || "Failed to change password.";
            setModalType('error');
            setModalMessage(errMsg);
            setModalVisible(true);
        } finally {
            dispatch(stopLoading());
        }
    };


    const handleDeleteAccount = async () => {
        if (!deletionReason) {
            setModalType('error');
            setModalMessage('Please provide a reason for deleting your account.');
            setModalVisible(true);
            return;
        }

        try {
            dispatch(startLoading());

            const response = await requestAccountDeletion({
                userId: userId, // Make sure this is defined in your component
                reason: deletionReason,
            });

            if (response?.message?.toLowerCase().includes('deleted')) {
                setModalType('success');
                setModalMessage('Your account has been successfully deleted.');
                setModalVisible(true);
                setDeletionReason('');
                setShowDeleteAccount(false);
                // Optionally log out the user
                // dispatch(logout());
            } else {
                setModalType('error');
                setModalMessage(response?.message || 'Unexpected response.');
                setModalVisible(true);
            }
        } catch (error) {
            const errMsg = error?.response?.data?.message || "Failed to delete account.";
            setModalType('error');
            setModalMessage(errMsg);
            setModalVisible(true);
        } finally {
            dispatch(stopLoading());
        }
    };


    const ToggleItem = ({ text, description, isEnabled, onToggle }) => (
        <LinearGradient
            start={{ x: 0, y: 0.95 }}
            end={{ x: 1, y: 1 }}
            colors={['rgba(126, 126, 126, 0.12)', 'rgba(255,255,255,0)']}
            style={styles.securityItem}
        >
            <View style={styles.securityItemInner}>
                <View style={styles.securityTextContent}>
                    <Text style={styles.securityItemText}>{text}</Text>
                    {description && <Text style={styles.securityItemDescription}>{description}</Text>}
                </View>
                <Switch
                    trackColor={{ false: theme.borderColor, true: theme.primaryColor }}
                    thumbColor="white"
                    onValueChange={onToggle}
                    value={isEnabled}
                />
            </View>
        </LinearGradient>
    );

    const LinkItem = ({ text, onPress }) => (
        <TouchableOpacity onPress={onPress}>
            <LinearGradient
                start={{ x: 0, y: 0.95 }}
                end={{ x: 1, y: 1 }}
                colors={['rgba(126, 126, 126, 0.12)', 'rgba(255,255,255,0)']}
                style={styles.securityItem}
            >
                <View style={styles.securityItemInner}>
                    <Text style={styles.securityItemText}>{text}</Text>
                    <Image
                        source={back}
                        style={{
                            width: 10,
                            height: 10,
                            resizeMode: "contain",
                            transform: [{ rotate: "270deg" }],
                        }}
                    />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <ImageBackground source={theme.bg || bg} style={{ flex: 1 }}>
            <SafeAreaView style={styles.safeArea}>
                {modalVisible &&
                    <ConfirmationModal
                        visible={modalVisible} // Corrected prop name
                        title={modalType === 'success' ? 'Success' : 'Error'}
                        icon={modalType === 'success' ? tick : fail}
                        message={modalMessage}
                        onClose={() => setModalVisible(false)}
                    />
                }
                <View style={styles.container}>
                    <Header title="Account Settings" style={{ marginBottom: 20, }} />

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.securityOptionsContainer}>
                            <ToggleItem
                                text="Change Mode"
                                description="Light/Dark"
                                isEnabled={theme.mode === 'dark'}
                                onToggle={toggleTheme}
                            />

                            {/* Change Password Section */}
                            <LinkItem
                                text={showChangePassword ? 'Hide Password Fields' : 'Change Password'}
                                onPress={() => {
                                    setShowChangePassword(prev => !prev);
                                    setShowDeleteAccount(false); // Hide the other section
                                }}
                            />
                            {showChangePassword && (
                                <LinearGradient
                                    start={{ x: 0, y: 0.95 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={['rgba(126, 126, 126, 0.12)', 'rgba(255,255,255,0)']}
                                    style={styles.securityItem2}
                                >
                                    <View style={styles.passwordContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="New Password"
                                            placeholderTextColor={theme.subTextColor}
                                            secureTextEntry
                                            value={newPassword}
                                            onChangeText={setNewPassword}
                                        />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Confirm Password"
                                            placeholderTextColor={theme.subTextColor}
                                            secureTextEntry
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                        />
                                        <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
                                            <Text style={styles.saveButtonText}>Save Password</Text>
                                        </TouchableOpacity>
                                    </View>
                                </LinearGradient>
                            )}

                            {/* Delete Account Section */}
                            <LinkItem
                                text={'Delete Account'}
                                onPress={() => {
                                    setShowDeleteAccount(prev => !prev);
                                    setShowChangePassword(false); // Hide the other section
                                }}
                            />
                            {showDeleteAccount && (
                                <LinearGradient
                                    start={{ x: 0, y: 0.95 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={['rgba(126, 126, 126, 0.12)', 'rgba(255,255,255,0)']}
                                    style={styles.securityItem2}
                                >
                                    <View style={styles.passwordContainer}>
                                        <TextInput
                                            style={[styles.input, { height: verticalScale(150), textAlignVertical: 'top', padding: 20, }]}
                                            placeholder="Why you wanted to delete your account?"
                                            placeholderTextColor={theme.subTextColor}
                                            value={deletionReason}
                                            onChangeText={setDeletionReason}
                                            multiline
                                        />
                                        <TouchableOpacity style={[styles.saveButton, { backgroundColor: 'red' }]} onPress={handleDeleteAccount}>
                                            <Text style={styles.saveButtonText}>Delete Account</Text>
                                        </TouchableOpacity>
                                    </View>
                                </LinearGradient>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
};


const getStyles = (theme) =>
    StyleSheet.create({
        safeArea: { flex: 1 },
        container: { flex: 1, paddingHorizontal: 20 },
        scrollContent: { paddingBottom: 100 },
        securityOptionsContainer: { marginTop: 20, gap: 10 },
        securityItem: {
            borderColor: theme.borderColor,
            borderWidth: 1,
            borderRadius: scale(12),

        },
        securityItemInner: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 65,
            paddingHorizontal: 18,
        },
        securityItemInner2: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 18,
        },
        securityItem2: {
            borderColor: theme.borderColor,
            borderWidth: 1,
            borderRadius: scale(12),
            padding: 18,
        },
        securityTextContent: { flex: 1, marginRight: 10 },
        securityItemText: {
            fontSize: scale(12),
            fontFamily: 'Inter-Regular',
            color: theme.textColor,
        },
        securityItemDescription: {
            fontSize: 12,
            color: theme.subTextColor,
            marginTop: 2,
        },
        passwordContainer: {
            gap: 10,
            marginTop: 10,
        },
        input: {
            borderWidth: 1,
            borderColor: theme.borderColor,
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: scale(10),
            paddingHorizontal: 15,
            color: theme.textColor,
            height: 55,
            fontSize: scale(11),
        },
        saveButton: {
            backgroundColor: theme.primaryColor,
            borderRadius: scale(10),
            paddingVertical: 15,
            alignItems: 'center',
            marginTop: 10,
        },
        saveButtonText: {
            color: '#fff',
            fontFamily: 'Outfit-Bold',
            fontSize: scale(12),
        },
        absoluteFooter: {
            position: 'absolute',
            bottom: verticalScale(15),
            left: 0,
            right: 0,
            alignItems: 'center',
        },
        footerWrapper: {
            borderColor: theme.borderColor,
            borderWidth: 1,
            borderRadius: scale(102),
            padding: scale(14),
            paddingHorizontal: scale(26),
            justifyContent: 'center',
            flexDirection: 'row',
        },
        profileButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.primaryColor,
            borderRadius: scale(120),
            padding: scale(11),
            paddingHorizontal: scale(25),
            justifyContent: 'center',
        },
        profileButtonIcon: {
            width: scale(25),
            height: scale(25),
            resizeMode: 'contain',
            marginRight: scale(10),
            tintColor: 'white',
        },
        profileButtonText: {
            fontSize: scale(13),
            color: 'white',
            fontFamily: 'Inter-Medium',
        },
    });

export default AccountSecurityScreen;