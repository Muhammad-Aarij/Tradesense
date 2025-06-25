import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Platform } from 'react-native';
import { LineChart } from 'react-native-chart-kit'; // Import LineChart from react-native-chart-kit
import { back } from '../assets/images';

const { width } = Dimensions.get('window');

const DailyBreakdownChart = () => {
    const [selectedFilter, setSelectedFilter] = useState('Daily');
    const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
    const filterOptions = ['Daily', 'Weekly', 'Monthly', 'Yearly']; // Added more options for completeness


    const chartData = {
        labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'],
        datasets: [
            {
                data: [250, 450, 400, 100, 200, 150], // Example data points
                color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Blue line color
                strokeWidth: 2, // Line thickness
            },
        ],
    };

    const chartConfig = {
        backgroundGradientFrom: '#2A2A2A', // Dark background of the chart area
        backgroundGradientTo: '#2A2A2A',
        decimalPlaces: 0, // No decimal places on Y-axis labels
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity ? opacity * 0.7 : 0.7})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity ? opacity * 0.7 : 0.7})`,
        strokeWidth: 2, // Default stroke width for the line itself
        propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#007AFF', // Blue stroke for active dot
        },
        fillShadowGradient: 'transparent', // No fill shadow for the area under the line
        fillShadowGradientOpacity: 0,
        // No fill shadow opacity
        // Customization to show the bars as background
        // This requires a custom `renderDot` or `renderDecorator` if we want to mimic the background bars precisely
        // ChartKit doesn't have native "background bars" like in the image for LineChart directly,
        // so we'll approximate with `backgroundColor` and `paddingRight` adjustments for visual alignment.
        // For exact bar-like representation, a BarChart might be overlaid or a custom SVG renderer is needed.
    };

    return (
        <View style={styles.dailyBreakdownContainer}>
            <View style={styles.dailyBreakdownHeader}>
                <View>
                    <Text style={styles.dailyBreakdownTitle}>Top Breakdown</Text> {/* Changed from Daily to Top as per image */}
                    <Text style={styles.dailyBreakdownDate}>January 05, 2025</Text> {/* Date from image */}
                </View>
                <View style={{ position: "relative" }}>
                    <TouchableOpacity
                        style={styles.dropdownContainer}
                        onPress={() => setFilterDropdownVisible(!filterDropdownVisible)}
                    >
                        {/* <Text style={styles.dailyBreakdownFilter}>{selectedFilter}</Text> */}
                        <Image
                            source={back} // Use your actual arrow icon here
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

            {/* Chart */}
            <View style={styles.chartWrapper}>
                <LineChart
                    data={chartData}
                    width={width - 40} // Screen width minus horizontal padding
                    height={220} // Fixed height for the chart
                    chartConfig={chartConfig}
                    bezier // Smooth curve
                    style={styles.chart}
                    withVerticalLabels={true}
                    withHorizontalLabels={true}
                    withInnerLines={false} // Hide inner vertical lines
                    withOuterLines={false} // Hide outer vertical lines
                    verticalLabelRotation={0} // No rotation
                    horizontalLabelRotation={0} // No rotation
                    yAxisLabel={''} // Remove default Y-axis label text if not needed
                    yAxisSuffix={''} // Remove default Y-axis suffix
                    yLabelsOffset={0}
                    xLabelsOffset={0}
                // The background bars are a visual trick that LineChart doesn't directly support.
                // We'll mimic the effect with the overall background and styling of the chart container.
                // For a true "bar background", you might need to use a custom SVG renderer
                // or combine LineChart with a custom BarChart/Rects for background.
                />
                {/* Manually placed dots/bars for visual match if needed, but ChartKit handles the line */}
                {/* The highlighted bar effect (e.g., March) is also custom and would need another layer of rendering */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    dailyBreakdownContainer: {
        backgroundColor: '#1E1E1E', // Main card background [cite: image_68e585.jpg]
        borderRadius: 12,
        marginHorizontal: 20,
        marginTop: 20,
        padding: 15,
    },
    dailyBreakdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start', // Align to top for title/date alignment
        marginBottom: 10,
    },
    dailyBreakdownTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E0E0E0', // Light grey text [cite: image_68e585.jpg]
    },
    dailyBreakdownDate: {
        fontSize: 12,
        color: '#A0A0A0', // Grey date text [cite: image_68e585.jpg]
        marginTop: 2,
    },
    dropdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3A3A3A', // Darker background for dropdown button [cite: image_68e585.jpg]
        borderRadius: 8,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    dailyBreakdownFilter: {
        fontSize: 14,
        color: '#E0E0E0',
        marginRight: 5,
    },
    dropdownArrow: {
        width: 12,
        height: 12,
        resizeMode: 'contain',
        tintColor: '#E0E0E0', // Tint arrow to white/grey
    },
    dropdownOptions: {
        position: 'absolute',
        top: 40, // Position below the dropdown button
        right: 0,
        backgroundColor: '#3A3A3A', // Same background as dropdown button
        borderRadius: 8,
        // borderWidth: 1, // Optional border
        // borderColor: '#555',
        zIndex: 1000, // Ensure it appears above other content
        width: 100, // Fixed width for dropdown options
    },
    optionItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#4A4A4A', // Separator between options
    },
    optionText: {
        fontSize: 14,
        color: '#E0E0E0',
    },
    chartWrapper: {
        backgroundColor: '#2A2A2A', // Chart background, same as chartConfig.backgroundGradientFrom
        borderRadius: 10,
        overflow: 'hidden', // Ensures chart contents are clipped
        paddingVertical: 10, // Padding around the chart itself
        alignItems: 'center', // Center the chart
    },
    chart: {
        // Specific styles for the chart component itself
        marginVertical: 8,
        borderRadius: 10,
        // The background bars in the image are part of the overall visual design.
        // LineChart primarily focuses on the line. To get the vertical bars,
        // you would typically draw Rects using react-native-svg
        // or use a different chart type / combine charts.
        // For this example, we'll rely on the overall `chartWrapper` background.
    },
});

export default DailyBreakdownChart;
