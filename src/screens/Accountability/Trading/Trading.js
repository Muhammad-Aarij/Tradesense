import React, { useContext, useMemo } from 'react';
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

const Trading = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const styles = useMemo(() => getStyles(theme), [theme]);
    const days = [
        { date: '12', day: 'Sat', active: false },
        { date: '13', day: 'Sun', active: false },
        { date: '14', day: 'Mon', active: true },
        { date: '15', day: 'Tue', active: false },
        { date: '16', day: 'Wed', active: false },
    ];

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
        <ImageBackground source={theme.bg} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
                <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
                    <Header title="Trades" />

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
                            <Text style={{ color: theme.primaryColor }}>October</Text> 2024
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
                                <View
                                    style={{
                                        backgroundColor: 'white',
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
                                            color: '#000',
                                            fontSize: 15,
                                            fontFamily: 'Inter-SemiBold',
                                        }}
                                    >
                                        {item.date}
                                    </Text>
                                </View>
                                <Text
                                    style={{
                                        color: item.active ? '#FFF' : theme.subTextColor,
                                        fontSize: 12,
                                    }}
                                >
                                    {item.day}
                                </Text>
                            </LinearGradient>
                        ))}
                    </ScrollView>

                    {/* Trades List */}
                    <View style={{ marginBottom: 20 }}>
                        {trades.map((trade, index) => (
                            <TouchableOpacity key={index} onPress={() => navigation.navigate('Watchlist')}>
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
                                        <Text style={{ color: theme.textColor, fontSize: 14, fontWeight: 'bold' }}>{trade.company}</Text>
                                        <Text
                                            style={{
                                                marginTop: 3,
                                                color: theme.subTextColor,
                                                fontSize: 10,
                                                fontFamily: 'Inter-Light-BETA',
                                            }}
                                        >
                                            {trade.symbol}
                                        </Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={{ color: theme.textColor, fontSize: 15, fontFamily: 'Inter-Light-BETA' }}>
                                            {trade.price}
                                        </Text>
                                        <Text
                                            style={{
                                                color: trade.isPositive ? '#4CAF50' : '#FF5252',
                                                fontSize: 11,
                                                fontFamily: 'Inter-Light-BETA',
                                            }}
                                        >
                                            {trade.change} {trade.isPositive ? '▲' : '▼'}
                                        </Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
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
            flexDirection: "row",
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