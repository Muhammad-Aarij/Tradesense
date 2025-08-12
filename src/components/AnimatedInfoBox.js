import React, { useContext } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Modal,
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
                <View
                    style={[
                        styles.infoBox,
                        {
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
                </View>
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
