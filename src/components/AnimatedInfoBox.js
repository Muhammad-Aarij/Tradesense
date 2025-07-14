import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Dimensions,
    Modal,
} from 'react-native';
import { ThemeContext } from '../context/ThemeProvider';
import { useContext } from 'react';

const { width, height } = Dimensions.get('window');

const AnimatedInfoBox = ({ 
    isVisible, 
    onClose, 
    title, 
    message, 
    position = 'center', // 'right', 'left', 'center'
    maxWidth = width * 0.8 
}) => {
    const { theme } = useContext(ThemeContext);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const slideAnim = useRef(new Animated.Value(-20)).current;

    useEffect(() => {
        if (isVisible) {
            // Reset animations
            fadeAnim.setValue(0);
            scaleAnim.setValue(0.8);
            slideAnim.setValue(-20);

            // Start animations
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
            // Hide animations
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
                            backgroundColor: '#000000',
                            borderColor: '#333333',
                            maxWidth,
                            ...getPositionStyle(),
                        }
                    ]}
                >
                    {/* Content */}
                    <View style={styles.content}>
                        {title && (
                            <Text style={[
                                styles.title,
                                { color: '#FFFFFF' }
                            ]}>
                                {title}
                            </Text>
                        )}
                        <Text style={[
                            styles.message,
                            { color: '#CCCCCC' }
                        ]}>
                            {message}
                        </Text>
                    </View>

                    {/* Close button */}
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

const getArrowPosition = (position) => {
    switch (position) {
        case 'left':
            return { left: 20, transform: [{ rotate: '45deg' }] };
        case 'center':
            return { alignSelf: 'center', transform: [{ rotate: '45deg' }] };
        case 'right':
        default:
            return { right: 20, transform: [{ rotate: '45deg' }] };
    }
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
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 12,
        position: 'relative',
        minWidth: 250,
    },
    content: {
        padding: 20,
        paddingBottom: 16,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
        marginBottom: 12,
        lineHeight: 24,
        textAlign: 'center',
    },
    message: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 16,
    },
    closeButton: {
        alignSelf: 'center',
        paddingHorizontal: 40,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#70C2E8',
        borderWidth: 1,
        borderColor: '#555555',
        marginBottom: 20,
    },
    closeText: {
        fontSize: 13,
        fontFamily: 'Inter-Medium',
        lineHeight: 20,
        textAlign: 'center',
    },
});

export default AnimatedInfoBox; 