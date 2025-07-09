import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { back, work, checkboxChecked, checkboxUnchecked } from '../../../../assets/images';
import { useGoalsByUser } from '../../../../functions/Goal';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '../../../../redux/slice/loaderSlice';
import { createHabitLog } from '../../../../functions/habbitFunctions';
import { ThemeContext } from '../../../../context/ThemeProvider';

export default function Accountability({ navigation }) {
    const [selectedFilter, setSelectedFilter] = useState('Daily');
    const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
    const filterOptions = ['Daily', 'Monthly', 'Yearly'];
    const userId = useSelector(state => state.auth.userId);
    const { data: apiGoals = [], isLoading } = useGoalsByUser(userId);
    const [goalsData, setGoalsData] = useState([]);
    const dispatch = useDispatch();
    const { theme } = useContext(ThemeContext);
    const styles = useMemo(() => getStyles(theme), [theme]);

    useEffect(() => {
        isLoading ? dispatch(startLoading()) : dispatch(stopLoading());
    }, [isLoading]);

    useEffect(() => {
        if (apiGoals.length > 0) setGoalsData(apiGoals);
    }, [apiGoals]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={"#0B1016"} />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.sectionTitle}>Your Accountability Details</Text>

                {/* Stats Grid */}
                <View style={styles.gridContainer}>
                    {[
                        { label: 'Total Goals on time', value: '15' },
                        { label: 'Streak', value: '10' },
                        { label: 'Pending Goals', value: '03' },
                        { label: 'Completed Habits', value: '03' },
                    ].map((item, idx) => (
                        <LinearGradient start={{ x: 0, y: 0.95 }} end={{ x: 1, y: 1 }}
                            colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                            key={idx}
                            style={styles.gridItem}
                        >
                            <Text style={styles.gridItemValue}>{item.value}</Text>
                            <Text style={styles.gridItemLabel}>{item.label}</Text>
                        </LinearGradient>
                    ))}
                </View>

                {/* My Growth */}
                <LinearGradient start={{ x: 0, y: 0.95 }} end={{ x: 1, y: 1 }}
                    colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                    style={styles.myGrowthCard}>
                    <Text style={styles.sectionTitle}>My Growth</Text>
                    <View style={{ width: "100%", flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
                        <View style={styles.progressCircleContainer}>
                            <View style={styles.progressCircle}>
                                <Text style={styles.progressText}>80%</Text>
                            </View>
                        </View>
                        <View style={styles.progressTaskContainer}>
                            <Image source={work} style={styles.progressTaskIcon} />
                            <Text style={styles.progressTaskText}>Progress Task: 80%</Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* Daily Breakdown */}
                <LinearGradient start={{ x: 0, y: 0.95 }} end={{ x: 1, y: 1 }}
                    colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                    style={styles.dailyBreakdownContainer}>
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
                </LinearGradient>

                {/* Success Tracker */}
                <View style={styles.successTrackerHeader}>
                    <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Success Tracker</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Goals")}
                        style={styles.manageRow}
                    >
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
                    {goalsData.length === 0 ? (
                        <Text style={{ color: '#AAA', fontSize: 12 }}>No goals found</Text>
                    ) : (
                        goalsData.map((goal) => (
                            <LinearGradient start={{ x: 0, y: 0.95 }} end={{ x: 1, y: 1 }}
                                colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                                key={goal._id}
                                style={styles.successTrackerItem}
                            >
                                <View style={styles.successTrackerTextContent}>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
                                        <TouchableOpacity
                                            onPress={async () => {
                                                const result = await createHabitLog({
                                                    userId,
                                                    habitId: goal._id,
                                                    status: "completed",
                                                });

                                                if (result.error) {
                                                    Alert.alert("Error", result.error);
                                                } else {
                                                    const updatedGoals = goalsData.map(item =>
                                                        item._id === goal._id ? { ...item, status: "completed" } : item
                                                    );
                                                    setGoalsData(updatedGoals);
                                                }
                                            }}
                                            style={styles.checkbox}
                                        >
                                            <Image
                                                source={goal.status === 'completed' ? checkboxChecked : checkboxUnchecked}
                                                style={{ width: 16, height: 16, resizeMode: 'contain' }}
                                            />
                                        </TouchableOpacity>
                                        <Text style={styles.successTrackerTitle}>
                                            {goal.title || "Untitled Goal"}
                                        </Text>
                                    </View>
                                    <Text style={styles.successTrackerDescription}>
                                        {goal.description || "No description"}
                                    </Text>
                                </View>
                            </LinearGradient>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}


const getStyles = (theme) => StyleSheet.create({

    container: {
        flex: 1,
    },
    scrollViewContent: {
        // paddingHorizontal: 20,
        // paddingBottom: 100, // To make space for bottom nav
    },
    sectionTitle: {
        color: theme.textColor,
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
        color: theme.textColor,
        fontSize: 20,
        fontFamily: 'Inter-Medium',
        // marginBottom: 5,
    },
    gridItemLabel: {
        color: theme.subTextColor,
        fontSize: 12,
    },
    myGrowthCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9,
        borderColor: theme.borderColor,
        borderRadius: 8,
        padding: 20,
        flexDirection: 'column',
        // alignItems: 'center',
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
        borderColor: theme.primaryColor, // Blue for progress ring
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1A1A2E', // Inner circle background
    },
    progressCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        // backgroundColor: '#2C2C4A', // Inner circle background
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
    progressTaskContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        paddingVertical: 7,
        paddingHorizontal: 15,
    },
    progressTaskIcon: {
        width: 28,
        height: 28,
        marginRight: 5,
    },
    progressTaskText: {
        color: '#000',
        fontSize: 12,
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
        color: theme.subTextColor,
        fontSize: 16,
        fontFamily: "Inter-SemiBold",
    },
    dailyBreakdownDate: {
        color: theme.subTextColor,
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
        backgroundColor: theme.primaryColor,
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
        backgroundColor: theme.primaryColor,
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
        color: "white",
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
        paddingVertical: 20,
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
        color: theme.textColor,
        flex: 1,
    },
    successTrackerDescription: {
        fontSize: 11,
        color: theme.subTextColor,
        // marginBottom: 10,
        lineHeight: 15,
    },

});

