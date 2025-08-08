import React, { useContext, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, Dimensions } from 'react-native';
import { ThemeContext } from '../context/ThemeProvider';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const ConfirmationModal = ({ isVisible, onClose, title, message, icon, button = true, buttonText = "Continue", onCrossClose }) => {
    const { theme, isDarkMode } = useContext(ThemeContext);

    // Determine which close function to use for the cross button
    const handleCrossClose = onCrossClose || onClose;

    // Create styles dynamically based on the current theme
    const styles = useMemo(() => getStyles(theme, isDarkMode), [theme, isDarkMode]);

    return (
        <Modal transparent animationType="fade" visible={isVisible} onRequestClose={onClose}>
            <View style={styles.overlay}>
                <LinearGradient
                    start={{ x: 0.0, y: 0.0 }}
                    end={{ x: 1.0, y: 1.0 }}
                    colors={isDarkMode
                        ? ['rgba(0, 0, 0, 0.9)', 'rgba(20, 20, 20, 0.95)']
                        : ['rgba(255, 255, 255, 0.95)', 'rgba(245, 245, 245, 0.98)']
                    }
                    style={styles.modalContainer}>
                    <View style={styles.modalContainerInner}>
                        {icon && (
                            <View style={styles.iconContainer}>
                                <Image source={icon} style={styles.icon} />
                                <View style={styles.iconGlow} />
                            </View>
                        )}
                        <Text style={[styles.title, { color: theme.textColor }]}>{title}</Text>
                        <Text style={[styles.message, { color: theme.subTextColor }]}>{message}</Text>
                        {button && (
                            <TouchableOpacity
                                onPress={onClose}
                                style={styles.button}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.buttonText}>{buttonText}</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={handleCrossClose}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.closeButtonText, { color: theme.subTextColor }]}>✕</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>
        </Modal>
    );
};

// Function to create styles based on theme and isDarkMode
const getStyles = (theme, isDarkMode) => StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    blurContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    modalContainer: {
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    modalContainerInner: {
        paddingVertical: 40,
        paddingBottom: 20,
        paddingHorizontal: 30,
        borderRadius: 20,
        alignItems: 'center',
        width: width * 0.85,
        maxWidth: 300,
        position: 'relative',
        borderWidth: 1,
        borderColor: theme.primaryColor,
    },
    iconContainer: {
        position: 'relative',
        marginBottom: 25,
    },
    icon: {
        width: 60,
        height: 60,
        resizeMode: "contain",
        zIndex: 2,
    },
    iconGlow: {
        position: 'absolute',
        top: -10,
        left: -10,
        right: -10,
        bottom: -10,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderRadius: 50,
        zIndex: 1,
    },
    title: {
        fontSize: 15,
        fontFamily: "Outfit-Bold",
        color: "#EFEFEF",
        textAlign: "center",
        marginBottom: 10,
    },
    message: {
        width: "90%",
        fontSize: 12,
        color: "#EFEFEF",
        textAlign: 'center',
        marginBottom: 30,
        fontFamily: "Outfit-Regular",
        lineHeight: 20,
    },
    button: {
        width: '100%',
        backgroundColor: theme.primaryColor,
        borderRadius: 12,
        paddingVertical: 13,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 46,
        shadowColor: theme.primaryColor,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 13,
        fontFamily: "Outfit-SemiBold",
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 14,
        fontFamily: "Outfit-Medium",
    },
});

export default ConfirmationModal;
