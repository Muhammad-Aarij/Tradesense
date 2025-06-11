import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../../components/Header';
import { bank, bg, blueArrow, googlePay, PayPal } from '../../../assets/images';
import theme from '../../../themes/theme';

const withdrawalHistoryData = [
    { id: 'wh1', type: 'PayPal', amount: '$345', status: 'completed' },
    { id: 'wh2', type: 'Google Pay', amount: '$5548.55', status: 'completed' },
    { id: 'wh3', type: 'Bank', amount: '$345', status: 'pending' },
    { id: 'wh4', type: 'PayPal', amount: '$345', status: 'completed' },
    { id: 'wh5', type: 'Google Pay', amount: '$3548.55', status: 'completed' },
    { id: 'wh6', type: 'Bank', amount: '$345', status: 'pending' },
];

const WithdrawScreen = () => {
    //   const navigation = useNavigation();

    const getIconForType = (type) => {
        switch (type) {
            case 'PayPal': return PayPal;
            case 'Google Pay': return googlePay;
            case 'Bank': return bank;
            default: return null;
        }
    };

    return (
        <ImageBackground source={bg} style={styles.container}>
            {/* Header */}
            <Header title={"Withdraw"} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Available Balance */}
                <View style={styles.balanceContainer}>
                    <Text style={styles.balanceAmount}>$1534.09</Text>
                    <Text style={styles.balanceLabel}>Available Balance</Text>
                </View>

                {/* Withdraw Button */}
                <TouchableOpacity
                    style={styles.withdrawButton}
                    onPress={() => {
                        if (navigation && navigation.navigate) {
                            navigation.navigate('WithdrawDetail'); // Navigate to WithdrawDetailScreen
                        } else {
                            console.warn("Navigation navigate not available.");
                        }
                    }}
                >
                    <Text style={styles.withdrawButtonText}>Withdraw</Text>
                </TouchableOpacity>

                {/* History Section */}
                <Text style={styles.historyTitle}>History</Text>
                <View style={styles.historyContainer}>
                    {withdrawalHistoryData.map((item) => (
                        <View key={item.id} style={styles.historyItem}>
                            <View style={styles.historyItemLeft}>
                                <Image source={getIconForType(item.type)} style={styles.historyItemIcon} />
                                <View>
                                    <Text style={styles.historyItemType}>{item.type}</Text>
                                    <Text style={styles.historyItemType2}>Amount Withdraw</Text>
                                </View>
                            </View>
                            <View style={styles.historyItemRight}>
                                <Text style={styles.historyItemAmount}>{item.amount}</Text>
                                <Image source={blueArrow} style={styles.historyItemArrow} />
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#08131F', padding: 25, paddingVertical: 0 },

    scrollContent: {
        // paddingHorizontal: 16,
        // paddingBottom: 20,
    },
    balanceContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9, borderColor: theme.borderColor,
        padding: 27,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 20, // Space from header
    },
    balanceAmount: {
        color: '#FFF', // Blue color for balance
        fontSize: 30,
        fontFamily: "Inter-Bold",
        marginBottom: 10,
    },
    balanceLabel: {
        color: '#CCCCCC',
        fontSize: 13,
        fontFamily: "Inter-Light-BETA",
    },
    withdrawButton: {
        backgroundColor: theme.primaryColor, width: '100%',
        padding: 15, borderRadius: 14, marginVertical: 30, alignItems: 'center'
    },
    withdrawButtonText: {
        color: '#fff', fontSize: 17, fontWeight: '600', fontFamily: "Inter-Medium",
    },
    historyContainer: {
        marginBottom: 40,
        gap: 13,
    },
    historyTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: "Inter-Regular",
        marginBottom: 15,
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9, borderColor: theme.borderColor,
        padding: 16,
        borderRadius: 8,
    },
    historyItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    historyItemIcon: {
        width: 37,
        height: 35,
        resizeMode: 'contain',
        marginRight: 10,
    },
    historyItemType: {
        color: '#FFFFFF',
        fontSize: 13,
        fontFamily: "Inter-Regular",
    },
    historyItemType2: {
        color: '#FFFFFF',
        fontSize: 10,
        fontFamily: "Inter-Thin-BETA",
    },
    historyItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    historyItemAmount: {
        color: '#FFF',
        fontSize: 13,
        fontFamily: "Inter-Medium",
        marginRight: 10,
    },
    historyItemArrow: {
        width: 15,
        height: 15,
        tintColor: '#AAAAAA',
        resizeMode: 'contain',
    },
});

export default WithdrawScreen;
