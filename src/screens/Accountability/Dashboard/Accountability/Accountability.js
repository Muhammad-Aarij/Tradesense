import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';
import theme from '../../../../themes/theme';
import { back } from '../../../../assets/images';

export default function Accountability() {
    const [selectedFilter, setSelectedFilter] = useState('Daily');
    const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
    const filterOptions = ['Daily', 'Monthly', 'Yearly'];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.primaryColor} />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>

                <Text style={styles.sectionTitle}>Your Accountability Details</Text>
                <View style={styles.gridContainer}>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridItemValue}>15</Text>
                        <Text style={styles.gridItemLabel}>Total Goals on time</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridItemValue}>10</Text>
                        <Text style={styles.gridItemLabel}>Streak</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridItemValue}>03</Text>
                        <Text style={styles.gridItemLabel}>Pending Goals</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridItemValue}>03</Text>
                        <Text style={styles.gridItemLabel}>Completed Habits</Text>
                    </View>
                </View>

                {/* My Growth */}
                <Text style={styles.sectionTitle}>My Growth</Text>
                <View style={styles.myGrowthCard}>
                    <View style={styles.progressCircleContainer}>
                        <View style={styles.progressCircle}>
                            <Text style={styles.progressText}>80%</Text>
                        </View>
                    </View>
                    <View style={styles.progressTaskContainer}>
                        <Image
                            source={{ uri: 'https://placehold.co/30x30/2C2C4A/A0A0B0?text=📄' }}
                            style={styles.progressTaskIcon}
                        />
                        <Text style={styles.progressTaskText}>Progress Task: 80%</Text>
                    </View>
                </View>

                {/* Daily Breakdown */}
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
                </View>

                {/* Success Tracker */}
                <View style={styles.successTrackerHeader}>
                    <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Success Tracker</Text>
                    <TouchableOpacity style={styles.manageRow}>
                        <Text style={styles.manageText}>Manage</Text>
                        <Image
                            source={back}
                            style={{
                                width: 10,
                                height: 10,
                                resizeMode: 'contain',
                                tintColor: theme.primaryColor,
                                transform: [{ rotate: '180deg' }],
                            }}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.successTrackerList}>
                    {[1, 2, 3].map((_, index) => (
                        <View key={index} style={styles.successTrackerItem}>
                            <TouchableOpacity style={styles.checkbox}>
                                <Text style={styles.iconPlaceholder}>☐</Text>
                            </TouchableOpacity>
                            <View style={styles.successTrackerTextContent}>
                                <Text style={styles.successTrackerTitle}>Morning Walk</Text>
                                <Text style={styles.successTrackerDescription}>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContent: {
        // paddingHorizontal: 20,
        // paddingBottom: 100, // To make space for bottom nav
    },
    sectionTitle: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        marginBottom: 15,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    gridItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9,
        borderColor: theme.borderColor,
        borderRadius: 8,
        padding: 15,
        width: '49%', // Roughly half width with spacing
        marginBottom: "2.5%",
    },
    gridItemValue: {
        color: '#FFF',
        fontSize: 20,
        fontFamily: 'Inter-Medium',
        // marginBottom: 5,
    },
    gridItemLabel: {
        color: '#FFFFFF',
        fontSize: 12,
    },
    myGrowthCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9,
        borderColor: theme.borderColor,
        borderRadius: 8,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    iconPlaceholder: {
        color: '#A0A0B0',
        fontSize: 14,
    },
    manageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },

    progressCircleContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 8,
        borderColor: '#007bff', // Blue for progress ring
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1A1A2E', // Inner circle background
    },
    progressCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#2C2C4A', // Inner circle background
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    progressTaskContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3A3A5A',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    progressTaskIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    progressTaskText: {
        color: '#FFF',
        fontSize: 16,
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
        fontSize: 16,
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
        backgroundColor: "rgba(255, 255, 255)",
        borderRadius: 8,
        paddingVertical: 10,
        zIndex: 1000,
    },
    
    optionItem: {
        zIndex: 1000,
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
    barChartPlaceholder: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3A3A5A', // Slightly lighter dark for chart area
        borderRadius: 10,
    },
    chartImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 10,
    },
    successTrackerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    manageText: {
        color: theme.primaryColor,
        fontSize: 11,
    },
    successTrackerList: {
        marginBottom: 20,
    },
    successTrackerItem: {
        flexDirection: 'row',
        alignItems: 'flex-start', // Align checkbox to top of text
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9,
        borderColor: theme.borderColor,
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
    },
    checkbox: {
        width: 17,
        height: 17,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#A0A0B0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    successTrackerTextContent: {
        flex: 1, // Take remaining space
    },
    successTrackerTitle: {
        fontSize: 14,
        fontFamily: "Inter-Regular",
        color: '#FFFFFF',
        flex: 1,
    },
    successTrackerDescription: {
        fontSize: 11,
        color: '#B0B0B0', // Lighter grey for description
        // marginBottom: 10,
        lineHeight: 15,
    },

});

