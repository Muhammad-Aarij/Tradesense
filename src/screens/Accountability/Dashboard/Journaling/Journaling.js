import React, { useContext, useMemo, useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Modal,
    ImageBackground,
    ActivityIndicator,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { addBtn, back, bg, colorBg, fail, tick } from '../../../../assets/images';
import { ThemeContext } from '../../../../context/ThemeProvider';
import { useUserMood, usePostMood, useUpdateMood, useAllMoods } from '../../../../functions/MoodApi';
import { useDispatch, useSelector } from 'react-redux';
import moodQuotes from './modes';
import { useTradeRecords, useUploadTradesCSV } from '../../../../functions/Trades';
import TradingJourneyChart from '../../../../components/TradingJourneyChart';
import { startLoading, stopLoading } from '../../../../redux/slice/loaderSlice';
import DocumentPicker from 'react-native-document-picker';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import SnackbarMessage from '../../../../functions/SnackbarMessage';
import TradeBottomSheet from '../../../../components/TradeBottomSheet'; // Assuming this is your bottom sheet component

// Mood selection modal component
const MoodSelectionModal = ({ isVisible, onClose, onSelectMood, moodOptions, theme }) => {
    const modalStyles = getModalStyles(theme);
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={modalStyles.centeredView}>
                <ImageBackground source={theme.bg} imageStyle={{ resizeMode: 'cover' }} style={modalStyles.imageBg} >
                    <View style={modalStyles.modalView}>
                        <Text style={modalStyles.modalTitle}>How are you feeling today?</Text>
                        <View style={modalStyles.moodOptionsContainer}>
                            {moodOptions.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={modalStyles.moodOptionButton}
                                    onPress={() => onSelectMood(item.value)}
                                >
                                    <Text style={modalStyles.moodOptionEmoji}>{item.emoji}</Text>
                                    <Text style={modalStyles.moodOptionLabel}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ImageBackground>
            </View>
        </Modal>
    );
};

const Journaling = ({ navigation, onToggleExtraButtons }) => {
    const { theme } = useContext(ThemeContext);
    const styles = useMemo(() => getStyles(theme), [theme]);
    const dispatch = useDispatch();

    // Get userId first before using it in other hooks
    const userId = useSelector(state => state.auth.userId);
    console.log("Journaling - userId:", userId);

    // Only fetch data if userId is available
    const { data: tradesData = [], isLoading: TradeLoading } = useTradeRecords(userId);
    const { data: moods, isLoading: MoodLoading, isError } = useAllMoods(userId);
    const { data: TodayData, isLoading: todayMoodLoading, refetch: refetchTodayMood } = useUserMood(userId);
    const uploadCSV = useUploadTradesCSV(userId);

    const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
    const [confirmationTitle, setConfirmationTitle] = useState('');
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [icon, setIcon] = useState(null);

    const [snackbar, setSnackbar] = React.useState({
        visible: false,
        message: '',
        type: '', // e.g., 'success' or 'error'
    });

    useEffect(() => {
        if (onToggleExtraButtons) {
            onToggleExtraButtons(showExtraButtons);
        }
    }, [showExtraButtons]);

    const [showExtraButtons, setShowExtraButtons] = useState(false);

    const { mutate: postMood } = usePostMood();
    const { mutate: updateMood } = useUpdateMood();

    const [selectedMood, setSelectedMood] = useState('happy');
    const [isMoodModalVisible, setIsMoodModalVisible] = useState(false);
    const [isSameDay, setIsSameDay] = useState(false);

    // State for the selected trade and ref for the bottom sheet
    const [selectedTrade, setSelectedTrade] = useState(null);
    const bottomSheetRef = useRef(null);

    // Handle loading states
    useEffect(() => {
        if (userId) {
            dispatch(startLoading());
            if (!MoodLoading && !todayMoodLoading && !TradeLoading) {
                dispatch(stopLoading());
            }
        }
    }, [todayMoodLoading, MoodLoading, TradeLoading, dispatch, userId]);

    // Check if mood for today exists and show modal if not
    useEffect(() => {
        if (!todayMoodLoading && userId) {
            const moodDate = TodayData?.createdAt ? new Date(TodayData.createdAt) : null;
            const today = new Date();

            const isSameDay = moodDate &&
                moodDate.getFullYear() === today.getFullYear() &&
                moodDate.getMonth() === today.getMonth() &&
                moodDate.getDate() === today.getDate();

            if (!isSameDay) {
                setIsSameDay(false);
                setIsMoodModalVisible(true);
            } else {
                setIsSameDay(true);
                setSelectedMood(TodayData.mood);
                setIsMoodModalVisible(false);
            }
        }
    }, [TodayData, todayMoodLoading, userId]);

    const latestTrades = useMemo(() => {
        if (!tradesData || !Array.isArray(tradesData)) return [];
        return [...tradesData]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
    }, [tradesData]);

    const calculateMetrics = (moods) => {
        const total = moods.length;
        if (!total) return null;

        const goodMoods = moods.filter(m => m.mood === 'good' || m.mood === 'happy').length;
        const averageMoods = moods.filter(m => m.mood === 'cool').length;
        const badMoods = moods.filter(m => m.mood === 'sad' || m.mood === 'angry').length;

        return {
            tradePlan: Math.round((goodMoods / total) * 100),
            riskManagement: Math.round((averageMoods / total) * 100),
            emotionalControl: Math.round((1 - (badMoods / total)) * 100),
        };
    };

    const metrics = useMemo(() => calculateMetrics(moods || []), [moods]);

    // mood options with emoji-to-value mapping
    const moodOptions = [
        { emoji: '😀', label: 'Good', value: 'Good' },
        { emoji: '😎', label: 'Cool', value: 'Cool' },
        { emoji: '😁', label: 'Happy', value: 'Happy' },
        { emoji: '😔', label: 'Sad', value: 'Sad' },
        { emoji: '😡', label: 'Angry', value: 'Angry' },
    ];

    React.useEffect(() => {
        if (snackbar.visible) {
            const timer = setTimeout(() => {
                setSnackbar((prev) => ({ ...prev, visible: false }));
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [snackbar.visible]);

    const handleMoodSelect = (moodValue) => {
        setSelectedMood(moodValue);

        if (isSameDay) {
            updateMood(
                { moodId: TodayData._id, mood: moodValue },
                {
                    onSuccess: () => {
                        refetchTodayMood();
                        setIsMoodModalVisible(false);
                        setSnackbar({
                            visible: true,
                            message: 'Mood updated successfully',
                            type: 'success',
                        });
                    },
                    onError: (error) => {
                        console.error('Failed to update mood:', error);
                        setSnackbar({
                            visible: true,
                            message: 'Failed to update mood. Please try again.',
                            type: 'error',
                        });
                    },
                }

            );
        } else {
            postMood(
                { userId, mood: moodValue },
                {
                    onSuccess: () => {
                        refetchTodayMood();
                        setIsMoodModalVisible(false);
                    },
                    onError: (error) => {
                        console.error('Failed to save mood:', error);
                        setSnackbar({
                            visible: true,
                            message: 'Failed to save mood.\n Please try again.',
                            type: 'error',
                        });
                    },
                }
            );
        }
    };

    const handleCSVUpload = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.plainText], // MIME type for .csv
                copyTo: 'cachesDirectory', // Optional: improves compatibility across Android/iOS
            });

            const file = result[0];

            // Optional: double-check extension
            if (!file.name.endsWith('.csv')) {
                Alert.alert('Invalid File', 'Please select a .csv file only.');
                return;
            }

            dispatch(startLoading());
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

    const handleTradeItemClick = (trade) => {
        setSelectedTrade(trade);
        bottomSheetRef.current?.open();
    };

    const randomQuote = useMemo(() => {
        const quotes = moodQuotes[selectedMood.toLowerCase()] || moodQuotes.happy;
        return quotes[Math.floor(Math.random() * quotes.length)];
    }, [selectedMood]);

    if (!userId || MoodLoading || todayMoodLoading || TradeLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
                {/* <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.primaryColor} />
                    <Text style={styles.loadingText}>Loading your journal...</Text>
                </View> */}
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Floating Button Container - Fixed Position */}
            <View style={styles.floatingButtonContainer}>
                {/* Add Data Button (Top Left of Add Button) */}

                {showExtraButtons && (
                    <TouchableOpacity
                        style={styles.extraButtonTop}
                        onPress={() => {
                            setShowExtraButtons(false);
                            navigation.navigate('Acc_FormData', { emotion: selectedMood });
                        }}
                    >
                        <Text style={styles.extraButtonText}>Add Trade</Text>
                    </TouchableOpacity>
                )}

                {/* Upload CSV Button (Bottom Left of Add Button) */}
                {showExtraButtons && (
                    <TouchableOpacity
                        style={styles.extraButtonBottom}
                        onPress={handleCSVUpload}
                    >
                        <Text style={styles.extraButtonText}>Import CSV</Text>
                    </TouchableOpacity>
                )}

                {/* Floating Plus Button */}
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

            {snackbar.visible && (
                <SnackbarMessage
                    message={snackbar.message}
                    type={snackbar.type}
                    visible={snackbar.visible}
                />
            )}

            {isConfirmationVisible && <ConfirmationModal
                isVisible={isConfirmationVisible}
                title={confirmationTitle}
                message={confirmationMessage}
                onClose={() => setIsConfirmationVisible(false)}
            />}

            {showExtraButtons && (
                <View style={styles.overlayBackground} />
            )}

            <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                {/* Gradient Card */}
                <TouchableOpacity>
                    <ImageBackground
                        source={colorBg}
                        style={styles.cardLinearGradient}
                    >
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Today's Focus</Text>
                            <Text style={styles.cardDescription}>{randomQuote}</Text>
                        </View>
                    </ImageBackground>
                </TouchableOpacity>

                {/* Metrics */}
                {metrics && (
                    <View style={styles.metricsContainer}>
                        <LinearGradient start={{ x: 0, y: 0.95 }} end={{ x: 1, y: 1 }}
                            colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']} style={styles.metricBoxLinearGradient}>
                            <View style={styles.metricBox}>
                                <Text style={styles.metricPercentage}>{metrics.tradePlan}%</Text>
                                <Text style={styles.metricDescription}>Stick to Your Trade Plan</Text>
                            </View>
                        </LinearGradient>

                        <LinearGradient start={{ x: 0, y: 0.95 }} end={{ x: 1, y: 1 }}
                            colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']} style={styles.metricBoxLinearGradient}>
                            <View style={styles.metricBox}>
                                <Text style={styles.metricPercentage}>{metrics.riskManagement}%</Text>
                                <Text style={styles.metricDescription}>Porting Risk Management</Text>
                            </View>
                        </LinearGradient>

                        <LinearGradient start={{ x: 0, y: 0.95 }} end={{ x: 1, y: 1 }}
                            colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']} style={styles.metricBoxLinearGradient}>
                            <View style={styles.metricBox}>
                                <Text style={styles.metricPercentage}>{metrics.emotionalControl}%</Text>
                                <Text style={styles.metricDescription}>Emotional Control</Text>
                            </View>
                        </LinearGradient>
                    </View>
                )}

                {/* Feeling Today */}
                <Text style={styles.sectionTitle}>How you're feeling Today?</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelectorScroll}>
                    {moodOptions.map((item, index) => {
                        const isActive = selectedMood === item.value;
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[styles.dayButton, isActive && styles.dayButtonActive]}
                                // onPress={() => handleMoodSelect(item.value)}
                                onLongPress={() => {
                                    // Long press to change mood without modal
                                    handleMoodSelect(item.value);
                                }}
                                delayLongPress={1000}
                            >
                                <Text style={[styles.dayButtonDate, isActive && styles.dayButtonDateActive]}>
                                    {item.emoji}
                                </Text>
                                <Text style={[styles.dayButtonDay, isActive && styles.dayButtonDayActive]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* Trading Journey Chart - Wrapped in error boundary */}
                <TradingJourneyChart userId={userId} />

                {/* Trades Section */}
                <View style={styles.tradesHeader}>
                    <Text style={styles.sectionTitle}>Trades</Text>
                    <TouchableOpacity
                        style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
                        onPress={() => navigation.navigate("Trading", { selectedMood: selectedMood })}>
                        <Text style={styles.manageTradesText}>Manage Trades</Text>
                        <Image source={back} style={{ width: 10, height: 10, resizeMode: "contain", tintColor: "#79869B", transform: [{ rotate: "180deg" }] }} />
                    </TouchableOpacity>
                </View>

                <View style={styles.tradesList}>
                    {latestTrades.length > 0 ? (
                        latestTrades.map((trade, index) => {
                            const isPositive = trade.result?.toLowerCase() === 'profit';
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleTradeItemClick(trade)}
                                >
                                    <LinearGradient
                                        start={{ x: 0, y: 0.95 }}
                                        end={{ x: 1, y: 1 }}
                                        colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                                        style={styles.tradeItemLinearGradient}
                                    >
                                        <View style={styles.tradeItem}>
                                            <View>
                                                <Text style={styles.tradeCompanyName}>{trade.stockName || 'N/A'}</Text>
                                                <Text style={styles.tradeSymbol}>{trade.tradeType || 'Type'}</Text>
                                            </View>
                                            <View style={styles.tradePriceContainer}>
                                                <Text style={styles.tradePrice}>${trade.exitPrice}</Text>
                                                <Text style={isPositive ? styles.tradeChangePositive : styles.tradeChangeNegative}>
                                                    {trade.result || 'N/A'}
                                                </Text>
                                            </View>
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>
                            );
                        })
                    ) : (
                        <View style={styles.emptyHabitsCard}>
                            <LinearGradient
                                start={{ x: 0, y: 0.95 }}
                                end={{ x: 1, y: 1 }}
                                colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                                style={styles.emptyHabitsContent}
                            >
                                <View style={{ padding: 24, alignItems: 'center', borderRadius: 13 }}>
                                    <View style={styles.emptyHabitsIconContainer}>
                                        <View style={styles.emptyHabitsIcon}>
                                            <Text style={styles.emptyHabitsIconText}>📊</Text>
                                        </View>
                                    </View>
                                    <View style={styles.emptyHabitsTextContainer}>
                                        <Text style={styles.emptyHabitsTitle}>No Trades Yet</Text>
                                        <Text style={styles.emptyHabitsSubtitle}>
                                            Start tracking your trading journey by adding your first trade
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.createHabitButton}
                                        onPress={() => navigation.navigate('Acc_FormData')}
                                    >
                                        <Text style={styles.createHabitButtonText}>Add Your First Trade</Text>
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        </View>
                    )}
                </View>
            </ScrollView>
            {/* The bottom sheet component */}
            <TradeBottomSheet ref={bottomSheetRef} trade={selectedTrade} />

            {/* Mood Selection Modal */}
            <MoodSelectionModal
                isVisible={isMoodModalVisible}
                onClose={() => setIsMoodModalVisible(false)}
                onSelectMood={handleMoodSelect}
                moodOptions={moodOptions}
                theme={theme}
            />
        </SafeAreaView>
    );
};


const getStyles = (theme) =>
    StyleSheet.create({

        container: {
            flex: 1,
            // margin: 0,
            // padding: 0,
            // position: "relative",
        },

        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        loadingText: {
            color: theme.textColor,
            fontSize: 16,
            marginTop: 10,
            fontFamily: 'Outfit-Regular',
        },
        scrollViewContent: {
            paddingBottom: 120, // Add extra padding to prevent overlap with floating button
        },

        card: {
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderWidth: 0.9,
            borderRadius: 8,
            borderColor: theme.borderColor,
            padding: 20,
        },
        cardLinearGradient: {
            // borderWidth: 0.9,
            borderRadius: 8,
            overflow: "hidden",
            // borderColor: theme.borderColor,
            marginBottom: 15,
        },
        cardTitle: {
            color: theme.textColor,
            fontSize: 12,
            fontFamily: 'Outfit-Bold',
            marginBottom: 5,
        },
        cardDescription: {
            color: theme.subTextColor,
            fontSize: 12,
            lineHeight: 20,
        },
        metricsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 15,
        },
        metricBox: {
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderRadius: 8,
            padding: 15,
            alignItems: 'center',
        },
        metricBoxLinearGradient: {
            borderWidth: 0.9,
            borderRadius: 8,
            borderColor: theme.borderColor,
            width: '32%',
        },
        metricPercentage: {
            color: theme.textColor,
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 5,
        },
        metricDescription: {
            color: theme.subTextColor,
            fontSize: 10,
            textAlign: 'center',
        },
        sectionTitle: {
            color: theme.textColor,
            fontSize: 14,
            fontFamily: 'Outfit-Regular',
        },
        daySelectorScroll: {
            marginVertical: 15,
        },
        dayButton: {
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderWidth: 0.9,
            borderColor: theme.borderColor,
            borderRadius: 8,
            paddingVertical: 10,
            marginRight: 7,
            alignItems: 'center',
            justifyContent: 'center',
            width: 65,
            height: 90,
        },
        dayButtonActive: {
            borderColor: theme.primaryColor,
            backgroundColor: 'rgba(29, 172, 255, 0.44)',
        },
        dayButtonDate: {
            fontSize: 30,
            resizeMode: "contain",
            marginBottom: 10,
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
        tradesHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        manageTradesText: {
            color: theme.primaryColor,
            fontSize: 11,
        },
        tradesList: {
            marginBottom: 20,
        },
        tradeItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 15,
            paddingHorizontal: 18,
            borderColor: theme.borderColor,
        },
        tradeItemLinearGradient: {
            overflow: "hidden",
            marginBottom: 10,
            borderWidth: 0.9,
            borderColor: theme.borderColor,
            borderRadius: 8,
        },
        tradeCompanyName: {
            color: theme.textColor,
            fontSize: 14,
            fontWeight: 'bold',
        },
        tradeSymbol: {
            marginTop: 3,
            color: theme.subTextColor,
            fontSize: 10,
            fontFamily: "Outfit-Regular",
        },
        tradePriceContainer: {
            alignItems: 'flex-end',
        },
        tradePrice: {
            color: theme.textColor,
            fontSize: 15,
            fontFamily: "Outfit-Light-BETA",
        },
        tradeChangePositive: {
            color: '#4CAF50',
            fontFamily: "Outfit-Light-BETA",
            fontSize: 11,
        },
        tradeChangeNegative: {
            color: '#FF5252',
            fontFamily: "Outfit-Light-BETA",
            fontSize: 11,
        },
        emptyHabitsCard: {
            borderRadius: 16,
            borderWidth: 0.9,
            borderColor: theme.borderColor,
            padding: 3,
            marginBottom: 15,
        },
        emptyHabitsContent: {
            borderRadius: 13,
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
        },
        emptyHabitsIconContainer: {
            marginBottom: 16,
        },
        emptyHabitsIcon: {
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: 'rgba(76, 175, 80, 0.15)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        emptyHabitsIconText: {
            fontSize: 28,
        },
        emptyHabitsTextContainer: {
            alignItems: 'center',
            marginBottom: 20,
        },
        emptyHabitsTitle: {
            color: theme.textColor,
            fontSize: 14,
            fontFamily: 'Outfit-Bold',
            marginBottom: 8,
            textAlign: 'center',
        },
        emptyHabitsSubtitle: {
            color: theme.subTextColor,
            fontSize: 12,
            fontFamily: 'Outfit-Regular',
            textAlign: 'center',
            lineHeight: 20,
            paddingHorizontal: 10,
        },
        createHabitButton: {
            backgroundColor: theme.primaryColor,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 12,
            shadowColor: theme.primaryColor,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 4,
        },
        createHabitButtonText: {
            color: '#FFFFFF',
            fontSize: 14,
            fontFamily: 'Outfit-SemiBold',
            textAlign: 'center',
        },
        overlayBackground: {
            ...StyleSheet.absoluteFillObject, // spread this object properly
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9, // high zIndex to be on top
        },


        floatingButtonContainer: {
            position: 'absolute',
            right: -33,
            top: 200,
            zIndex: 1000,
            // alignItems: 'center',
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

// Styles for the MoodSelectionModal
const getModalStyles = (theme) => StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalView: {
        alignItems: "center",
    },
    imageBg: {
        margin: 40,
        borderRadius: 20,
        padding: 35,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: 'auto',
        borderWidth: 1,
        borderColor: theme.borderColor,
    },
    modalTitle: {
        marginBottom: 20,
        textAlign: "center",
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.textColor,
    },
    moodOptionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    moodOptionButton: {
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        borderColor: theme.borderColor,
    },
    moodOptionEmoji: {
        fontSize: 30,
        marginBottom: 5,
    },
    moodOptionLabel: {
        color: theme.subTextColor,
        fontSize: 12,
    },
});

export default Journaling;
