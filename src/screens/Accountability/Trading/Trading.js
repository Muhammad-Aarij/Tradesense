import React, { useContext, useMemo, useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
    Image,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import TradeBottomSheet from '../../../components/TradeBottomSheet';
import { addBtn, bg, subscription, tick } from '../../../assets/images';
import Header from '../../../components/Header';
import { ThemeContext } from '../../../context/ThemeProvider';
import { useTradeRecords, useUploadTradesCSV } from '../../../functions/Trades';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import SnackbarMessage from '../../../functions/SnackbarMessage';
import ConfirmationModal from '../../../components/ConfirmationModal';

const Trading = ({ navigation, route }) => {
    const selectedMood = route.params.selectedMood;
    const { theme, isDarkMode } = useContext(ThemeContext);
    const styles = useMemo(() => getStyles(theme), [theme]);
    const scrollRef = useRef(null);
    const [showExtraButtons, setShowExtraButtons] = useState(false);
    const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
    const [confirmationTitle, setConfirmationTitle] = useState('');
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [icon, setIcon] = useState(null);
    const userData = useSelector((state) => state.auth);
    const userId = userData?.userObject?._id;
    const bottomSheetRef = useRef();
    const [selectedTrade, setSelectedTrade] = useState(null);
    const uploadCSV = useUploadTradesCSV(userId);
    const [snackbar, setSnackbar] = React.useState({
        visible: false,
        message: '',
        type: '', // e.g., 'success' or 'error'
    });
    const { data: tradesData = [] } = useTradeRecords(userId);
    // console.log("Trades Data:", tradesData);
    const currentDate = moment();
    const [selectedMonth, setSelectedMonth] = useState(moment().startOf('month'));
    const [selectedDate, setSelectedDate] = useState(currentDate.format('YYYY-MM-DD'));
    const [monthPickerVisible, setMonthPickerVisible] = useState(false);
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    const userObject = useSelector(state => state.auth.userObject);
    const isPremium = userObject?.isPremium;

    const dispatch = useDispatch();

    useFocusEffect(
        useCallback(() => {
            // Reset the state whenever the screen gains focus
            setShowExtraButtons(false);

            // No cleanup needed in this case
            return () => { };
        }, [])
    );

    const monthList = Array.from({ length: currentDate.month() + 1 }, (_, i) =>
        moment().month(i).startOf('month')
    );

    React.useEffect(() => {
        if (snackbar.visible) {
            const timer = setTimeout(() => {
                setSnackbar((prev) => ({ ...prev, visible: false }));
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [snackbar.visible]);

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

    const getTodayTrades = (trades) => {
        const today = new Date();
        return trades.filter((trade) => {
            const createdAt = new Date(trade.createdAt);
            return (
                createdAt.getFullYear() === today.getFullYear() &&
                createdAt.getMonth() === today.getMonth() &&
                createdAt.getDate() === today.getDate()
            );
        });
    };

    const todayTrades = useMemo(() => getTodayTrades(tradesData), [tradesData]);
    console.log("Today's Trades", todayTrades);


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

    const handleCSVUpload = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.csv, DocumentPicker.types.allFiles],
            });

            if (result && result[0]) {
                const file = result[0];

                // Check CSV extension (case-insensitive)
                if (!file.name.toLowerCase().endsWith('.csv')) {
                    setSnackbar({
                        visible: true,
                        message: 'Invalid File.\nPlease select a .csv file only.',
                        type: 'error',
                    });
                    return;
                }

                dispatch(startLoading());
                console.log('Selected file:', file);

                uploadCSV.mutate(file, {
                    onSuccess: (data) => {
                        console.log('CSV upload successful:', data);
                        setConfirmationTitle('Success');
                        setIcon(tick);
                        setConfirmationMessage('CSV file uploaded successfully!');
                        setIsConfirmationVisible(true);
                        setShowExtraButtons(false);
                        dispatch(stopLoading());
                    },
                    onError: (error) => {
                        console.error('CSV upload failed:', error);
                        setIcon(fail);
                        setConfirmationTitle('Upload Failed');
                        setConfirmationMessage('Failed to upload CSV file. Please try again.');
                        setIsConfirmationVisible(true);
                        dispatch(stopLoading());
                    },
                });
            }
        } catch (err) {
            if (!DocumentPicker.isCancel(err)) {
                console.error('Document picker error:', err);
                setConfirmationTitle('Error');
                setConfirmationMessage('Failed to select file. Please try again.');
                setIcon(fail);
                setIsConfirmationVisible(true);
            }
        }
    };



    return (
        <ImageBackground source={theme.bg} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                {showExtraButtons && (
                    <TouchableOpacity
                        style={styles.overlayBackground}
                        onPress={() => setShowExtraButtons(false)}
                        activeOpacity={1}
                    />
                )}

                {showPremiumModal && (
                    <ConfirmationModal
                        title={"Unlock Premium Content"}
                        message={"Subscribe to access all guided sessions, expert talks, and exclusive audio and video experiences."}
                        icon={subscription}
                        buttonText="Subscribe Now"
                        onClose={() => {
                            setShowPremiumModal(false);
                            navigation.navigate("More", {
                                screen: "AppSubscription",
                            });
                        }}
                        onCrossClose={() => {
                            setShowPremiumModal(false);
                        }}

                    />
                )}

                <View style={styles.floatingButtonContainer}>

                    {showExtraButtons && (
                        <TouchableOpacity
                            style={styles.extraButtonTop}
                            onPress={() => {
                                if (!isPremium && todayTrades.length >= 2) {
                                    setSnackbar({
                                        visible: true,
                                        message: 'Free users can only add 2 trades per day.\nUpgrade to premium for unlimited access.',
                                        type: 'error',
                                    });
                                    return;
                                }

                                setShowExtraButtons(false);
                                navigation.navigate('Acc_FormData', { emotion: selectedMood });
                            }}


                        >
                            <Text style={styles.extraButtonText}>Add Trade</Text>
                        </TouchableOpacity>
                    )} 
                    {showExtraButtons && (
                        <TouchableOpacity
                            style={styles.extraButtonBottom}
                            onPress={() => {
                                if (isPremium) {
                                    handleCSVUpload();
                                } else {
                                    setShowPremiumModal(true);
                                }
                            }}
                        >
                            <Text style={styles.extraButtonText}>Import CSV</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setShowExtraButtons(!showExtraButtons)}
                    >
                        <Image
                            source={addBtn}
                            style={styles.addButtonImage}
                        />
                    </TouchableOpacity>
                </View>
                <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
                <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                    <Header title="Trades" style={{ marginBottom: 20 }} />

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
                                backgroundColor: 'rgba(0,0,0,0.7)',
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
                                        <View style={{ backgroundColor: theme.borderColor, marginHorizontal: 16, opacity: 0.5 }} />
                                    )}
                                    keyExtractor={(item) => item.format('YYYY-MM')}

                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={{ paddingVertical: 12, paddingHorizontal: 26, width: "100%", }}
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
                                                borderRadius: 12,
                                                marginBottom: 10,
                                            }}
                                        >
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                borderRadius: 12,
                                                padding: 15,
                                                paddingHorizontal: 18,
                                                borderWidth: 0.9,
                                                borderColor: theme.borderColor,
                                            }}>
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
                                            </View>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                );
                            })
                        )}
                    </View>

                    {snackbar.visible && (
                        <SnackbarMessage
                            message={snackbar.message}
                            type={snackbar.type}
                            visible={snackbar.visible}
                        />
                    )}
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
        floatingButtonContainer: {
            position: 'absolute',
            right: -10,
            top: 300,
            zIndex: 100000,
            // alignItems: 'center',
        },
        overlayBackground: {
            width: "100%",
            height: "100%",
            ...StyleSheet.absoluteFillObject, // spread this object properly
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999, // high zIndex to be on top
        },
        extraButtonTop: {
            position: 'absolute',
            bottom: 65,
            right: 60,
            width: 80,
            height: 80,
            borderRadius: 200,
            backgroundColor: theme.primaryLight || 'rgba(15, 66, 96, 0.9)',
            borderWidth: 0.9,
            borderColor: theme.primaryColor,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 8,
            paddingHorizontal: 14,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            textAlign: "center",
        },

        extraButtonBottom: {
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            position: 'absolute',
            top: 65,
            right: 60,
            backgroundColor: theme.primaryLight || 'rgba(15, 66, 96, 0.9)',
            borderWidth: 0.9,
            borderColor: theme.primaryColor,
            paddingVertical: 8,
            paddingHorizontal: 14,
            width: 80,
            height: 80,
            borderRadius: 200,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
        },

        extraButtonText: {
            color: '#fff',
            fontSize: 13,
            fontFamily: 'Outfit-Regular',
            fontWeight: '500',
            zIndex: 1000,
            textAlign: 'center',
        },

        addButton: {
            // width: 60,
            // height: 60,
            // borderRadius: 30,
            // backgroundColor: theme.primaryColor,
            justifyContent: 'center',
            alignItems: 'center',
            // elevation: 5,
            // shadowColor: theme.primaryColor,
            // shadowOffset: { width: 0, height: 2 },
            // shadowOpacity: 0.3,
            // shadowRadius: 4,
        },
        addButtonImage: {
            width: 65,
            height: 105,
            resizeMode: 'contain',
            tintColor: '#fff',
        },
    });

export default Trading;
