import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
// import { BlurView } from '@react-native-community/blur';
import theme from '../themes/theme';

const ConfirmationModal = ({ isVisible, onClose, title, message, icon, button = true }) => {
    return (
        <Modal transparent animationType="fade" visible={isVisible} onRequestClose={onClose}>
            <View style={styles.overlay}>
                {/* <BlurView style={styles.blurContainer} blurType="dark" blurAmount={1} /> */}
                <View style={styles.blurContainer} />
                <View style={styles.modalContainer}>
                    {icon && <Image source={icon} style={styles.icon} />}
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    {button && <TouchableOpacity onPress={onClose} style={styles.button}>
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>}
                </View>
            </View>
        </Modal>
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
        borderRadius: 15,
        alignItems: 'center',
        width: "80%",
        shadowColor: theme.primaryColor, // 👈 shadow with primary color
        shadowOffset: { width: 20, height: 16 },
        shadowOpacity: 0.45,
        shadowRadius: 10,
        elevation: 20, // for Android shadow
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
        marginBottom: 15,
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
