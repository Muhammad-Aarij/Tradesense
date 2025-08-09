import React, { useState, useContext, useMemo } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView, ActivityIndicator
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { back } from '../assets/images';
import { ThemeContext } from '../context/ThemeProvider';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { useHabitLogs } from '../functions/habbitFunctions'; // Assuming this hook exists

const { width: screenWidth } = Dimensions.get('window'); // Renamed to avoid clash with chart width

const TopBreakdownChart = ({
    title = "Performance Overview", // Default title
    defaultFilter = 'Daily',
    navigation, // Add navigation prop
}) => {
    const { theme } = useContext(ThemeContext);

    const userId = useSelector(state => state.auth.userObject?._id);
    const [selectedFilter, setSelectedFilter] = useState(defaultFilter);
    const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);

    // Re-added filterOptions
    const filterOptions = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

    // Only fetch habit logs
    const { data: habitLogs = [], isLoading: isLoadingHabits, isError: isErrorHabits } = useHabitLogs(userId);

    const logs = habitLogs; // Always use habitLogs
    const isLoading = isLoadingHabits;
    const isError = isErrorHabits;

    const styles = useMemo(() => getStyles(theme), [theme]);

    const transformLogsToChartData = (logsData, filter) => {
        const now = new Date();
        const result = [];

        const extractDate = (log) => new Date(log.date); // Always use log.date for habit logs

        if (filter === 'Daily') {
            for (let i = 6; i >= 0; i--) { // Last 7 days
                const date = new Date(now);
                date.setDate(now.getDate() - i);
                const label = date.toLocaleDateString('en-US', { weekday: 'short' });
                const fullDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });

                const targetISO = date.toISOString().split('T')[0];
                const count = logsData.filter((log) => {
                    const logISO = extractDate(log).toISOString().split('T')[0];
                    return logISO === targetISO;
                }).length;

                result.push({
                    value: count,
                    label,
                    fullDate, // Used for tooltip
                    dataPointText: `${count}`,
                });
            }
        } else if (filter === 'Weekly') {
            // For weekly, show the last 7 weeks (current week + 6 previous)
            for (let i = 6; i >= 0; i--) {
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - (now.getDay() + 7 * i)); // Adjust to Sunday of the target week
                startOfWeek.setHours(0, 0, 0, 0);

                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                endOfWeek.setHours(23, 59, 59, 999);

                const label = `${startOfWeek.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}`;
                const fullDate = `${startOfWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;

                const count = logsData.filter((log) => {
                    const logDate = extractDate(log);
                    return logDate >= startOfWeek && logDate <= endOfWeek;
                }).length;

                result.push({
                    value: count,
                    label,
                    fullDate,
                    dataPointText: `${count}`,
                });
            }
        }
        else if (filter === 'Monthly') {
            for (let i = 5; i >= 0; i--) { // Last 6 months
                const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const label = month.toLocaleDateString('en-US', { month: 'short' });
                const fullDate = month.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                });

                const count = logsData.filter((log) => {
                    const logDate = extractDate(log);
                    return (
                        logDate.getFullYear() === month.getFullYear() &&
                        logDate.getMonth() === month.getMonth()
                    );
                }).length;

                result.push({
                    value: count,
                    label,
                    fullDate,
                    dataPointText: `${count}`,
                });
            }
        } else if (filter === 'Yearly') {
            for (let i = 4; i >= 0; i--) { // Last 5 years
                const year = now.getFullYear() - i;

                const count = logsData.filter(
                    (log) => extractDate(log).getFullYear() === year
                ).length;

                result.push({
                    value: count,
                    label: String(year),
                    fullDate: String(year),
                    dataPointText: `${count}`,
                });
            }
        }
        return result;
    };


    const chartData = useMemo(() => {
        return transformLogsToChartData(logs, selectedFilter);
    }, [logs, selectedFilter]);

    // Dynamic chart width for scrollability
    const chartWidth = useMemo(() => {
        const minWidth = screenWidth - 40; // Minimum width to fit screen with padding
        const itemWidth = 60; // Desired width per data point to ensure labels are readable
        // Ensure chart is at least screen width even with few data points
        return Math.max(minWidth, chartData.length * itemWidth);
    }, [chartData.length, screenWidth]);

    const yAxisRange = useMemo(() => {
        if (!chartData || chartData.length === 0) {
            return { min: 0, max: 10, noOfSections: 5 }; // Default range for no data
        }

        const values = chartData.map(item => item.value);
        const rawMinValue = Math.min(...values);
        const rawMaxValue = Math.max(...values);

        const calculateNiceOutfitval = (min, max, numDivisions) => {
            const range = max - min;
            if (range === 0) {
                return min === 0 ? 2 : Math.abs(min) * 0.2; // Adjusted for single value being 0 or non-zero
            }

            const roughOutfitval = range / numDivisions;
            const exponent = Math.floor(Math.log10(roughOutfitval));
            const base10 = Math.pow(10, exponent);

            let niceFraction;
            if (roughOutfitval / base10 <= 1) niceFraction = 1;
            else if (roughOutfitval / base10 <= 2) niceFraction = 2;
            else if (roughOutfitval / base10 <= 5) niceFraction = 5;
            else niceFraction = 10;

            return niceFraction * base10;
        };

        const numSections = 5;
        let Outfitval = calculateNiceOutfitval(rawMinValue, rawMaxValue, numSections);

        let yAxisMinValue;
        if (rawMinValue >= 0) {
            yAxisMinValue = 0;
        } else {
            yAxisMinValue = Math.floor(rawMinValue / Outfitval) * Outfitval;
        }

        let yAxisMaxValue = Math.ceil(rawMaxValue / Outfitval) * Outfitval;

        if (yAxisMaxValue <= yAxisMinValue) {
            yAxisMaxValue = yAxisMinValue + (Outfitval === 0 ? 10 : Outfitval); // Ensure positive range, fallback to 10 if Outfitval is 0
            if (Outfitval === 0) Outfitval = (yAxisMaxValue - yAxisMinValue) / numSections;
        }
        
        while (yAxisMaxValue < rawMaxValue) {
            yAxisMaxValue += Outfitval;
        }
        while (yAxisMinValue > rawMinValue) {
            yAxisMinValue -= Outfitval;
        }

        if (rawMinValue >= 0 && yAxisMinValue < 0) {
            yAxisMinValue = 0;
        }

        let noOfSections = (yAxisMaxValue - yAxisMinValue) / Outfitval;
        // Ensure noOfSections is an integer and at least 1
        noOfSections = Math.max(1, Math.round(noOfSections));

        // Fallback for edge cases where noOfSections might still be problematic
        if (noOfSections === 0 && yAxisMaxValue > yAxisMinValue) {
            noOfSections = 1;
        } else if (noOfSections === 0 && yAxisMaxValue === yAxisMinValue) {
            yAxisMaxValue = yAxisMinValue + 10;
            Outfitval = 2;
            noOfSections = 5;
        }


        return { min: yAxisMinValue, max: yAxisMaxValue, noOfSections, step: Outfitval };
    }, [chartData]);


    const hasData = () => {
        if (isLoading || isError) return true; 
        if (!logs || logs.length === 0) return false;

        const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
        return totalValue > 0;
    };

    const getChartDateRangeText = () => {
        if (!chartData || chartData.length === 0) {
            const now = new Date();
            if (selectedFilter === 'Daily') return now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            if (selectedFilter === 'Weekly') {
                 const startOfWeek = new Date(now);
                 startOfWeek.setDate(now.getDate() - now.getDay()); // Go back to Sunday
                 const endOfWeek = new Date(startOfWeek);
                 endOfWeek.setDate(startOfWeek.getDate() + 6);
                 return `${startOfWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
            }
            if (selectedFilter === 'Monthly') return now.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
            if (selectedFilter === 'Yearly') return now.toLocaleDateString('en-US', { year: 'numeric' });
            return '';
        }
        
        const firstValue = chartData[0];
        const lastValue = chartData[chartData.length - 1];

        if (!firstValue || !lastValue) {
            return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        }
        
        const startDate = new Date(firstValue.fullDate || new Date());
        const endDate = new Date(lastValue.fullDate || new Date());

        if (selectedFilter === 'Daily' || selectedFilter === 'Weekly') {
            return `${startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
        } else if (selectedFilter === 'Monthly') {
            return `${startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
        } else if (selectedFilter === 'Yearly') {
            return `${startDate.toLocaleDateString('en-US', { year: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { year: 'numeric' })}`;
        }
        return '';
    };

    const lastValue = chartData.length > 0 ? chartData[chartData.length - 1].value : 0;
    const chartFillColor = lastValue >= 0 ? theme.primaryColor : theme.errorColor || 'red';

    if (isLoading) {
        return (
            <LinearGradient
                start={{ x: 0, y: 1 }} end={{ x: 0.6, y: 1 }}
                colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                style={styles.LinearGradient}
            >
                <View style={[styles.dailyBreakdownContainer, styles.loadingContainer]}>
                    <ActivityIndicator size="large" color={theme.primaryColor} />
                    <Text style={styles.loadingText}>Loading chart data...</Text>
                </View>
            </LinearGradient>
        );
    }

    if (isError) {
        return (
            <LinearGradient
                start={{ x: 0, y: 1 }} end={{ x: 0.6, y: 1 }}
                colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                style={styles.LinearGradient}
            >
                <View style={[styles.dailyBreakdownContainer, styles.errorContainer]}>
                    <Text style={styles.errorText}>Error: Failed to load chart data.</Text>
                    <Text style={styles.errorText}>Please try again later.</Text>
                </View>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            start={{ x: 0, y: 1 }} end={{ x: 0.6, y: 1 }}
            colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
            style={styles.LinearGradient}
        >
            <View style={styles.dailyBreakdownContainer}>
                <View style={styles.dailyBreakdownHeader}>
                    <View>
                        <Text style={styles.dailyBreakdownTitle}>{title}</Text>
                        <Text style={styles.dailyBreakdownDate}>{getChartDateRangeText()}</Text>
                    </View>
                    <View style={{ position: 'relative' }}>
                        <TouchableOpacity
                            style={styles.dropdownContainer}
                            onPress={() => setFilterDropdownVisible(!filterDropdownVisible)}
                        >
                            <Text style={styles.dailyBreakdownFilter}>{selectedFilter}</Text>
                            <Image
                                source={back}
                                style={{
                                    ...styles.dropdownArrow,
                                    tintColor: "white",
                                    transform: [{ rotate: filterDropdownVisible ? '90deg' : '-90deg' }]
                                }}
                            />
                        </TouchableOpacity>

                        {filterDropdownVisible && (
                            <View style={styles.dropdownOptions}>
                                {filterOptions.map(option => (
                                    <TouchableOpacity
                                        key={option}
                                        style={styles.optionItem}
                                        onPress={() => {
                                            setSelectedFilter(option);
                                            setFilterDropdownVisible(false);
                                        }}
                                    >
                                        <Text style={styles.optionText}>{option}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </View>

                {hasData() ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chartScrollView}>
                        <View style={[styles.chartContainer, { width: chartWidth }]}>
                            <LineChart
                                data={chartData}
                                width={chartWidth - 40} // Inner width for the chart within the scrollable view
                                height={220}
                                color={chartFillColor}
                                curved
                                dataPointsColor={theme.textColor}
                                dataPointsRadius={4}
                                yAxisColor="transparent"
                                yAxisThickness={0}
                                yAxisTextStyle={styles.yAxisText}
                                minValue={yAxisRange.min}
                                maxValue={yAxisRange.max}
                                noOfSections={yAxisRange.noOfSections}
                                spacing={Math.max(60, (chartWidth - 40) / (chartData.length > 1 ? chartData.length - 1 : 1))} // Increased min spacing for labels
                                xAxisColor="transparent"
                                xAxisThickness={0}
                                xAxisLabelTextStyle={styles.xAxisText}
                                showXAxisLabels={true} // Explicitly show X-axis labels
                                verticalLinesOpacity={0.3}
                                rulesColor="transparent"
                                rulesThickness={0}
                                areaChart={true}
                                startFillColor={chartFillColor}
                                endFillColor={theme.backgroundColor}
                                startOpacity={0.3}
                                endOpacity={0}
                                poOutfitConfig={{
                                    poOutfitStripUptoDataPoint: true,
                                    poOutfitLabelComponent: (items) => {
                                        return (
                                            <View style={styles.tooltip}>
                                                <Text style={styles.tooltipText}>
                                                    {items[0].fullDate}
                                                </Text>
                                                <Text style={styles.tooltipText}>
                                                    Count: {items[0].value}
                                                </Text>
                                            </View>
                                        );
                                    },
                                }}
                            />
                        </View>
                    </ScrollView>

                ) : (
                    <View style={styles.noDataContainer}>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            colors={['rgba(17, 103, 177, 0.05)', 'rgba(42, 157, 244, 0.01)', 'transparent']}
                            style={styles.noDataGradientWrapper}
                        >
                            {/* Decorative circles */}
                            <View style={styles.decorativeCircle1} />
                            <View style={styles.decorativeCircle2} />

                            <TouchableOpacity 
                                style={styles.noDataContentContainer}
                                onPress={() => navigation?.navigate('Acc_FormData')}
                                activeOpacity={0.7}
                            >
                                <View
                                    style={styles.noDataIconContainer}
                                >
                                    <Text style={styles.noDataIcon}>🎯</Text> {/* Always habit icon */}
                                    <View style={styles.iconGlow} />
                                </View>

                                <Text style={styles.noDataTitle}>
                                    {selectedFilter === 'Daily' ? 'Your Journey Awaits' :
                                        selectedFilter === 'Monthly' ? 'A Fresh Start Awaits' :
                                            'Endless Possibilities Ahead'}
                                </Text>

                                <Text style={styles.noDataSubtitle}>
                                    Great things never come from comfort zones. Start today.
                                </Text>

                                <View style={styles.noDataActionContainer}>
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        colors={[theme.primaryColor, theme.primaryColor + '80']}
                                        style={styles.noDataDot}
                                    />
                                    <Text style={styles.noDataMessage}>
                                        Plant the seeds of success with your first habit today
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                )}
            </View>
        </LinearGradient>
    );
};

const getStyles = (theme) => StyleSheet.create({
    dailyBreakdownContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: 8,
        padding: 20,
    },
    LinearGradient: {
        borderWidth: 0.9,
        borderColor: theme.borderColor,
        borderRadius: 8,
        marginBottom: 30,
    },
    dailyBreakdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    dailyBreakdownTitle: {
        color: theme.subTextColor,
        fontSize: 16,
        fontFamily: 'Outfit-SemiBold',
    },
    dailyBreakdownDate: {
        color: theme.subTextColor,
        fontSize: 12,
        fontFamily: 'Outfit-Light-BETA',
    },
    dropdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.primaryColor,
        borderRadius: 8,
        paddingVertical: 7,
        paddingHorizontal: 12,
        justifyContent: 'space-between',
    },
    dropdownArrow: {
        width: 10,
        height: 10,
        resizeMode: 'contain',
        tintColor: '#CCCCCC',
    },
    dropdownOptions: {
        position: 'absolute',
        top: 35,
        left: 0,
        width: '100%',
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
        color: 'white',
        fontSize: 12,
        fontFamily: 'Outfit-Regular',
    },
    dailyBreakdownFilter: {
        color: '#FFF',
        fontSize: 12,
        fontFamily: 'Outfit-Medium',
        paddingHorizontal: 8,
    },
    chartScrollView: {
        borderRadius: 8,
        overflow: 'hidden',
        height: 220, // Maintain height for the scroll view
    },
    chartContainer: {
        // This container determines the scrollable width
        height: '100%', // Take full height of scroll view
        justifyContent: 'center',
        alignItems: 'center',
    },
    customDataPoint: {
        width: 12,
        height: 12,
        backgroundColor: theme.primaryColor,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: theme.bg || '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerDot: {
        width: 4,
        height: 4,
        backgroundColor: theme.textColor,
        borderRadius: 2,
    },
    yAxisText: {
        marginRight: 15,
        color: theme.subTextColor,
        fontSize: 12,
        fontFamily: 'Outfit-Light-BETA',
    },
    xAxisText: {
        marginBottom: 5,
        color: theme.subTextColor,
        fontSize: 12,
        fontFamily: 'Outfit-Light-BETA',
    },
    tooltip: {
        backgroundColor: theme.primaryColor,
        borderRadius: 8,
        padding: 10,
        zIndex: 10000,
    },
    tooltipText: {
        color: '#F9FAFB',
        fontSize: 11,
    },
    noDataContainer: {
        marginTop: 10,
        overflow: 'hidden',
    },
    noDataGradientWrapper: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden',
    },
    noDataContentContainer: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
        minHeight: 280,
    },
    decorativeCircle1: {
        position: 'absolute',
        top: -30,
        right: -30,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        opacity: 0.6,
    },
    decorativeCircle2: {
        position: 'absolute',
        bottom: -40,
        left: -40,
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(147, 51, 234, 0.06)',
        opacity: 0.4,
    },
    noDataIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 20,
        position: 'relative',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        marginVertical: 20,
    },
    iconGlow: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.primaryColor,
        opacity: 0.1,
        zIndex: -1,
    },
    noDataIcon: {
        fontSize: 36,
        zIndex: 1,
    },
    noDataTitle: {
        color: theme.subTextColor,
        fontSize: 18,
        fontFamily: 'Outfit-Bold',
        marginBottom: 10,
        textAlign: 'center',
        letterSpacing: 0.3,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        paddingHorizontal: 8,
    },
    noDataSubtitle: {
        color: theme.subTextColor,
        fontSize: 14,
        fontFamily: 'Outfit-Medium',
        textAlign: 'center',
        opacity: 0.9,
        marginBottom: 24,
        lineHeight: 20,
        paddingHorizontal: 12,
    },
    noDataActionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        marginHorizontal: 4,
    },
    noDataDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 12,
        shadowColor: theme.primaryColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 4,
    },
    noDataMessage: {
        color: theme.subTextColor,
        fontSize: 13,
        fontFamily: 'Outfit-Medium',
        textAlign: 'left',
        lineHeight: 19,
        opacity: 0.9,
        flex: 1,
        letterSpacing: 0.1,
    },
    loadingContainer: {
        minHeight: 280,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: theme.textColor,
        fontSize: 16,
    },
    errorContainer: {
        minHeight: 280,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: theme.errorColor || 'red',
        fontSize: 16,
        textAlign: 'center',
        marginHorizontal: 20,
    },
});

export default TopBreakdownChart;