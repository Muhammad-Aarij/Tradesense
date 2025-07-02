import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Image,
    ImageBackground,
} from 'react-native';
import { back, bg } from '../../../assets/images';
import theme from '../../../themes/theme';

const Watchlist = () => {
    // Dummy data for trade details
    const tradeDetails = [
        { label: 'Trade Date', value: '2/22/2022' },
        { label: 'Setup Name', value: 'BTC' },
        { label: 'Direction', value: 'BTC' },
        { label: 'Entry Price', value: '$200' },
        { label: 'Exit Price', value: '$200' },
        { label: 'Quantity', value: '5' },
        { label: 'Stop Loss', value: '$200' },
        { label: 'Take Profit Target', value: '$200' },
        { label: 'Actual Exit Price', value: '$200' },
        { label: 'Result', value: '$200' },
        { label: 'Emotional State', value: '😔' },
        { label: 'Attach Link', value: 'https://www.linkhere.com/' },
    ];

    return (
        <ImageBackground source={bg} style={{ flex: 1, }}>
            <SafeAreaView style={styles.container}>

                {/* <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" /> */}
                <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>

                    {/* Bitcoin BTC Header */}
                    <View style={styles.bitcoinHeader}>
                        <Image
                            source={{ uri: 'https://placehold.co/40x40/FFA500/FFFFFF?text=B' }}
                            style={styles.bitcoinIcon}
                        />
                        <Text style={styles.bitcoinText}>Bitcoin <Text style={{ color: "#9D9D9D", marginLeft: 5, }}>
                            BTC</Text>
                        </Text>
                    </View>

                    {/* See on TradingView Button */}
                    <TouchableOpacity style={styles.tradingViewButton}>
                        <Text style={styles.tradingViewButtonText}>See on TradingView</Text>
                        <Image source={back} style={{ width: 15, height: 15, resizeMode: "contain", transform: [{ rotate: "180deg" }] }} />
                    </TouchableOpacity>


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

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    scrollViewContent: {
        paddingHorizontal: 20,
        paddingBottom: 100, // To make space for bottom nav
    },

    iconPlaceholder: {
        fontSize: 20,
        color: '#FFF',
    },
    iconPlaceholderSmall: {
        fontSize: 14,
        color: '#A0A0B0',
        marginLeft: 5,
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
        backgroundColor: '#FFA500', // Orange for Bitcoin icon placeholder
    },
    bitcoinText: {
        flexDirection: "row",
        gap: 5,
        color: '#FFF',
        fontSize: 19,
        fontWeight: 'bold',
    },
    tradingViewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#2C2C4A',
        borderRadius: 15,
        paddingVertical: 17,
        paddingHorizontal: 20,
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9,
        borderColor: theme.borderColor,
    },
    tradingViewButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    detailsCard: {
        // backgroundColor: '#2C2C4A',
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
        borderBottomColor: 'rgba(255, 255, 255, 0.06)', // Slightly lighter border for separation
    },
    detailLabel: {
        color: '#ffffff',
        fontSize: 14,
    },
    detailValue: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: 'Inter-Regular',
    },

});

export default Watchlist;