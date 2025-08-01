import React, { useState, useContext, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView,
    Touchable
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
    navigation, // Add navigation prop
}) => {
    const { theme } = useContext(ThemeContext);
    const scrollRef = useRef(null);

    const userId = useSelector(state => state.auth.userObject?._id);
    const [selectedFilter, setSelectedFilter] = useState(defaultFilter);
    const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);

    const { data: habitLogs = [] } = useHabitLogs(userId);
    const { data: affiliateLogs = [] } = useAffiliateRecords(userId);

    const logs = type === 'affiliate' ? affiliateLogs : habitLogs;

    const [dynamicChartData, setDynamicChartData] = useState([]);
    const filterOptions = ['Daily', 'Monthly', 'Yearly'];
    const styles = getStyles(theme);

    // Re-compute chart data when the selected filter changes OR when the
    // number of logs changes (new/removed entries). Using logs.length avoids
    // dependency on a potentially new array reference returned on every
    // render, preventing an infinite render loop.
    useEffect(() => {
        const chartData = transformLogsToChartData(logs, selectedFilter);
        setDynamicChartData(chartData);
    }, [selectedFilter, logs.length]);

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

                // Compare ISO YYYY-MM-DD to avoid time-zone shifts
                const targetISO = date.toISOString().split('T')[0];
                const count = logs.filter((log) => {
                    const logISO = extractDate(log).toISOString().split('T')[0];
                    return logISO === targetISO;
                }).length;

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

    const hasData = () => {
        if (!logs || logs.length === 0) return false;

        // Check if there's any data in the current time period
        const totalValue = dynamicChartData.reduce((sum, item) => sum + item.value, 0);
        return totalValue > 0;
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
            start={{ x: 0, y: 1 }} end={{ x: 0.6, y: 1 }}
            colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
            style={styles.LinearGradient}
        >
            <View style={styles.dailyBreakdownContainer}>
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
                    <View style={styles.barChartWrapper}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingRight: 20 }} // optional
                            ref={(ref) => (scrollRef.current = ref)}
                            onContentSizeChange={() => {
                                if (scrollRef.current) {
                                    scrollRef.current.scrollToEnd({ animated: true });
                                }
                            }}
                        >
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
                                    fontFamily: 'Outfit-Regular',
                                }}
                                renderTooltip={(item) => (
                                    <View style={styles.tooltip}>
                                        <Text style={styles.tooltipText}>Value: {item.value}</Text>
                                        <Text style={styles.tooltipText}>Date: {item.fullDate}</Text>
                                    </View>
                                )}
                            />
                        </ScrollView>
                    </View>

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
                                onPress={() => {
                                    if (type === 'affiliate') {
                                        navigation?.navigate('Goals');
                                    } else {
                                        navigation?.navigate('Goals');
                                    }
                                }}
                                activeOpacity={0.7}
                            >
                                <View
                                    style={styles.noDataIconContainer}
                                >
                                    <Text style={styles.noDataIcon}>
                                        {type === 'affiliate' ? '✨' : '🎯'}
                                    </Text>
                                    <View style={styles.iconGlow} />
                                </View>

                                <Text style={styles.noDataTitle}>
                                    {selectedFilter === 'Daily' ?
                                        (type === 'affiliate' ? 'Ready to Earn?' : 'Your Journey Awaits') :
                                        selectedFilter === 'Monthly' ? 'A Fresh Start Awaits' :
                                            'Endless Possibilities Ahead'}
                                </Text>

                                <Text style={styles.noDataSubtitle}>
                                    {type === 'affiliate'
                                        ? 'Transform your passion into profit, one course at a time'
                                        : 'Great things never come from comfort zones. Start today.'
                                    }
                                </Text>

                                {/* <View style={styles.inspirationalContainer}>
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        colors={[theme.primaryColor + '80', theme.primaryColor + '40']}
                                        style={styles.motivationalBadge}>
                                        <View style={styles.motivationalBadgeInner}>
                                        <Text style={styles.motivationalText}>
                                            {type === 'affiliate' ? '💰' : '🚀'} {type === 'affiliate' ? 'First Sale Awaits' : 'Progress Starts Here'}
                                        </Text>
                                        </View>
                                    </LinearGradient>
                                </View>
                                 */}
                                <View style={styles.noDataActionContainer}>
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        colors={[theme.primaryColor, theme.primaryColor + '80']}
                                        style={styles.noDataDot}
                                    />
                                    <Text style={styles.noDataMessage}>
                                        {type === 'affiliate'
                                            ? 'Begin your affiliate journey and watch the magic unfold'
                                            : 'Plant the seeds of success with your first habit today'
                                        }
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.submitButton}
                                    onPress={() => {
                                        type === "affiliate"
                                            ? navigation.navigate("CoursesStack")
                                            : navigation.navigate("AddGoal");
                                    }}
                                >
                                    <  Text style={styles.submitButtonText}>
                                        Start Now
                                    </Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                )}
            </View>
        </LinearGradient >
    );
};

const getStyles = (theme) =>
    StyleSheet.create({
        dailyBreakdownContainer: {
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderRadius: 8,
            padding: 20,
        },
        LinearGradient: {
            borderWidth: 0.9,
            borderColor: theme.borderColor,
            borderRadius: 8,
            // padding: 20,
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
            fontFamily: 'Outfit-Black',
            marginBottom: 4,
        },
        dailyBreakdownDate: {
            color: theme.subTextColor,
            fontSize: 12,
            fontFamily: 'Outfit-Light',
        },
        dropdownContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.primaryColor,
            // borderWidth: 0.9,
            // borderColor: theme.borderColor,
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
            paddingTop: 40,
            paddingBottom: 20,
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
        inspirationalContainer: {

            // marginBottom: 20,
        },
        motivationalBadge: {
            borderRadius: 20,
        },
        motivationalBadgeInner: {
            paddingVertical: 10,
            paddingHorizontal: 18,
            borderRadius: 20,
            shadowColor: theme.primaryColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 6,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        motivationalText: {
            color: '#FFFFFF',
            fontSize: 12,
            fontFamily: 'Outfit-SemiBold',
            textAlign: 'center',
            letterSpacing: 0.2,
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
        submitButton: {
            backgroundColor: theme.primaryColor,
            width: "50%",
            padding: 12,
            borderRadius: 14,
            marginTop: 20,
            alignItems: "center",
        },
        submitButtonText: {
            color: "#fff",
            fontSize: 13,
            fontFamily: "Outfit-SemiBold",
        },
    });

export default DailyBreakdownChart;