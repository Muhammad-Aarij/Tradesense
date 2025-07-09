import React, { useState, useContext } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Dimensions, Image
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ThemeContext } from '../context/ThemeProvider';
import { back } from '../assets/images';

const { width } = Dimensions.get('window');

const DailyBreakdownChart = () => {
    const { theme } = useContext(ThemeContext);
    const [selectedFilter, setSelectedFilter] = useState('Daily');
    const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
    const filterOptions = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

    const chartData = {
        labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'],
        datasets: [
            {
                data: [250, 450, 400, 100, 200, 150],
                color: (opacity = 1) => theme.primaryColorWithOpacity(opacity),
                strokeWidth: 2,
            },
        ],
    };

    const chartConfig = {
        backgroundGradientFrom: theme.chartBg,
        backgroundGradientTo: theme.chartBg,
        decimalPlaces: 0,
        color: (opacity = 1) => theme.textColorWithOpacity(opacity * 0.7),
        labelColor: (opacity = 1) => theme.subTextColorWithOpacity(opacity * 0.7),
        strokeWidth: 2,
        propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: theme.primaryColor,
        },
        fillShadowGradient: 'transparent',
        fillShadowGradientOpacity: 0,
    };

    const styles = getStyles(theme);

    return (
        <View style={styles.dailyBreakdownContainer}>
            <View style={styles.dailyBreakdownHeader}>
                <View>
                    <Text style={styles.dailyBreakdownTitle}>Top Breakdown</Text>
                    <Text style={styles.dailyBreakdownDate}>January 05, 2025</Text>
                </View>
                <View style={{ position: 'relative' }}>
                    <TouchableOpacity
                        style={styles.dropdownContainer}
                        onPress={() => setFilterDropdownVisible(!filterDropdownVisible)}
                    >
                        <Image
                            source={back}
                            style={{
                                ...styles.dropdownArrow,
                                transform: [{ rotate: filterDropdownVisible ? '90deg' : '-90deg' }],
                            }}
                        />
                    </TouchableOpacity>

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

            <View style={styles.chartWrapper}>
                <LineChart
                    data={chartData}
                    width={width - 40}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                    withVerticalLabels
                    withHorizontalLabels
                    withInnerLines={false}
                    withOuterLines={false}
                />
            </View>
        </View>
    );
};

const getStyles = (theme) =>
    StyleSheet.create({
        dailyBreakdownContainer: {
            backgroundColor: theme.cardBg,
            borderRadius: 12,
            marginHorizontal: 20,
            marginTop: 20,
            padding: 15,
        },
        dailyBreakdownHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 10,
        },
        dailyBreakdownTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.textColor,
        },
        dailyBreakdownDate: {
            fontSize: 12,
            color: theme.subTextColor,
            marginTop: 2,
        },
        dropdownContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.inputBg,
            borderRadius: 8,
            paddingVertical: 5,
            paddingHorizontal: 10,
        },
        dropdownArrow: {
            width: 12,
            height: 12,
            resizeMode: 'contain',
            tintColor: theme.subTextColor,
        },
        dropdownOptions: {
            position: 'absolute',
            top: 40,
            right: 0,
            backgroundColor: theme.inputBg,
            borderRadius: 8,
            zIndex: 1000,
            width: 100,
        },
        optionItem: {
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
        },
        optionText: {
            fontSize: 14,
            color: theme.textColor,
        },
        chartWrapper: {
            backgroundColor: theme.chartBg,
            borderRadius: 10,
            overflow: 'hidden',
            paddingVertical: 10,
            alignItems: 'center',
        },
        chart: {
            marginVertical: 8,
            borderRadius: 10,
        },
    });

export default DailyBreakdownChart;
