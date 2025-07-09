import React, { useContext, useMemo, useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ImageBackground,
    StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { bg } from '../../../assets/images';
import Header from '../../../components/Header';
import { ThemeContext } from '../../../context/ThemeProvider';
import { useSelector } from 'react-redux';
import { useTradeRecords } from '../../../functions/Trades';
import moment from 'moment';

const Trading = ({ navigation }) => {
    const { theme, isDarkMode } = useContext(ThemeContext);
    const styles = useMemo(() => getStyles(theme), [theme]);

    const userData = useSelector((state) => state.auth);
    const userId = userData?.userObject?._id;

    const { data: tradesData = [] } = useTradeRecords(userId);

    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

    // Get current and previous 5 dates
    const days = [...Array(6)].map((_, i) => {
        const date = moment().subtract(5 - i, 'days');
        return {
            dateString: date.format('YYYY-MM-DD'),
            date: date.format('D'),
            day: date.format('ddd'),
            active: date.format('YYYY-MM-DD') === selectedDate,
        };
    });

    const filteredTrades = tradesData.filter(trade =>
        moment(trade.tradeDate).format('YYYY-MM-DD') === selectedDate
    );


    return (
        <ImageBackground source={theme.bg} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
                <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
                    <Header title="Trades" style={{ marginBottom: 20, }} />

                    {/* Month Selector */}
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.06)',
                            borderWidth: 0.9,
                            borderColor: theme.borderColor,
                            borderRadius: 10,
                            paddingVertical: 8,
                            paddingHorizontal: 15,
                            alignSelf: 'center',
                            marginBottom: 20,
                            marginTop: 10,
                        }}
                    >
                        <Text style={{ color: '#A0A0B0', fontSize: 14, marginRight: 5 }}>
                            <Text style={{ color: theme.primaryColor }}>{moment().format('MMMM')}</Text>{' '}
                            {moment().format('YYYY')}
                        </Text>
                        <Text style={{ fontSize: 14, color: '#A0A0B0' }}>{'v'}</Text>
                    </TouchableOpacity>

                    {/* Day Selector */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                        {days.map((item, index) => (
                            <LinearGradient
                                colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                                start={{ x: 0, y: 0.95 }}
                                end={{ x: 1, y: 1 }}
                                key={index}
                                style={{
                                    borderRadius: 15,
                                    marginRight: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 65,
                                    height: 90,
                                    borderWidth: 0.9,
                                    borderColor: item.active ? theme.primaryColor : theme.borderColor,
                                    backgroundColor: item.active ? 'rgba(29, 172, 255, 0.44)' : undefined,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => setSelectedDate(item.dateString)}
                                    style={{ alignItems: 'center' }}
                                >
                                    <View
                                        style={{
                                            backgroundColor: isDarkMode ? 'white' : theme.primaryColor,
                                            width: 35,
                                            height: 35,
                                            borderRadius: 100,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginBottom: 12,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: isDarkMode ? '#000' : "white",
                                                fontSize: 15,
                                                fontFamily: 'Inter-SemiBold',
                                            }}
                                        >
                                            {item.date}
                                        </Text>
                                    </View>
                                    <Text
                                        style={{
                                            color: theme.textColor,
                                            fontSize: 12,
                                            fontFamily: "Inter-Medium"
                                        }}
                                    >
                                        {item.day}
                                    </Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        ))}
                    </ScrollView>

                    {/* Trades List */}
                    <View style={{ marginBottom: 20 }}>
                        {filteredTrades.length === 0 ? (
                            <Text style={{ color: theme.subTextColor, textAlign: 'center' }}>
                                No trades found for selected date.
                            </Text>
                        ) : (
                            filteredTrades.map((trade, index) => {
                                const price = trade.actualExitPrice?.toString();
                                const priceDiff = trade.exitPrice - trade.entryPrice;
                                const change = `${trade.result === 'Profit' ? '+' : '-'}${Math.abs(priceDiff).toFixed(2)} (${((priceDiff / trade.entryPrice) * 100).toFixed(2)}%)`;
                                const isPositive = trade.result === 'Profit';

                                return (
                                    <TouchableOpacity key={index} onPress={() => navigation.navigate('Watchlist', { trade })}>
                                        <LinearGradient
                                            start={{ x: 0, y: 0.95 }}
                                            end={{ x: 1, y: 1 }}
                                            colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                borderRadius: 12,
                                                padding: 15,
                                                paddingHorizontal: 18,
                                                marginBottom: 10,
                                                borderWidth: 0.9,
                                                borderColor: theme.borderColor,
                                            }}
                                        >
                                            <View>
                                                <Text style={{ color: theme.textColor, fontSize: 14, fontWeight: 'bold' }}>
                                                    {trade.setupName}
                                                </Text>
                                                <Text
                                                    style={{
                                                        marginTop: 3,
                                                        color: theme.subTextColor,
                                                        fontSize: 10,
                                                        fontFamily: 'Inter-Light-BETA',
                                                    }}
                                                >
                                                    {trade.notes}
                                                </Text>
                                            </View>
                                            <View style={{ alignItems: 'flex-end' }}>
                                                <Text
                                                    style={{
                                                        color: theme.textColor,
                                                        fontSize: 15,
                                                        fontFamily: 'Inter-Light-BETA',
                                                    }}
                                                >
                                                    {price}
                                                </Text>
                                                <Text
                                                    style={{
                                                        color: isPositive ? '#4CAF50' : '#FF5252',
                                                        fontSize: 11,
                                                        fontFamily: 'Inter-Light-BETA',
                                                    }}
                                                >
                                                    {change} {isPositive ? '▲' : '▼'}
                                                </Text>
                                            </View>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                );
                            })
                        )}
                    </View>

                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
};

const getStyles = (theme) =>
    StyleSheet.create({
        container: { flex: 1 },
        scrollViewContent: { paddingHorizontal: 20, paddingBottom: 100 },
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
            borderBottomColor: 'rgba(255, 255, 255, 0.06)',
        },
        detailLabel: {
            color: theme.textColor,
            fontSize: 14,
        },
        detailValue: {
            color: theme.textColor,
            fontSize: 14,
            fontFamily: 'Inter-Regular',
        },
    });

export default Trading;
