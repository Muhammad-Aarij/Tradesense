import React, { useState, useContext, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Dimensions, Image
} from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { ThemeContext } from '../context/ThemeProvider';
import { useHabitLogs } from '../functions/habbitFunctions';
import { useAffiliateRecords } from '../functions/affiliateApi';
import { back } from '../assets/images';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

const DailyBreakdownChart = ({
    title = "Daily Breakdown",
    defaultFilter = 'Daily',
    type = 'habit',
}) => {
    const { theme } = useContext(ThemeContext);

    const userId = useSelector(state => state.auth.userObject?._id);
    const [selectedFilter, setSelectedFilter] = useState(defaultFilter);
    const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);

    const { data: habitLogs = [] } = useHabitLogs(userId);
    const { data: affiliateLogs = [] } = useAffiliateRecords(userId);

    const logs = type === 'affiliate' ? affiliateLogs : habitLogs;

    const [dynamicChartData, setDynamicChartData] = useState([]);
    const filterOptions = ['Daily', 'Monthly', 'Yearly'];
    const styles = getStyles(theme);

    useEffect(() => {
        if (logs.length > 0) {
            const chartData = transformLogsToChartData(logs, selectedFilter);
            setDynamicChartData(chartData);
        }
    }, [logs, selectedFilter]);

    const transformLogsToChartData = (logs, filter) => {
        const now = new Date();
        const result = [];

        const extractDate = (log) =>
            new Date(type === 'affiliate' ? log.createdAt : log.date);

        if (filter === 'Daily') {
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(now.getDate() - i);
                const label = date.toLocaleDateString('en-US', { weekday: 'short' });
                const fullDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });

                const count = logs.filter(
                    (log) => extractDate(log).toDateString() === date.toDateString()
                ).length;

                result.push({
                    value: count,
                    label,
                    fullDate,
                    frontColor: i % 2 === 0 ? theme.subTextColor : theme.primaryColor,
                });
            }
        } else if (filter === 'Monthly') {
            for (let i = 5; i >= 0; i--) {
                const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const label = month.toLocaleDateString('en-US', { month: 'short' });
                const fullDate = month.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                });

                const count = logs.filter((log) => {
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
                    frontColor: i % 2 === 0 ? theme.subTextColor : theme.primaryColor,
                });
            }
        } else if (filter === 'Yearly') {
            for (let i = 4; i >= 0; i--) {
                const year = now.getFullYear() - i;

                const count = logs.filter(
                    (log) => extractDate(log).getFullYear() === year
                ).length;

                result.push({
                    value: count,
                    label: String(year),
                    fullDate: String(year),
                    frontColor: i % 2 === 0 ? theme.subTextColor : theme.primaryColor,
                });
            }
        }

        return result;
    };

    const getDailyBreakdownDateText = () => {
        if (selectedFilter === 'Daily') {
            return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } else if (selectedFilter === 'Monthly') {
            return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        } else if (selectedFilter === 'Yearly') {
            return new Date().toLocaleDateString('en-US', { year: 'numeric' });
        }
        return '';
    };

    return (
        <LinearGradient
            start={{ x: 0, y: 0.95 }} end={{ x: 1, y: 1 }}
            colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
            style={styles.dailyBreakdownContainer}
        >
            <View style={styles.dailyBreakdownHeader}>
                <View>
                    <Text style={styles.dailyBreakdownTitle}>{title}</Text>
                    <Text style={styles.dailyBreakdownDate}>{getDailyBreakdownDateText()}</Text>
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

            <View style={styles.barChartWrapper}>
                <BarChart
                    data={dynamicChartData}
                    barWidth={40}
                    barBorderRadius={8}
                    spacing={12}
                    height={220}
                    initialSpacing={10}
                    noOfSections={4}
                    yAxisThickness={0}
                    xAxisThickness={0}
                    hideYAxisText
                    hideAxesAndRules
                    showXAxisIndices={false}
                    xAxisLabelTextStyle={{
                        color: theme.subTextColor,
                        fontSize: 12,
                        fontFamily: 'Inter-Regular',
                    }}
                    renderTooltip={(item) => (
                        <View style={styles.tooltip}>
                            <Text style={styles.tooltipText}>Value: {item.value}</Text>
                            <Text style={styles.tooltipText}>Date: {item.fullDate}</Text>
                        </View>
                    )}
                />
            </View>
        </LinearGradient>
    );
};

const getStyles = (theme) =>
    StyleSheet.create({
        dailyBreakdownContainer: {
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderWidth: 0.9,
            borderColor: theme.borderColor,
            borderRadius: 8,
            padding: 20,
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
            fontFamily: 'Inter-SemiBold',
        },
        dailyBreakdownDate: {
            color: theme.subTextColor,
            fontSize: 12,
            fontFamily: 'Inter-Light-BETA',
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
            fontFamily: 'Inter-Regular',
        },
        dailyBreakdownFilter: {
            color: '#FFF',
            fontSize: 12,
            fontFamily: 'Inter-Medium',
            paddingHorizontal: 8,
        },
        barChartWrapper: {
            width: '100%',
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
    });

export default DailyBreakdownChart;