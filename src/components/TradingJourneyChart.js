import React, { useContext, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    Image,
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts'; // Ensure this library is installed
import { ThemeContext } from '../context/ThemeProvider'; // Assuming ThemeProvider exists
import { useWeeklyProfitLoss } from '../functions/Trades'; // Assuming useWeeklyProfitLoss hook exists
// Placeholder image for the back arrow. Replace with your actual local asset.
import { back } from '../assets/images'; 
// Example: const back = require('../assets/images/back.png');

const { width } = Dimensions.get('window');
const CHART_HEIGHT = 220;
const HORIZONTAL_PADDING = 20; // Padding applied to the container, affects chart width

const TradingJourneyChart = ({ userId }) => {
    const { theme } = useContext(ThemeContext);
    const styles = useMemo(() => createStyles(theme), [theme]);

    // State to track if there was an internal chart processing error
    const [chartProcessingError, setChartProcessingError] = useState(false);

    // Early return if no userId to prevent unnecessary API calls or errors
    if (!userId) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>User ID not available for chart.</Text>
            </View>
        );
    }

    const { data, isLoading, isError, error } = useWeeklyProfitLoss(userId);

    // Memoized computation for raw series data
    const rawSeries = useMemo(() => {
        setChartProcessingError(false); // Reset error state on new data
        try {
            if (!data || !Array.isArray(data) || data.length === 0) {
                return [];
            }

            // Create a map for quick lookup of amount by date
            const map = new Map(data.map(i => [
                new Date(i.date).toISOString().split('T')[0], // YYYY-MM-DD
                i.amount,
            ]));

            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize to start of today

            const out = [];
            for (let i = 6; i >= 0; i--) { // Last 7 days including today
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                const key = d.toISOString().split('T')[0];
                const val = map.get(key) ?? 0; // Default to 0 if no data for the day

                out.push({
                    value: val, // Use 'value' directly for the chart data points
                    label: d.toLocaleDateString('en-US', { weekday: 'short' }), // Mon, Tue, etc.
                    dateLabel: d.getDate(), // Day of the month (e.g., 25)
                });
            }
            return out;
        } catch (e) {
            console.error('Failed to process raw series data:', e);
            setChartProcessingError(true);
            return [];
        }
    }, [data]);

    // Memoized computation for axis information
    const axisInfo = useMemo(() => {
        setChartProcessingError(false); // Reset error state
        try {
            if (!rawSeries || rawSeries.length === 0) {
                // Default safe values for an empty chart
                return { min: 0, max: 1, labels: ['0', '0.2', '0.4', '0.6', '0.8', '1'] };
            }

            const values = rawSeries.map(p => p.value);
            const minVal = Math.min(...values);
            const maxVal = Math.max(...values);

            // Calculate a 'nice' step value for the Y-axis
            // Ensure maxVal - minVal is not zero to prevent division by zero
            const range = maxVal - minVal === 0 ? 1 : maxVal - minVal; 
            const roughStep = range / 6; // Aim for 6 labels
            const exponent = Math.floor(Math.log10(roughStep));
            const fraction = roughStep / (10 ** exponent);
            let niceFraction;

            if (fraction <= 1) niceFraction = 1;
            else if (fraction <= 2) niceFraction = 2;
            else if (fraction <= 5) niceFraction = 5;
            else niceFraction = 10;

            const step = niceFraction * (10 ** exponent);

            // Adjust min and max to be multiples of step for cleaner axis
            const finalMin = Math.floor(minVal / step) * step;
            const finalMax = Math.ceil(maxVal / step) * step;

            const labels = Array.from({ length: 7 }, (_, i) => {
                const val = finalMin + (i * step);
                // Format labels: use 'k' for thousands, otherwise fixed decimal places
                if (Math.abs(val) >= 1000) {
                    return `${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k`;
                }
                return val.toFixed(val % 1 === 0 ? 0 : 2); // 0 or 2 decimal places
            });

            return { min: finalMin, max: finalMax, labels };
        } catch (e) {
            console.error('Failed to compute axis info:', e);
            setChartProcessingError(true);
            // Fallback to safe default values
            return { min: 0, max: 1, labels: ['0', '0.2', '0.4', '0.6', '0.8', '1'] };
        }
    }, [rawSeries]);

    // Display loading state
    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={theme.primaryColor} />
                <Text style={styles.loadingText}>Loading chart data...</Text>
            </View>
        );
    }

    // Display error state (from API or internal processing)
    if (isError || chartProcessingError) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>
                    {isError ? error?.message || 'Failed to load chart data.' : 'Error processing chart data.'}
                </Text>
            </View>
        );
    }

    // Display empty data state
    if (!rawSeries || rawSeries.length === 0) {
        return (
            <View style={{...styles.center,marginBottom:15,}}>
                <Text style={styles.errorText}>No trading data available for the last 7 days.</Text>
            </View>
        );
    }

    // Main chart rendering
    return (
        <View style={styles.container}>
            <View style={styles.tradesHeader}>
                <Text style={styles.sectionTitle}>Your Trading Journey</Text>
                <TouchableOpacity>
                    <Image
                        source={back}
                        style={{
                            width: 10,
                            height: 10,
                            resizeMode: "contain",
                            tintColor: "#79869B",
                            transform: [{ rotate: "180deg" }],
                        }}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.chartWrapper}>
                {/* <LineChart
                    data={rawSeries} // Use rawSeries directly after processing
                    width={width - (HORIZONTAL_PADDING * 2)} // Adjust width based on container padding
                    height={CHART_HEIGHT}
                    spacing={width / 9} // Spacing between data points
                    color={theme.primaryColor}
                    thickness={1}
                    hideDataPoints
                    hideRules={false}
                    rulesColor={theme.borderColor}
                    rulesThickness={0.2}
                    xAxisColor="transparent"
                    yAxisColor="transparent"
                    xAxisLabelTextStyle={styles.xAxisLabel}
                    minValue={axisInfo.min}
                    maxValue={axisInfo.max}
                    stepValue={(axisInfo.max - axisInfo.min) / 6} // Use calculated step for y-axis
                    yAxisLabelTexts={axisInfo.labels}
                    yAxisTextStyle={styles.yAxisLabel}
                    showVerticalLines
                    verticalLinesColor={theme.borderColor}
                    verticalLinesThickness={0.2}
                    areaChart
                    startFillColor={theme.primaryColor}
                    endFillColor={theme.backgroundColor}
                    startOpacity={0.3}
                    endOpacity={0}
                    pointerConfig={{
                        pointerStripUptoDataPoint: true,
                        pointerLabelComponent: items => {
                            // Defensive check for items array and its first element
                            if (!items || items.length === 0 || !items[0]) {
                                return null;
                            }
                            const item = items[0];
                            return (
                                <View style={styles.tooltip}>
                                    <Text style={styles.tooltipText}>
                                        {item.label} {item.dateLabel}
                                    </Text>
                                    <Text style={styles.tooltipText}>
                                        P/L: ${item.value.toLocaleString()}
                                    </Text>
                                </View>
                            );
                        },
                    }}
                    renderXAxisLabel={item => (
                        <View style={styles.customXAxisLabel}>
                            <Text style={styles.xAxisLabelDay}>{item.label}</Text>
                            <Text style={styles.xAxisLabelDate}>{item.dateLabel}</Text>
                        </View>
                    )}
                /> */}
            </View>
        </View>
    );
};

// Styles
const createStyles = theme => StyleSheet.create({
    container: {
        borderRadius: 8,
        marginBottom: 10,
        // No explicit background here, let parent container define it
    },
    center: {
        minHeight: CHART_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.cardBackground || 'rgba(255, 255, 255, 0.06)', // Fallback
        borderRadius: 8, // Apply border radius for consistency
    },
    sectionTitle: {
        color: theme.textColor,
        fontSize: 14,
        fontFamily: 'Outfit-Regular',
    },
    loadingText: {
        marginTop: 10,
        color: theme.textColor,
        fontSize: 16,
        fontFamily: 'Outfit-Regular',
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
    errorText: {
        color: theme.errorColor || 'white',
        fontSize: 12,
        textAlign: 'center',
        marginHorizontal: 20,
        fontFamily:"Outfit-Bold",
    },
    chartWrapper: {
        alignItems: 'center',
        padding: 10, // Padding inside the chart container
        backgroundColor: theme.cardBackground || 'rgba(255, 255, 255, 0.06)', // Background for the chart area
        borderRadius: 8, // Rounded corners for the chart area
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
        alignItems: 'center'
    },
    xAxisLabelDay: {
        color: theme.subTextColor,
        fontSize: 12,
        fontWeight: 'bold',
    },
    xAxisLabelDate: {
        color: theme.subTextColor,
        fontSize: 10
    },
    tooltip: {
        backgroundColor: theme.primaryColor,
        padding: 8,
        width: 140,
        borderRadius: 5,
        alignItems: 'center',
    },
    tooltipText: {
        color: '#FFFFFF',
        fontSize: 12
    },
});

export default TradingJourneyChart;
