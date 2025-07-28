import React, { useContext, useMemo, useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ImageBackground,
    StyleSheet,
    Modal,
    FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import TradeBottomSheet from '../../../components/TradeBottomSheet';
import { bg } from '../../../assets/images';
import Header from '../../../components/Header';
import { ThemeContext } from '../../../context/ThemeProvider';
import { useTradeRecords } from '../../../functions/Trades';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';

const Trading = ({ navigation }) => {
    const { theme, isDarkMode } = useContext(ThemeContext);
    const styles = useMemo(() => getStyles(theme), [theme]);
    const scrollRef = useRef(null);

    const userData = useSelector((state) => state.auth);
    const userId = userData?.userObject?._id;
    const bottomSheetRef = useRef();
    const [selectedTrade, setSelectedTrade] = useState(null);

    const { data: tradesData = [] } = useTradeRecords(userId);
    console.log("Trades Data:", tradesData);
    const currentDate = moment();
    const [selectedMonth, setSelectedMonth] = useState(moment().startOf('month'));
    const [selectedDate, setSelectedDate] = useState(currentDate.format('YYYY-MM-DD'));
    const [monthPickerVisible, setMonthPickerVisible] = useState(false);
    const dispatch = useDispatch();
    const monthList = Array.from({ length: currentDate.month() + 1 }, (_, i) =>
        moment().month(i).startOf('month')
    );

    const daysInSelectedMonth = () => {
        const days = [];
        const daysCount = selectedMonth.isSame(currentDate, 'month')
            ? currentDate.date()
            : selectedMonth.daysInMonth();

        for (let i = 1; i <= daysCount; i++) {
            const date = moment(selectedMonth).date(i);
            days.push({
                dateString: date.format('YYYY-MM-DD'),
                date: date.format('D'),
                day: date.format('ddd'),
                active: date.format('YYYY-MM-DD') === selectedDate,
            });
        }

        return days;
    };

    const days = daysInSelectedMonth();

    const filteredTrades = tradesData.filter(
        (trade) => moment(trade.tradeDate).format('YYYY-MM-DD') === selectedDate
    );

    useLayoutEffect(() => {
        dispatch(startLoading())
        const timeout = setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollToEnd({ animated: true });
            }
            dispatch(stopLoading());
        }, 500); // small delay to wait for layout

        return () => clearTimeout(timeout);
    }, [selectedMonth]);


    return (
        <ImageBackground source={theme.bg} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
                <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
                    <Header title="Trades" style={{ marginBottom: 20 }} />

                    {/* Month Selector */}
                    <TouchableOpacity
                        onPress={() => setMonthPickerVisible(true)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: 'rgba(255, 255, 255, 0.06)',
                            borderWidth: 0.9,
                            borderColor: theme.borderColor,
                            borderRadius: 10,
                            paddingVertical: 8,
                            width: 150,
                            paddingHorizontal: 15,
                            alignSelf: 'center',
                            marginBottom: 20,
                            marginTop: 10,
                        }}
                    >
                        <Text style={{ color: '#A0A0B0', fontSize: 14, marginRight: 5 }}>
                            <Text style={{ color: theme.primaryColor }}>{selectedMonth.format('MMMM')}</Text>{' '}
                            {selectedMonth.format('YYYY')}
                        </Text>
                        <Text style={{ fontSize: 14, color: '#A0A0B0', }}>{'▼'}</Text>
                    </TouchableOpacity>

                    {/* Month Picker Modal */}
                    <Modal transparent={true} visible={monthPickerVisible} animationType="fade">
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                            }}
                            onPress={() => setMonthPickerVisible(false)}
                            activeOpacity={1}
                        >
                            <View
                                style={{
                                    marginHorizontal: 40,
                                    backgroundColor: theme.primaryColor || '#fff',
                                    borderRadius: 12,
                                    paddingVertical: 20,
                                }}
                            >
                                <FlatList
                                    data={monthList}
                                    ItemSeparatorComponent={() => (
                                        <View style={{ height: 0.4, backgroundColor: theme.borderColor, marginHorizontal: 16, opacity: 0.5 }} />
                                    )}
                                    keyExtractor={(item) => item.format('YYYY-MM')}

                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={{ paddingVertical: 12, paddingHorizontal: 26 }}
                                            onPress={() => {
                                                setSelectedMonth(item);
                                                const fallback = moment(item).date(1);
                                                setSelectedDate(fallback.format('YYYY-MM-DD'));
                                                setMonthPickerVisible(false);
                                            }}
                                        >
                                            <Text style={{ color: "white", fontSize: 14, textAlign: "center", }}>
                                                {item.format('MMMM YYYY')}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </TouchableOpacity>
                    </Modal>

                    {/* Day Selector */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }} ref={scrollRef} // 👈 attach ref
                    >
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
                                                color: isDarkMode ? '#000' : 'white',
                                                fontSize: 15,
                                                fontFamily: 'Outfit-SemiBold',
                                            }}
                                        >
                                            {item.date}
                                        </Text>
                                    </View>
                                    <Text
                                        style={{
                                            color: theme.textColor,
                                            fontSize: 12,
                                            fontFamily: 'Outfit-Medium',
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
                                const change = `${trade.result === 'Profit' ? '+' : '-'}${Math.abs(
                                    priceDiff
                                ).toFixed(2)} (${((priceDiff / trade.entryPrice) * 100).toFixed(2)}%)`;
                                const isPositive = trade.result === 'Profit';

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            setSelectedTrade(trade);
                                            bottomSheetRef.current?.open();
                                        }}
                                    >
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
                                                    {trade.stockName}
                                                </Text>
                                                <Text
                                                    style={{
                                                        marginTop: 3,
                                                        color: theme.subTextColor,
                                                        fontSize: 10,
                                                        fontFamily: 'Outfit-Light-BETA',
                                                    }}
                                                >
                                                    {trade.tradeType}
                                                </Text>
                                            </View>
                                            <View style={{ alignItems: 'flex-end' }}>
                                                <Text
                                                    style={{
                                                        color: theme.textColor,
                                                        fontSize: 15,
                                                        fontFamily: 'Outfit-Light-BETA',
                                                    }}
                                                >
                                                    {price}
                                                </Text>
                                                <Text
                                                    style={{
                                                        color: isPositive ? '#4CAF50' : '#FF5252',
                                                        fontSize: 11,
                                                        fontFamily: 'Outfit-Light-BETA',
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
                <TradeBottomSheet ref={bottomSheetRef} trade={selectedTrade} />

            </SafeAreaView>
        </ImageBackground>
    );
};

const getStyles = (theme) =>
    StyleSheet.create({
        container: { flex: 1 },
        scrollViewContent: { paddingHorizontal: 20, paddingBottom: 100 },
    });

export default Trading;
