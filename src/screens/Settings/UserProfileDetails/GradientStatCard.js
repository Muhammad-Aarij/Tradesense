import React, { useContext } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ThemeContext } from '../../../context/ThemeProvider';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');
const scale = size => (width / 375) * size;
const verticalScale = size => (height / 812) * size;

const GradientStatCard = ({ value, label, style, bigger = false }) => {
    const { theme } = useContext(ThemeContext); // ✅ use theme dynamically
    const styles = getStyles(theme);

    return (
        <LinearGradient
            start={{ x: 0.0, y: 0.95 }} end={{ x: 1.0, y: 1.0 }}
            colors={['rgba(0, 0, 0, 0.04)', 'rgba(255, 255, 255, 0)']}
            style={styles.cardLinearGradient}>
                <View style = {[styles.card, style]}>
            <Text style={[styles.value, bigger && styles.biggerValue]}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
            </View>
        </LinearGradient>
    );
};

const getStyles = (theme) => StyleSheet.create({
    card: {
        // backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderColor: theme.borderColor,
        // borderWidth: 1.5,
        borderRadius: scale(12),
        paddingVertical: verticalScale(15),
        paddingHorizontal: scale(5),
        alignItems: 'center',
        flex: 1,
    },
    cardLinearGradient: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderColor: theme.borderColor,
        borderWidth: 1.5,
        borderRadius: scale(12),
        // paddingVertical: verticalScale(15),
        // paddingHorizontal: scale(5),
        // alignItems: 'center',
        flex: 1,
    },
    value: {
        textAlign: 'center',
        fontSize: scale(20),
        fontFamily: 'Inter-SemiBold',
        color: theme.primaryColor,
    },
    biggerValue: {
        fontSize: scale(26),
    },
    label: {
        marginTop: verticalScale(4),
        fontFamily: 'Inter-Light-BETA',
        fontSize: scale(9),
        color: theme.textColor, // was "white"
    },
});

export default GradientStatCard;
