import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { back } from '../assets/images';
import theme from '../themes/theme';

const { width } = Dimensions.get('window');

const TopBreakdownChart = () => {
    const [selectedFilter, setSelectedFilter] = useState('Daily');
    const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
    const filterOptions = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

    // Chart data with background bars and line data
    const chartData = [
        { value: 250, label: 'JAN', dataPointText: '250' },
        { value: 450, label: 'FEB', dataPointText: '450' },
        {
            value: 400,
            label: 'MAR',
            dataPointText: '400',
            // Highlight this point with blue dot
            customDataPoint: () => (
                <View style={styles.customDataPoint}>
                    <View style={styles.innerDot} />
                </View>
            ),
        },
        { value: 100, label: 'APR', dataPointText: '100' },
        { value: 200, label: 'MAY', dataPointText: '200' },
        { value: 150, label: 'JUN', dataPointText: '150' },
    ];

    return (
        <View style={styles.container}>

            {/* Chart */}
            <View style={styles.chartContainer}>
                <LineChart
                    data={chartData}
                    width={width }
                    // height={200}
                    // spacing={50}
                    // initialSpacing={25}
                    // endSpacing={25}

                    // Background styling
                    // backgroundColor="#2A2A2A"

                    // Line styling
                    color={theme.primaryColor}
                    // thickness={3}
                    curved

                    // Remove default elements
                    // hideDataPoints={false}
                    dataPointsColor="#fff"
                    dataPointsRadius={4}

                    // Y-axis configuration
                    yAxisColor="transparent"
                    yAxisThickness={0}
                    yAxisTextStyle={styles.yAxisText}
                    yAxisLabelPrefix=""
                    yAxisLabelSuffix=""
                    maxValue={600}
                    noOfSections={5}
                    // yAxisOffset={0}

                    // X-axis configuration
                    xAxisColor="transparent"
                    xAxisThickness={0}
                    xAxisLabelTextStyle={styles.xAxisText}

                    // Grid lines
                    // showVerticalLines={true}
                    // verticalLinesColor="#404040"
                    // verticalLinesThickness={1}
                    verticalLinesOpacity={0.3}

                    rulesColor="transparent"
                    rulesThickness={0}

                    // Remove focus and animations for clean look
                    // disableScroll={true}

                    // Custom styling
                    areaChart={false}
                    // hideOrigin={true}
                />

                {/* Background bars overlay */}
                <View style={styles.backgroundBars}>
                    {chartData.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.backgroundBar,
                                {
                                    left: 25 + (index * 50),
                                    // Highlight the March bar (index 2)
                                    backgroundColor: index === 2 ? '#404040' : '#353535'
                                }
                            ]}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // backgroundColor: '#1E1E1E',
        // borderRadius: 12,
        // marginHorizontal: 20,
        // marginTop: 20,
        // paddingBottom: 15,

    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E0E0E0',
        fontFamily: 'Inter-SemiBold',
    },
    date: {
        fontSize: 12,
        color: '#A0A0A0',
        marginTop: 2,
        fontFamily: 'Inter-Light-BETA',
    },
    dropdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3A3A3A',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    filterText: {
        fontSize: 14,
        color: '#E0E0E0',
        marginRight: 8,
        fontFamily: 'Inter-Medium',
    },
    dropdownArrow: {
        width: 12,
        height: 12,
        resizeMode: 'contain',
        tintColor: '#E0E0E0',
    },
    dropdownOptions: {
        position: 'absolute',
        top: 40,
        right: 0,
        backgroundColor: '#3A3A3A',
        borderRadius: 8,
        zIndex: 1000,
        width: 100,
    },
    optionItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#4A4A4A',
    },
    optionText: {
        fontSize: 14,
        color: '#E0E0E0',
        fontFamily: 'Inter-Regular',
    },
    chartContainer: {
        // backgroundColor: '#2A2A2A',
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundBars: {
        // color:"#fff",
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        marginBottom:20,
        marginLeft:10,
    },
    backgroundBar: {
        position: 'absolute',
        width: 40,
        height: '100%',
        borderRadius: 4,
    },
    customDataPoint: {
        width: 12,
        height: 12,
        backgroundColor: '#007AFF',
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerDot: {
        width: 4,
        height: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
    },
    yAxisText: {
        marginRight:15,
        color: '#7C828A',
        fontSize: 12,
        fontFamily: 'Inter-Light-BETA',
    },
    xAxisText: {
        marginRight:20,
        marginBottom:5,
        // paddingBottom:15,
        color: '#7C828A',
        // color: '#A0A0A0',
        fontSize: 12,
        fontFamily: 'Inter-Light-BETA',
    },
});

export default TopBreakdownChart; 