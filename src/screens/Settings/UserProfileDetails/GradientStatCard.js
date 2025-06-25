// components/GradientStatCard.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../../../themes/theme';

const { width, height } = Dimensions.get('window');
const scale = size => (width / 375) * size; // base width 375
const verticalScale = size => (height / 812) * size; // base height 812


const GradientStatCard = ({ value, label, style, bigger = false }) => {
    return (
        <View style={[styles.card, style]}>
            <MaskedView
                maskElement={
                    <Text style={styles.value}>{value}</Text>
                }
            >
                <LinearGradient
                    colors={['#4DEFDF', '#3ABCEA']}
                    start={{ x: 0.0, y: 0.95 }}
                    end={{ x: 1.0, y: 1.0 }}
                    style={styles.gradientFill}
                >
                    <Text style={[styles.value, { opacity: 0 }]}>{value}</Text>
                </LinearGradient>
            </MaskedView>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderColor: theme.borderColor,
        borderWidth: 1,
        borderRadius: scale(12),
        paddingVertical: verticalScale(15),
        paddingHorizontal: scale(5),
        alignItems: 'center',
        flex: 1,
    },
    value: {
        textAlign: 'center',
        fontSize: scale(20),
        fontFamily: 'Inter-SemiBold',
        color: 'white',
    },
    label: {
        marginTop: verticalScale(4),
        fontFamily: 'Inter-Light-BETA',
        fontSize: scale(9),
        color: 'white',
    },
    gradientFill: {
        paddingVertical: 0, // No change needed unless scaling is needed here
    },
});

export default GradientStatCard;
