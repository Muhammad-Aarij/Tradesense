import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
// import { BlurView } from '@react-native-community/blur';
import { ThemeContext } from '../context/ThemeProvider';

import theme from '../themes/theme';
import LinearGradient from 'react-native-linear-gradient';

const ConfirmationModal = ({ isVisible, onClose, title, message, icon, button = true }) => {
    const { theme, isDarkMode } = useContext(ThemeContext);

    return (
        <Modal transparent animationType="fade" visible={isVisible} onRequestClose={onClose}>
            <View style={styles.overlay}>
                {/* <BlurView style={styles.blurContainer} blurType="dark" blurAmount={1} /> */}
                {/* <View style={styles.blurContainer} /> */}
                <LinearGradient
                    start={{ x: 0.0, y: 0.95 }}
                    end={{ x: 1.0, y: 1.0 }}
                    colors={['rgba(0, 0, 0, 0.04)', 'rgba(255, 255, 255, 0)']}
                    style={[styles.modalContainer, { backgroundColor: isDarkMode ? "#080E17" : "#FFFFFF" }]}>
                    {icon && <Image source={icon} style={styles.icon} />}
                    <Text style={{ ...styles.title, color: theme.textColor }}>{title}</Text>
                    <Text style={{ ...styles.message, color: theme.subTextColor }}>{message}</Text>
                    {button && <TouchableOpacity onPress={onClose} style={styles.button}>
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>}
                </LinearGradient>
            </View>
        </Modal >
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(14, 14, 14, 0.81)',

    },
    blurContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    modalContainer: {
        backgroundColor: "#080E17",
        paddingVertical: 30,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: 'center',
        width: "80%",
    },
    icon: {
        width: 110,
        height: 100,
        resizeMode: "contain",
        marginBottom: 20,
    },
    title: {
        fontSize: 16,
        fontFamily: "Inter-Medium",
        color: "#EFEFEF",
        textAlign: "center",
        marginBottom: 5,
    },
    message: {
        width: "80%",
        fontSize: 12,
        color: "#EFEFEF",
        textAlign: 'center',
        marginBottom: 25,
        fontFamily: "Inter-Regular",
    },
    button: {
        backgroundColor: theme.primaryColor,
        paddingVertical: 13,
        paddingHorizontal: 20,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: "Inter-SemiBold",
    },
});

export default ConfirmationModal;
