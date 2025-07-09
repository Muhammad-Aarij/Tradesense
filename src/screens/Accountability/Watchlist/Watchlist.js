import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Image,
    ImageBackground,
} from 'react-native';
import { back } from '../../../assets/images';
import { ThemeContext } from '../../../context/ThemeProvider';
import { useRoute } from '@react-navigation/native';

const Watchlist = () => {
    const route = useRoute();
    const { trade } = route.params || {};

    const { theme } = useContext(ThemeContext); // Access theme from context
    const styles = getStyles(theme);
    console.log(trade);

    const tradeDetails = trade
        ? [
            { label: 'Trade Date', value: new Date(trade.tradeDate).toLocaleDateString() },
            { label: 'Setup Name', value: trade.setupName },
            { label: 'Direction', value: trade.direction },
            { label: 'Entry Price', value: `$${trade.entryPrice}` },
            { label: 'Exit Price', value: `$${trade.exitPrice}` },
            { label: 'Quantity', value: `${trade.quantity}` },
            { label: 'Stop Loss', value: `$${trade.stopLoss}` },
            { label: 'Take Profit Target', value: `$${trade.takeProfitTarget}` },
            { label: 'Actual Exit Price', value: `$${trade.actualExitPrice}` },
            { label: 'Result', value: trade.result },
            { label: 'Emotional State', value: trade.emotionalState },
            { label: 'Attach Link', value: trade.image || 'No image' },
        ]
        : [];

    if (!trade) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={{ color: theme.textColor, textAlign: 'center', marginTop: 50 }}>
                    No trade data found.
                </Text>
            </SafeAreaView>
        );
    }


    return (
        <ImageBackground source={theme.bg} style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                    {/* Bitcoin Header */}
                    <View style={styles.bitcoinHeader}>
                        <Image
                            source={{ uri: 'https://placehold.co/40x40/FFA500/FFFFFF?text=B' }}
                            style={styles.bitcoinIcon}
                        />
                        <Text style={styles.bitcoinText}>
                            Bitcoin{' '}
                            <Text style={{ color: theme.textSecondaryColor }}>BTC</Text>
                        </Text>
                    </View>

                    {/* See on TradingView Button */}
                    <TouchableOpacity style={styles.tradingViewButton}>
                        <Text style={styles.tradingViewButtonText}>See on TradingView</Text>
                        <Image
                            source={back}
                            style={{
                                width: 15,
                                height: 15,
                                resizeMode: 'contain',
                                tintColor: theme.textColor,
                                transform: [{ rotate: '180deg' }],
                            }}
                        />
                    </TouchableOpacity>

                    {/* Trade Details */}
                    <View style={styles.detailsCard}>
                        {tradeDetails.map((item, index) => (
                            <View key={index} style={styles.detailRow}>
                                <Text style={styles.detailLabel}>{item.label}</Text>
                                <Text style={styles.detailValue}>{item.value}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
};

const getStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        scrollViewContent: {
            paddingHorizontal: 20,
            paddingBottom: 100,
        },
        bitcoinHeader: {
            paddingTop: 40,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
        },
        bitcoinIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 10,
            backgroundColor: '#FFA500',
        },
        bitcoinText: {
            flexDirection: 'row',
            gap: 5,
            color: theme.textColor,
            fontSize: 19,
            fontWeight: 'bold',
        },
        tradingViewButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 15,
            paddingVertical: 17,
            paddingHorizontal: 20,
            marginBottom: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderWidth: 0.9,
            borderColor: theme.borderColor,
        },
        tradingViewButtonText: {
            color: theme.textColor,
            fontSize: 14,
        },
        detailsCard: {
            borderRadius: 15,
            padding: 20,
            marginBottom: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderWidth: 0.9,
            borderColor: theme.borderColor,
        },
        detailRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
        },
        detailLabel: {
            color: theme.textColor,
            fontSize: 13,
        },
        detailValue: {
            color: theme.textColor,
            fontSize: 13,
            fontFamily: 'Inter-Regular',
        },
    });

export default Watchlist;
