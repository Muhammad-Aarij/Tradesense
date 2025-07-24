import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { ThemeContext } from '../context/ThemeProvider'; // Assuming you have a ThemeContext
import { useWeeklyProfitLoss } from '../functions/Trades';
import { trackAffiliateVisit } from '../functions/affiliateApi';

const { width } = Dimensions.get('window');

const TradingJourneyChart = ({ userId }) => { // Accept userId as a prop
    const { theme } = useContext(ThemeContext);
    const styles = useMemo(() => getStyles(theme), [theme]);

    // Use the custom hook to fetch data with the provided userId
    const { data, isLoading, isError, error } = useWeeklyProfitLoss(userId);
    // console.log("WeeklyData", data); // Corrected typo from "WeedlyData"

    // Transform fetched data into the format required by LineChart
    const lineData = useMemo(() => {
        // Ensure data is an array before attempting to sort or map
        const actualData = data || [];

        // Create a map for quick lookup of fetched data by date
        const dataMap = new Map();
        actualData.forEach(item => {
            const dateKey = new Date(item.date).toISOString().split('T')[0]; // Format 'YYYY-MM-DD'
            dataMap.set(dateKey, item.amount);
        });

        const chartData = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day

        // Generate data for the last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];

            // Get amount from fetched data or default to 0
            const amount = dataMap.has(dateKey) ? dataMap.get(dateKey) : 0;

            chartData.push({
                value: amount,
                label: date.toLocaleDateString('en-US', { weekday: 'short' }), // Day of the week (Mon, Tue, etc.)
                dataPointText: `${Math.round(amount)}`, // Data point text will be rounded number
                dateLabel: date.getDate(), // Date number (15, 16, etc.)
            });
        }

        return chartData;
    }, [data]);

    // Dynamically generate Y-axis labels based on lineData
    const yAxisLabels = useMemo(() => {
        const numLabels = 7; // Exactly 7 Y-axis labels

        if (lineData.length === 0) {
            // Default labels if no data is available yet
            return { labels: ['0k', '3k', '6k', '9k', '12k', '15k'], min: 0, max: 15000 };
        }

        const values = lineData.map(item => item.value);
        const rawMinValue = Math.min(...values);
        const rawMaxValue = Math.max(...values);

        const calculateNiceInterval = (min, max, numDivisions) => {
            const range = max - min || 1; // Avoid 0 range
            const roughInterval = range / numDivisions;
            const exponent = Math.floor(Math.log10(roughInterval));
            const fraction = roughInterval / Math.pow(10, exponent);

            let niceFraction;
            if (fraction <= 1) niceFraction = 1;
            else if (fraction <= 2) niceFraction = 2;
            else if (fraction <= 5) niceFraction = 5;
            else niceFraction = 10;

            return niceFraction * Math.pow(10, exponent);
        };

        const interval = calculateNiceInterval(rawMinValue, rawMaxValue, numLabels - 1);

        let yAxisMinValue = Math.floor(rawMinValue / interval) * interval;
        if (yAxisMinValue < 0 && rawMinValue >= 0) yAxisMinValue = 0; // Ensure min is not negative if all values are positive

        let yAxisMaxValue = yAxisMinValue + interval * (numLabels - 1);
        while (yAxisMaxValue < rawMaxValue) {
            yAxisMaxValue += interval;
        }

        // Final clamp for visible chart scale
        const labels = Array.from({ length: numLabels }, (_, i) => {
            const labelValue = yAxisMinValue + i * interval;
            if (isNaN(labelValue) || !isFinite(labelValue)) return '0';
            return labelValue >= 1000
                ? `${Math.round(labelValue / 1000)}k`
                : `${Math.round(labelValue)}`;
        });

        return {
            labels,
            min: yAxisMinValue,
            max: yAxisMaxValue,
        };
    }, [lineData]);

    if (isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={theme.primaryColor} />
                <Text style={styles.loadingText}>Loading trading data...</Text>
            </View>
        );
    }

    if (isError) {
        return (
            <View style={[styles.container, styles.errorContainer]}>
                <Text style={styles.errorText}>Error: {error?.message || 'Failed to fetch data'}</Text>
                <Text style={styles.errorText}>Please try again later.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.chartWrapper}>
                <LineChart
                    data={lineData}
                    width={width - 40} // Adjust width based on container padding (20 on each side)
                    height={200}
                    hideDataPoints
                    spacing={width / 9} // Dynamic spacing between data points
                    color={theme.primaryColor} // Line color
                    thickness={1}
                    hideRules={false} // Show horizontal rules
                    rulesColor={theme.borderColor} // Color of horizontal rules
                    rulesThickness={0.2} // Thickness of horizontal rules
                    xAxisColor={"transparent"}
                    yAxisColor={"transparent"} // Set Y-axis line color
                    xAxisLabelTextStyle={styles.xAxisLabel}
                    minValue={yAxisLabels.min}
                    maxValue={yAxisLabels.max}
                    stepValue={(yAxisLabels.max - yAxisLabels.min) / (yAxisLabels.labels.length - 1)}
                    yAxisTextStyle={styles.yAxisLabel}
                    howVerticalLines
                    verticalLinesColor={theme.borderColor}
                    verticalLinesThickness={0.2}
                    areaChart
                    startFillColor={theme.primaryColor}
                    endFillColor={theme.backgroundColor}
                    startOpacity={0.3}
                    endOpacity={0}
                    pointerConfig={{
                        pointerStripUptoDataPoint: true,
                        pointerLabelComponent: (items) => {
                            return (
                                <View style={styles.tooltip}>
                                    <Text style={styles.tooltipText}>
                                        {items[0].label} {items[0].dateLabel}
                                    </Text>
                                    <Text style={styles.tooltipText}>
                                        P/L: ${Math.round(items[0].value)}
                                    </Text>
                                </View>
                            );
                        },
                    }}
                    renderXAxisLabel={(item) => (
                        <View style={styles.customXAxisLabel}>
                            <Text style={styles.xAxisLabelDay}>{item.label}</Text>
                            <Text style={styles.xAxisLabelDate}>{item.dateLabel}</Text>
                        </View>
                    )}
                />
            </View>
        </View>
    );
};

const getStyles = (theme) => StyleSheet.create({
    container: {
        borderRadius: 8,
        marginBottom: 10,
    },
    loadingContainer: {
        minHeight: 250, // Ensure enough space for loading indicator
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.cardBackground,
    },
    loadingText: {
        marginTop: 10,
        color: theme.textColor,
        fontSize: 16,
    },
    errorContainer: {
        minHeight: 250,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.cardBackground,
    },
    errorText: {
        color: theme.errorColor || 'red', // Assuming theme has an errorColor or default to red
        fontSize: 16,
        textAlign: 'center',
        marginHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    title: {
        color: theme.textColor,
        fontSize: 18,
        fontWeight: 'bold',
    },
    arrowIcon: {
        width: 20,
        height: 20,
        tintColor: theme.textColor,
        transform: [{ rotate: '180deg' }],
    },
    chartWrapper: {
        alignItems: 'center',
        padding: 10,
    },
    xAxisLabel: {
        color: theme.subTextColor,
        fontSize: 12,
    },
    yAxisLabel: {
        color: theme.subTextColor,
        fontSize: 12,
    },
    customXAxisLabel: {
        marginBottom: 12,
        alignItems: 'center',
    },
    xAxisLabelDay: {
        color: theme.subTextColor,
        fontSize: 12,
        fontWeight: 'bold',
    },
    xAxisLabelDate: {
        color: theme.subTextColor,
        fontSize: 10,
    },
    tooltip: {
        backgroundColor: theme.primaryColor,
        padding: 8,
        width: 120,
        borderRadius: 5,
        alignItems: 'center',
    },
    tooltipText: {
        color: '#FFFFFF',
        fontSize: 12,
    },
});


export default TradingJourneyChart;