import React, { useContext, useMemo, useEffect, useState } from 'react';
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
    ImageBackground, // Import Modal
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { addBtn, back, bg } from '../../../../assets/images';
import { ThemeContext } from '../../../../context/ThemeProvider';
import { useUserMood, usePostMood, useUpdateMood, useAllMoods } from '../../../../functions/MoodApi';
import { useSelector } from 'react-redux';
import moodQuotes from './modes';
import { useTradeRecords } from '../../../../functions/Trades';
import TradingJourneyChart from '../../../../components/TradingJourneyChart';

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
                <ImageBackground source={bg} imageStyle={{ resizeMode: 'cover' }} style={modalStyles.imageBg} >
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
                        {/* <TouchableOpacity
                        style={modalStyles.closeButton}
                        onPress={onClose}
                    >
                        <Text style={modalStyles.closeButtonText}>Close</Text>
                    </TouchableOpacity> */}
                    </View>
                </ImageBackground>
            </View>
        </Modal >
    );
};

const Journaling = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const styles = useMemo(() => getStyles(theme), [theme]);

    const userId = useSelector(state => state.auth.userId);
    console.log("Journaling - userId:", userId);

    const { data: tradesData = [] } = useTradeRecords(userId);
    console.log("Journaling - Trades Data:", tradesData);

    const { data: moods, isLoading, isError } = useAllMoods(userId);
    const { data: TodayData, isLoading: todayMoodLoading, refetch: refetchTodayMood } = useUserMood(userId); // Added refetch
    const { mutate: postMood } = usePostMood();
    const { mutate: updateMood } = useUpdateMood();

    const [selectedMood, setSelectedMood] = useState('happy');
    const [isMoodModalVisible, setIsMoodModalVisible] = useState(false); // State for modal visibility

    // Check if mood for today exists and show modal if not
    useEffect(() => {
        // Only show modal if TodayData has loaded and there's no mood for today
        if (!todayMoodLoading && !TodayData?.mood) {
            console.log("No mood for today found.");
            setIsMoodModalVisible(true);
        } else if (TodayData?.mood) {
            console.log("Today's mood already exists:", TodayData.mood);
            setSelectedMood(TodayData.mood);
            setIsMoodModalVisible(false); // Ensure modal is closed if mood exists
        }
    }, [TodayData, todayMoodLoading]);


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
        { emoji: '😀', label: 'Good', value: 'good' },
        { emoji: '😎', label: 'Cool', value: 'cool' },
        { emoji: '😁', label: 'Happy', value: 'happy' },
        { emoji: '😔', label: 'Sad', value: 'sad' },
        { emoji: '😡', label: 'Angry', value: 'angry' },
    ];

    const handleMoodSelect = (moodValue) => {
        setSelectedMood(moodValue);

        if (TodayData?._id) {
            updateMood({ moodId: TodayData._id, mood: moodValue }, {
                onSuccess: () => {
                    refetchTodayMood(); // Refetch to update UI if necessary
                    setIsMoodModalVisible(false); // Close modal on success
                }
            });
        } else {
            postMood({ userId, mood: moodValue }, {
                onSuccess: () => {
                    refetchTodayMood(); // Refetch to get the newly posted mood
                    setIsMoodModalVisible(false); // Close modal on success
                }
            });
        }
    };

    const mood = selectedMood || "good"; // or any mood you prefer as default
    const randomQuote = useMemo(() => {
        const quotes = moodQuotes[mood] || ["Stay focused, stay consistent."];
        return quotes[Math.floor(Math.random() * quotes.length)];
    }, [mood]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("Acc_FormData")}>
                <Image source={addBtn} style={{ width: 35, height: 120, resizeMode: "contain", tintColor: theme.primaryColor }}></Image>
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>

                {/* Gradient Card */}
                <TouchableOpacity onPress={() => navigation.navigate("Acc_FormData")}>
                    <LinearGradient
                        start={{ x: 0, y: 0.95 }}
                        end={{ x: 1, y: 1 }}
                        colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                        style={styles.cardLinearGradient}
                    >
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Today's Focus</Text>
                            <Text style={styles.cardDescription}>{randomQuote}</Text>
                        </View>
                    </LinearGradient>
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
                                onPress={() => handleMoodSelect(item.value)}
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


                {/* Chart Section */}
                <View style={styles.tradesHeader}>
                    <Text style={styles.sectionTitle}>Your Trading Journey</Text>
                    <TouchableOpacity>
                        <Image source={back} style={{ width: 10, height: 10, resizeMode: "contain", tintColor: "#79869B", transform: [{ rotate: "180deg" }] }} />
                    </TouchableOpacity>
                </View>

                <TradingJourneyChart userId={userId} />

                {/* Trades Section */}
                <View style={styles.tradesHeader}>
                    <Text style={styles.sectionTitle}>Trades</Text>
                    <TouchableOpacity
                        style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
                        onPress={() => navigation.navigate("Trading")}>
                        <Text style={styles.manageTradesText}>Manage Trades</Text>
                        <Image source={back} style={{ width: 10, height: 10, resizeMode: "contain", tintColor: "#79869B", transform: [{ rotate: "180deg" }] }} />
                    </TouchableOpacity>
                </View>

                <View style={styles.tradesList}>
                    {latestTrades.length > 0 ? ( // Conditional rendering for trades list
                        latestTrades.map((trade, index) => {
                            const isPositive = trade.result?.toLowerCase() === 'profit';
                            return (
                                <LinearGradient
                                    key={index}
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
                                            <Text
                                                style={isPositive ? styles.tradeChangePositive : styles.tradeChangeNegative}>
                                                {trade.result} {isPositive ? '▲' : '▼'}
                                            </Text>
                                        </View>
                                    </View>
                                </LinearGradient>
                            );
                        })
                    ) : (
                        // Empty Habits Card - displayed when no trades are available
                        <LinearGradient
                            start={{ x: 0, y: 0.95 }}
                            end={{ x: 1, y: 1 }}
                            colors={['rgba(126, 126, 126, 0.2)', 'rgba(255,255,255,0)']}
                            style={styles.emptyHabitsCard}
                        >
                            <View style={styles.emptyHabitsContent}>
                                <View style={styles.emptyHabitsIconContainer}>
                                    <View style={styles.emptyHabitsIcon}>
                                        <Text style={styles.emptyHabitsIconText}>📈</Text>
                                    </View>
                                </View>
                                <View style={styles.emptyHabitsTextContainer}>
                                    <Text style={styles.emptyHabitsTitle}>No Trades Yet</Text>
                                    <Text style={styles.emptyHabitsSubtitle}>
                                        Start exploring the market and make your first trade. Every decision shapes your trading journey!
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.createHabitButton}
                                    onPress={() => navigation.navigate("Acc_FormData")}
                                >
                                    <Text style={styles.createHabitButtonText}>Start Trading</Text>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>

                    )}
                </View>


            </ScrollView>

            {/* Mood Selection Modal */}
            <MoodSelectionModal
                isVisible={isMoodModalVisible}
                onClose={() => setIsMoodModalVisible(false)} // Allow closing manually if needed
                onSelectMood={handleMoodSelect}
                moodOptions={moodOptions}
                theme={theme}
            />
        </SafeAreaView>
    );
};


const getStyles = (theme) =>
    StyleSheet.create({
        addButton: {
            position: "absolute",
            right: -20,
            top: 300,
            resizeMode: "contain",
            zIndex: 1000,
        },
        card: {
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderWidth: 0.9,
            borderRadius: 8,
            borderColor: theme.borderColor,
            padding: 20,
        },
        cardLinearGradient: {
            borderWidth: 0.9,
            borderRadius: 8,
            borderColor: theme.borderColor,
            marginBottom: 15,
        },
        cardTitle: {
            color: theme.textColor,
            fontSize: 14,
            fontWeight: 'bold',
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
            width: '32%', // Roughly one-third
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
            fontFamily: 'Inter-Regular',
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
            width: 65, // Fixed width for consistent look
            height: 90, // Fixed height
        },
        dayButtonActive: {
            borderColor: theme.primaryColor,
            backgroundColor: 'rgba(29, 172, 255, 0.44)', // Blue for active day
        },
        dayButtonDate: {
            fontSize: 30,
            resizeMode: "contain",
            marginBottom: 10,
        },
        dayButtonDateActive: {
            color: '#000', // Emoji color might not change easily with tintColor
        },
        dayButtonDay: {
            color: '#A0A0B0',
            fontSize: 12,
        },
        dayButtonDayActive: {
            color: '#FFF',
        },
        chartContainer: {
            backgroundColor: '#2C2C4A',
            borderRadius: 15,
            padding: 15,
            marginBottom: 20,
        },
        chartPlaceholder: {
            height: 150,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#3A3A5A', // Slightly lighter dark for chart area
            borderRadius: 10,
            marginBottom: 10,
        },
        chartPlaceholderText: {
            color: '#A0A0B0',
            fontSize: 16,
        },
        chartImage: {
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            borderRadius: 10,
        },
        chartLabels: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingHorizontal: 10,
        },
        chartLabelText: {
            color: '#A0A0B0',
            fontSize: 12,
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
            // borderRadius: 12, // This was commented out, keeping it that way
            padding: 15,
            paddingHorizontal: 18,
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            // borderWidth: 0.9, // This was commented out, keeping it that way
            borderColor: theme.borderColor,
        },
        tradeItemLinearGradient: {
            overflow: "hidden", // Important for borderRadius to work with gradient
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
            fontFamily: "Inter-Regular",
        },
        tradePriceContainer: {
            alignItems: 'flex-end',
        },
        tradePrice: {
            color: theme.textColor,
            fontSize: 15,
            fontFamily: "Inter-Light-BETA",
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
        // Styles for the empty habits card
        emptyHabitsCard: {
            borderRadius: 16,
            borderWidth: 0.9,
            borderColor: theme.borderColor,
            padding: 3,
            marginBottom: 15,
        },
        emptyHabitsContent: {
            alignItems: 'center',
            padding: 24,
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
            fontSize: 18,
            fontFamily: 'Inter-Bold',
            marginBottom: 8,
            textAlign: 'center',
        },
        emptyHabitsSubtitle: {
            color: theme.subTextColor,
            fontSize: 14,
            fontFamily: 'Inter-Regular',
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
            fontFamily: 'Inter-SemiBold',
            textAlign: 'center',
        },
    });

// Styles for the MoodSelectionModal
const getModalStyles = (theme) => StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark overlay
    },
    modalView: {
        alignItems: "center",
        // Removed padding from here, it's now on imageBg
    },

    imageBg: {
        margin: 40,
        borderRadius: 20,
        padding: 35, // Padding applied here
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
        backgroundColor: 'rgba(255, 255, 255, 0.08)', // Slightly lighter background for options
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
    closeButton: {
        backgroundColor: theme.primaryColor, // Use theme primary color
        borderRadius: 10,
        padding: 12,
        elevation: 2,
        marginTop: 15,
    },
    closeButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16,
    },
});

export default Journaling;
