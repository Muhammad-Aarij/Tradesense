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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { back } from '../../../../assets/images';
import { ThemeContext } from '../../../../context/ThemeProvider';
import { useUserMood, usePostMood, useUpdateMood } from '../../../../functions/MoodApi';
import { useSelector } from 'react-redux';


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

const Journaling = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const styles = useMemo(() => getStyles(theme), [theme]);

    const userId = useSelector(state => state.auth.userId);

    const { data: moodData } = useUserMood(userId);
    const { mutate: postMood } = usePostMood();
    const { mutate: updateMood } = useUpdateMood();

    const [selectedMood, setSelectedMood] = useState('happy');

    // mood options with emoji-to-value mapping
    const moodOptions = [
        { emoji: '😀', label: 'Good', value: 'good' },
        { emoji: '😎', label: 'Cool', value: 'cool' },
        { emoji: '😁', label: 'Happy', value: 'happy' },
        { emoji: '😔', label: 'Sad', value: 'sad' },
        { emoji: '😡', label: 'Angry', value: 'angry' },
    ];
    useEffect(() => {
        if (moodData?.mood) {
            setSelectedMood(moodData.mood);
        }
    }, [moodData]);

    const handleMoodSelect = (moodValue) => {
        setSelectedMood(moodValue);

        if (moodData?._id) {
            updateMood({ moodId: moodData._id, mood: moodValue });
        } else {
            postMood({ userId, mood: moodValue });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>

                {/* Gradient Card */}
                <TouchableOpacity onPress={() => navigation.navigate("Acc_FormData")}>
                    <LinearGradient start={{ x: 0, y: 0.95 }} end={{ x: 1, y: 1 }}
                        colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                        style={styles.cardLinearGradient}>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Trading Improve today</Text>
                            <Text style={styles.cardDescription}>
                                Emotional Control and Risk Management are up to 15%, while timebox trading decreased by 20%.
                            </Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Metrics */}
                <View style={styles.metricsContainer}>
                    <LinearGradient start={{ x: 0, y: 0.95 }} end={{ x: 1, y: 1 }}
                        colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']} style={styles.metricBoxLinearGradient}>
                        <View style={styles.metricBox}>
                            <Text style={styles.metricPercentage}>85%</Text>
                            <Text style={styles.metricDescription}>Stick to Your Trade Plan</Text>
                        </View>
                    </LinearGradient>
                    <LinearGradient start={{ x: 0, y: 0.95 }} end={{ x: 1, y: 1 }}
                        colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']} style={styles.metricBoxLinearGradient}>
                        <View style={styles.metricBox}>
                            <Text style={styles.metricPercentage}>75%</Text>
                            <Text style={styles.metricDescription}>Porting Risk Management</Text>
                        </View>
                    </LinearGradient>
                    <LinearGradient start={{ x: 0, y: 0.95 }} end={{ x: 1, y: 1 }}
                        colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']} style={styles.metricBoxLinearGradient}>
                        <View style={styles.metricBox}>
                            <Text style={styles.metricPercentage}>95%</Text>
                            <Text style={styles.metricDescription}>Emotional Control</Text>
                        </View>
                    </LinearGradient>
                </View>

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

                <View style={styles.chartContainer}>
                    <View style={styles.chartPlaceholder}>
                        <Text style={styles.chartPlaceholderText}>Chart Placeholder</Text>
                        <Image
                            source={{ uri: 'https://placehold.co/350x150/2C2C4A/A0A0B0?text=Trading+Chart' }}
                            style={styles.chartImage}
                        />
                    </View>
                    <View style={styles.chartLabels}>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'].map((day, index) => (
                            <Text key={index} style={styles.chartLabelText}>{day}</Text>
                        ))}
                    </View>
                </View>

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
                    {trades.map((trade, index) => (
                        <LinearGradient start={{ x: 0, y: 0.95 }} end={{ x: 1, y: 1 }}
                            colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                            key={index}
                            style={styles.tradeItemLinearGradient}>
                            <View style={styles.tradeItem}>
                                <View>
                                    <Text style={styles.tradeCompanyName}>{trade.company}</Text>
                                    <Text style={styles.tradeSymbol}>{trade.symbol}</Text>
                                </View>
                                <View style={styles.tradePriceContainer}>
                                    <Text style={styles.tradePrice}>{trade.price}</Text>
                                    <Text
                                        style={trade.isPositive ? styles.tradeChangePositive : styles.tradeChangeNegative}>
                                        {trade.change}
                                        {trade.isPositive ? ' ▲' : ' ▼'}
                                    </Text>
                                </View>
                            </View>
                        </LinearGradient>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};


const getStyles = (theme) =>
    StyleSheet.create({
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
            backgroundColor: '#2C2C4A',
            borderRadius: 8,
            paddingVertical: 10,
            // paddingHorizontal: 12,
            marginRight: 7,
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
        // circle: {
        //     backgroundColor: "white",
        //     borderRadius: 100,
        //     flexDirection: "row",
        //     justifyContent: "center",
        //     alignItems: "center",
        //     marginBottom: 12,
        // },
        dayButtonDate: {
            fontSize: 30,
            // height: 35,
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
            borderRadius: 12,
            padding: 15,
            paddingHorizontal: 18,
            // marginBottom: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderWidth: 0.9,
            borderColor: theme.borderColor,
        },
        tradeItemLinearGradient: {
            // flexDirection: 'row',
            // justifyContent: 'space-between',
            // alignItems: 'center',
            // backgroundColor: '#2C2C4A',
            borderRadius: 12,
            // padding: 15,
            // paddingHorizontal: 18,
            marginBottom: 10,
            // backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderWidth: 0.9,
            borderColor: theme.borderColor,
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

export default Journaling;
