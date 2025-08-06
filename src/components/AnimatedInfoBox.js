import React, { useState, useRef, useEffect, useContext } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Dimensions,
    Modal,
    Platform,
} from 'react-native';
import { ThemeContext } from '../context/ThemeProvider';

const { width, height } = Dimensions.get('window');

const AnimatedInfoBox = ({
    isVisible,
    onClose,
    title,
    message,
    position = 'center', // 'right', 'left', 'center'
    maxWidth = width * 0.8,
}) => {
    const { theme, isDarkMode } = useContext(ThemeContext);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const slideAnim = useRef(new Animated.Value(-20)).current;

    useEffect(() => {
        if (isVisible) {
            if (Platform.OS === 'android') {
                // Reset animations
                fadeAnim.setValue(0);
                scaleAnim.setValue(0.8);
                slideAnim.setValue(-20);

                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.spring(scaleAnim, {
                        toValue: 1,
                        tension: 100,
                        friction: 8,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start();
            } else {
                // Instantly show on iOS
                fadeAnim.setValue(1);
                scaleAnim.setValue(1);
                slideAnim.setValue(0);
            }
        } else {
            if (Platform.OS === 'android') {
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 0.8,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: -20,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                ]).start();
            } else {
                // Instantly hide on iOS
                fadeAnim.setValue(0);
                scaleAnim.setValue(0.8);
                slideAnim.setValue(-20);
            }
        }
    }, [isVisible]);

    const getPositionStyle = () => {
        switch (position) {
            case 'left':
                return { left: 10 };
            case 'center':
                return { alignSelf: 'center' };
            case 'right':
            default:
                return { right: 10 };
        }
    };

    if (!isVisible) return null;

    return (
        <Modal
            transparent
            visible={isVisible}
            animationType="none"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <Animated.View
                    style={[
                        styles.infoBox,
                        {
                            opacity: fadeAnim,
                            transform: [
                                { scale: scaleAnim },
                                { translateY: slideAnim }
                            ],
                            backgroundColor: isDarkMode ? '#000000' : "#FFFFFF",
                            borderColor: '#333333',
                            maxWidth,
                            ...getPositionStyle(),
                        }
                    ]}
                >
                    <View style={styles.content}>
                        {title && (
                            <Text style={[
                                styles.title,
                                { color: theme.textColor }
                            ]}>
                                {title}
                            </Text>
                        )}
                        <Text style={[
                            styles.message,
                            { color: theme.subTextColor }
                        ]}>
                            {message}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Text style={[
                            styles.closeText,
                            { color: '#FFFFFF' }
                        ]}>
                            Close
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    infoBox: {
        borderRadius: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 12,
        position: 'relative',
        minWidth: 250,
    },
    content: {
        padding: 30,
        paddingBottom: 16,
    },
    title: {
        fontSize: 14,
        fontFamily: 'Outfit-SemiBold',
        marginBottom: 12,
        lineHeight: 24,
    },
    message: {
        fontSize: 11,
        fontFamily: 'Outfit-Regular',
        lineHeight: 20,
        marginBottom: 16,
    },
    closeButton: {
        alignSelf: 'center',
        paddingHorizontal: 40,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#70C2E8',
        marginBottom: 20,
    },
    closeText: {
        fontSize: 13,
        fontFamily: 'Outfit-Medium',
        lineHeight: 20,
        textAlign: 'center',
    },
});

export default AnimatedInfoBox;
