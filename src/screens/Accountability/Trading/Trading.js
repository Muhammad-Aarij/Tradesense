import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ImageBackground,
    Touchable,
} from 'react-native';
import { bg } from '../../../assets/images';
import Header from '../../../components/Header';
import theme from '../../../themes/theme';


const Trading = ({ navigation }) => {
    // Dummy data for days, mimicking the image
    const days = [
        { date: '12', day: 'Sat', active: false },
        { date: '13', day: 'Sun', active: false },
        { date: '14', day: 'Mon', active: true }, // Active day
        { date: '15', day: 'Tue', active: false },
        { date: '16', day: 'Wed', active: false },
    ];

    // Dummy data for trades
    const trades = [
        {
            company: 'Tesla',
            symbol: 'Tesal, Inc.',
            price: '244.40',
            change: '+9.54 (+4.06%)',
            isPositive: true,
        },
        {
            company: 'DHDI',
            symbol: 'PT. Duatiga Pertama',
            price: '8600.00',
            change: '+50 (+3.23%)',
            isPositive: true,
        },
        {
            company: 'USD/JPY',
            symbol: 'Euro / U.S. Dollar',
            price: '139.3550',
            change: '-0.80 (-0.37%)',
            isPositive: false,
        },
        {
            company: 'AMRI',
            symbol: 'PT. Atma Merapi',
            price: '3.867',
            change: '-71 (-41.1%)',
            isPositive: false,
        },
    ];

    return (
        <ImageBackground source={bg} style={{ flex: 1, }}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    {/* Header */}
                    <Header title={"Trades"} />

                    {/* Month Selector */}
                    <TouchableOpacity style={styles.monthSelector}>
                        <Text style={styles.monthSelectorText}>
                            <Text style={{ color: theme.primaryColor }}>October</Text> 2024</Text>
                        {/* <Icon name="chevron-down-outline" size={16} color="#A0A0B0" /> */}
                        <Text style={styles.iconPlaceholderSmall}>{'v'}</Text>
                    </TouchableOpacity>

                    {/* Day Selector */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelectorScroll}>
                        {days.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.dayButton, item.active && styles.dayButtonActive]}
                            >
                                <View style={styles.circle}>
                                    <Text style={[styles.dayButtonDate, item.active && styles.dayButtonDateActive]}>
                                        {item.date}
                                    </Text>
                                </View>
                                <Text style={[styles.dayButtonDay, item.active && styles.dayButtonDayActive]}>
                                    {item.day}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Trades List */}
                    <View style={styles.tradesList}>
                        {trades.map((trade, index) => (
                            <TouchableOpacity key={index} style={styles.tradeItem} onPress={() => { navigation.navigate("Watchlist") }}>
                                <View>
                                    <Text style={styles.tradeCompanyName}>{trade.company}</Text>
                                    <Text style={styles.tradeSymbol}>{trade.symbol}</Text>
                                </View>
                                <View style={styles.tradePriceContainer}>
                                    <Text style={styles.tradePrice}>{trade.price}</Text>
                                    <Text
                                        style={trade.isPositive ? styles.tradeChangePositive : styles.tradeChangeNegative}
                                    >
                                        {trade.change}
                                        {trade.isPositive ? ' ▲' : ' ▼'} {/* Unicode triangles for up/down */}
                                    </Text>
                                </View>
                            </TouchableOpacity>
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
    monthSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9,
        borderColor: theme.borderColor,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 15,
        alignSelf: 'center', // Center the button
        marginBottom: 20,
        marginTop: 10,
    },
    monthSelectorText: {
        color: '#A0A0B0',
        fontSize: 14,
        marginRight: 5,
    },
    daySelectorScroll: {
        marginBottom: 20,
    },
    dayButton: {
        backgroundColor: '#2C2C4A',
        borderRadius: 15,
        paddingVertical: 10,
        // paddingHorizontal: 12,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 65, // Fixed width for consistent look
        height: 90, // Fixed height
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9,
        borderColor: theme.borderColor,
    },
    dayButtonActive: {
        borderColor: theme.primaryColor,
        backgroundColor: 'rgba(29, 172, 255, 0.44)', // Blue for active day
    },
    circle: {
        backgroundColor: "white",
        width: 35,
        height: 35,
        borderRadius: 100,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    dayButtonDate: {
        color: '#000',
        fontSize: 15,
        fontFamily: 'Inter-SemiBold',
    },
    dayButtonDateActive: {
        color: '#000',
    },
    dayButtonDay: {
        color: '#A0A0B0',
        fontSize: 12,
    },
    dayButtonDayActive: {
        color: '#FFF',
    },
    tradesList: {
        marginBottom: 20,
    },
    tradeItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#2C2C4A',
        borderRadius: 12,
        padding: 15,
        paddingHorizontal: 18,
        marginBottom: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9,
        borderColor: theme.borderColor,
    },
    tradeCompanyName: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    tradeSymbol: {
        marginTop: 3,
        color: '#A0A0B0',
        fontSize: 10,
        fontFamily: "Inter-Light-BETA",
    },
    tradePriceContainer: {
        alignItems: 'flex-end',
    },
    tradePrice: {
        color: '#FFF',
        fontSize: 15,
        fontFamily: "Inter-Light-BETA",
        // fontWeight: 'bold',
    },
    tradeChangePositive: {
        color: '#4CAF50', // Green for positive change
        fontFamily: "Inter-Light-BETA",
        fontSize: 11,
    },
    tradeChangeNegative: {
        color: '#FF5252', // Red for negative change
        fontFamily: "Inter-Light-BETA",
        fontSize: 11,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#2C2C4A',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    navItem: {
        alignItems: 'center',
        padding: 5,
    },
    navItemActive: {
        backgroundColor: '#007bff',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    navItemActiveText: {
        color: '#FFF',
        fontSize: 12,
        marginLeft: 5,
    },
});

export default Trading;