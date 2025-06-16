import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ImageBackground, Touchable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { bell, bg, user, back } from '../../../assets/images';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { useDispatch } from 'react-redux';
// import theme from '../../../themes/theme';

const theme = {
    primaryColor: '#70C2E8', // Green
    darkBlue: '#080E17', // Dark Blue
    black: "000000", // Black
    borderColor: '#272e36', // Border Color
    lightGray: '#B6B6B6', // Light Gray
    bg: bg,
    textColor: "#FFFFFF",
    transparentBg: 'rgba(255, 255, 255, 0.06)',
}

const { width } = Dimensions.get('window');

// const maxChartValue = Math.max(...dailyBreakdownData.map(d => d.value));

// const dailyBreakdownData = [
//     { day: 'Jan 18, 2020', value: 100 },
//     { day: '', value: 150 },
//     { day: '', value: 90 },
//     { day: '', value: 180 },
//     { day: '', value: 120 },
//     { day: '', value: 200 },
//     { day: '', value: 160 },
// ];

// const chartHeightScale = 100 / maxChartValue; // Scale bars to max height of 100px
const AffiliateDashboardScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [selectedFilter, setSelectedFilter] = useState('Daily');
    const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
    const filterOptions = ['Daily', 'Monthly', 'Yearly'];

    useEffect(() => {
        console.log('CourseDetailScreen Mounted');
        dispatch(startLoading());
        setTimeout(() => {
            dispatch(stopLoading());
        }, 3000);
    }, []);

    return (


        <ImageBackground source={bg} style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image source={user} style={styles.avatar} />
                    <View>
                        <Text style={styles.greeting}>Good Evening! 😊</Text>
                        <Text style={styles.username}>Alwin Smith</Text>
                    </View>
                </View>
                {/* Ensuring the bell stays aligned */}
                <Image source={bell} style={{ width: 40, height: 40, resizeMode: "contain", alignSelf: 'center' }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Stats Section */}
                <View style={styles.statsContainer}>
                    <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate("WithdrawScreen")}>
                        <Text style={styles.statLabel}>$1534.09</Text>
                        <Text style={styles.statValue}>Available Balance</Text>
                    </TouchableOpacity>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>9.7%</Text>
                        <Text style={styles.statValue}>Conversion Rate</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>1087</Text>
                        <Text style={styles.statValue}>Views</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>128</Text>
                        <Text style={styles.statValue}>Clicks</Text>
                    </View>
                </View>

                {/* Daily Breakdown Chart */}
                <View style={styles.dailyBreakdownContainer}>
                    <View style={styles.dailyBreakdownHeader}>
                        <View>
                            <Text style={styles.dailyBreakdownTitle}>Daily Breakdown</Text>
                            <Text style={styles.dailyBreakdownDate}>January 18, 2020</Text>
                        </View>
                        <View style={{ position: "relative" }}>
                            <TouchableOpacity
                                style={styles.dropdownContainer}
                                onPress={() => setFilterDropdownVisible(!filterDropdownVisible)}
                            >
                                <Text style={styles.dailyBreakdownFilter}>{selectedFilter}</Text>
                                <Image
                                    source={back}
                                    style={{
                                        ...styles.dropdownArrow,
                                        transform: [{ rotate: filterDropdownVisible ? '90deg' : '-90deg' }]
                                    }}
                                />
                            </TouchableOpacity>

                            {/* Dropdown options */}
                            {filterDropdownVisible && (
                                <View style={styles.dropdownOptions}>
                                    {filterOptions.map((option) => (
                                        <TouchableOpacity key={option} style={styles.optionItem} onPress={() => {
                                            setSelectedFilter(option);
                                            setFilterDropdownVisible(false);
                                        }}>
                                            <Text style={styles.optionText}>{option}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                    </View>
                    {/* <View style={styles.chartContainer}>
                        {dailyBreakdownData.map((data, index) => (
                            <View key={index} style={styles.barContainer}>
                                <View
                                    style={[
                                        styles.bar,
                                        { height: data.value * chartHeightScale }, // Scale bar height
                                    ]}
                                />
                            </View>
                        ))}
                    </View> */}
                    <View style={styles.chartFooter}>
                        <View style={styles.chartFooterItem}>
                            <Text style={styles.chartFooterValue}>$153</Text>
                            <Text style={styles.chartFooterLabel}>Earnings</Text>
                        </View>
                        <View style={styles.chartFooterItem}>
                            <Text style={styles.chartFooterValue}>9.7%</Text>
                            <Text style={styles.chartFooterLabel}>Conversion</Text>
                        </View>
                        <View style={styles.chartFooterItem}>
                            <Text style={styles.chartFooterValue}>10</Text>
                            <Text style={styles.chartFooterLabel}>New Sub</Text>
                        </View>
                        <View style={styles.chartFooterItem}>
                            <Text style={styles.chartFooterValue}>15</Text>
                            <Text style={styles.chartFooterLabel}>Sales</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>
        </ImageBackground >
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#08131F', padding: 25, paddingBottom: 0 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        marginBottom: 35,
    },
    avatar: { width: 45, height: 45, borderRadius: 8, marginRight: 10 },
    greeting: { color: theme.primaryColor, fontSize: 14, fontFamily: 'Inter-Regular' },
    username: { color: 'white', fontSize: 12, fontFamily: 'Inter-Medium' },
    scrollContent: {
        paddingBottom: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 7,
    },
    statCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9, borderColor: theme.borderColor,
        borderRadius: 8,
        width: (width - 65) / 2, // (screen_width - 2*padding - space_between) / 2
        padding: 15,
        marginBottom: 16,
        alignItems: 'flex-start',
    },
    statLabel: {
        color: '#FFF', // Blue for main numbers
        fontSize: 22,
        fontFamily: "Inter-SemiBold",
        // marginBottom: 5,
    },
    statValue: {
        color: '#CCCCCC',
        fontSize: 10,
        fontFamily: "Inter-Light-BETA",
    },
    dailyBreakdownContainer: {
        backgroundColor: '#1C2B3A',
        borderRadius: 12,
        padding: 20,
        marginBottom: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9, borderColor: theme.borderColor,
        borderRadius: 8,
    },
    dailyBreakdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'center',
        marginBottom: 20,
    },
    dailyBreakdownTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: "Inter-SemiBold",
    },
    dailyBreakdownDate: {
        color: '#AAAAAA',
        fontSize: 12,
        fontFamily: "Inter-Light-BETA",
    },
    dailyBreakdownFilter: {
        // backgroundColor: 'rgba(255, 255, 255, 0.06)',
        // borderWidth: 0.9, borderColor: theme.borderColor,
        borderRadius: 8,
        // paddingVertical: 7,
        paddingHorizontal: 8,
        color: '#FFF',
        fontSize: 12,
        fontFamily: "Inter-Medium",
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end', // Bars should start from bottom
        height: 100, // Fixed height for chart area
        marginBottom: 20,
    },
    // barContainer: {
    //     width: (width - 100) / dailyBreakdownData.length, // Distribute bars evenly
    //     marginHorizontal: 2,
    //     backgroundColor: 'rgba(0,0,0,0.3)', // Background for each bar column
    //     borderRadius: 4,
    //     justifyContent: 'flex-end',
    //     alignItems: 'center',
    // },
    // bar: {
    //     width: '80%', // Width of the bar itself within its container
    //     backgroundColor: '#007BFF', // Blue bar color
    //     borderRadius: 4,
    // },
    chartFooter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chartFooterItem: {
        width: '48%', // This ensures wrapping happens dynamically
        alignItems: 'center',
        marginBottom: 15,
    },

    chartFooterValue: {
        color: '#FFFFFF',
        fontSize: 17,
        fontFamily: "Inter-SemiBold",
        marginBottom: 5,
    },
    chartFooterLabel: {
        color: '#AAAAAA',
        fontSize: 11,
        fontFamily: "Inter-Light-BETA",
    },



    dropdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9,
        borderColor: theme.borderColor,
        borderRadius: 8,
        paddingVertical: 7,
        paddingHorizontal: 12,
        justifyContent: 'space-between',
    },

    dropdownOptions: {
        position: "absolute",
        top: 35,
        left: 0,
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.86)",
        borderRadius: 8,
        paddingVertical: 10,
        zIndex: 10,
    },

    optionItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
    },

    optionText: {
        color: theme.darkBlue,
        fontSize: 12,
        fontFamily: "Inter-Regular",
    },

    dropdownArrow: {
        width: 10,
        height: 10,
        resizeMode: 'contain',
        tintColor: '#CCCCCC',
        transform: [{ rotate: '90deg' }], // Adjust for dropdown arrow
    },

});

export default AffiliateDashboardScreen;
