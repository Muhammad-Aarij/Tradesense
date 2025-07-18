import React, { useState, useEffect, useContext, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { ThemeContext } from '../context/ThemeProvider'; // Assuming you have a ThemeContext

const { width } = Dimensions.get('window');

const TradingJourneyChart = () => {
    const { theme } = useContext(ThemeContext);
    const styles = useMemo(() => getStyles(theme), [theme]);

    // Dummy data for the line chart
    const [lineData, setLineData] = useState([]);

    useEffect(() => {
        // Generate dummy data for the last 8 days
        const generateData = () => {
            const data = [];
            const today = new Date();
            // Start with a value that allows for fluctuations around the lower end of the chart
            let currentProfitLoss = 1000;

            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);

                // Simulate profit/loss fluctuations that can go up to 15000
                const change = (Math.random() - 0.5) * 2500; // Random change between -2000 and 2000
                currentProfitLoss = Math.max(0, Math.min(15000, currentProfitLoss + change)); // Keep within 0-15000 range

                data.push({
                    value: currentProfitLoss,
                    label: date.toLocaleDateString('en-US', { weekday: 'short' }), // Day of the week (Mon, Tue, etc.)
                    dataPointText: `${Math.round(currentProfitLoss)}`, // Data point text will be rounded number
                    dateLabel: date.getDate(), // Date number (15, 16, etc.)
                });
            }
            setLineData(data);
        };

        generateData();
    }, []);

    // Dynamically generate Y-axis labels based on lineData
    const yAxisLabels = useMemo(() => {
        const numLabels = 7; // Exactly 7 Y-axis labels

        if (lineData.length === 0) {
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
        if (yAxisMinValue < 0 && rawMinValue >= 0) yAxisMinValue = 0;

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



    return (
        <View style={styles.container}>
            {/* Header for the chart, if needed (commented out in previous version) */}
            {/* <View style={styles.header}>
                <Text style={styles.title}>Your Trading Journey</Text>
                <Image source={back} style={styles.arrowIcon} />
            </View> */}

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
                    // Pass min and max values to the chart for correct scaling
                    // minValue={yAxisLabels.min}
                    // maxValue={yAxisLabels.max}
                />
            </View>
        </View>
    );
};

const getStyles = (theme) => StyleSheet.create({
    container: {
        // backgroundColor: 'rgba(255, 255, 255, 0.06)', // Using a semi-transparent background for the card
        // borderWidth: 0.9,
        // borderColor: theme.borderColor,
        borderRadius: 8,
        marginBottom: 10,
        // No padding here, padding is applied to chartWrapper to control chart width
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 20, // Add padding to header
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
        alignItems: 'center', // Center the chart
        // paddingHorizontal: 20, // Padding to create space from container edges
        padding: 10, // Space below chart for X-axis labels
        // paddingTop: 20, // Space above chart for Y-axis labels
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
        marginBottom: 12, // Space between labels and chart bottom
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
