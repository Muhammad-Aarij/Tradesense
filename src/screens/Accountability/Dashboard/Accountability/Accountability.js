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
  Dimensions, // Import Dimensions for responsive spacing
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BarChart } from 'react-native-gifted-charts'; // Import BarChart
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg'; // Import Svg components
import { back, work, checkboxChecked, checkboxUnchecked } from '../../../../assets/images';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '../../../../redux/slice/loaderSlice';
import { createHabitLog } from '../../../../functions/habbitFunctions';
import { ThemeContext } from '../../../../context/ThemeProvider';
import { useTodaysHabits, useHabitStats } from '../../../../functions/habbitFunctions';

// Get screen width for responsive design for the chart spacing
const screenWidth = Dimensions.get('window').width;

export default function Accountability({ navigation }) {
  const [selectedFilter, setSelectedFilter] = useState('Daily');
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [chartData, setChartData] = useState([]); // State for chart data
  const filterOptions = ['Daily', 'Monthly', 'Yearly'];
  const userId = useSelector(state => state.auth.userId);
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => getStyles(theme), [theme]);
  const {
    data: habitStats = {},
    isLoading: statsLoading,
  } = useHabitStats(userId);

  const {
    data: todaysHabits = [],
    isLoading,
    refetch,
  } = useTodaysHabits(userId);

  useEffect(() => {
    (isLoading || statsLoading) ? dispatch(startLoading()) : dispatch(stopLoading());
  }, [isLoading, statsLoading]);

  // Calculate percentage
  const growthPercentage = habitStats.total > 0
    ? Math.round((habitStats.completed / habitStats.total) * 100)
    : 0;

  // Function to generate dummy data based on view type for the bar chart
  const generateChartData = (type) => {
    const today = new Date();
    const data = [];

    if (type === 'Daily') { // Changed from 'daily' to 'Daily' to match filterOptions
      for (let i = 6; i >= 0; i--) { // Last 7 days
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        data.push({
          value: Math.floor(Math.random() * 100) + 20, // Random value between 20 and 120
          label: date.toLocaleDateString('en-US', { weekday: 'short',  }),
          frontColor: i % 2 === 0 ? theme.subTextColor : theme.primaryColor, // Alternating colors
          fullDate: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        });
      }
    } else if (type === 'Monthly') { // Changed from 'monthly' to 'Monthly'
      for (let i = 5; i >= 0; i--) { // Last 6 months
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        data.push({
          value: Math.floor(Math.random() * 500) + 100,
          label: date.toLocaleDateString('en-US', { month: 'short' }),
          frontColor: i % 2 === 0 ? '#F9FAFB' : '#3B82F6',
          fullDate: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
        });
      }
    } else if (type === 'Yearly') { // Changed from 'yearly' to 'Yearly'
      for (let i = 4; i >= 0; i--) { // Last 5 years
        const year = today.getFullYear() - i;
        data.push({
          value: Math.floor(Math.random() * 2000) + 500,
          label: String(year),
          frontColor: i % 2 === 0 ? '#F9FAFB' : '#3B82F6',
          fullDate: String(year),
        });
      }
    }
    return data;
  };

  // Update chart data whenever the selected filter changes
  useEffect(() => {
    setChartData(generateChartData(selectedFilter));
  }, [selectedFilter]);

  const handleHabitComplete = async (habitId) => {
    const result = await createHabitLog({
      userId,
      habitId,
      status: 'completed',
    });

    if (result.error) {
      Alert.alert('Error', result.error);
    } else {
      refetch(); // Refresh the habit list after logging
    }
  };

  // Determine the date text for the Daily Breakdown section
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.backgroundColor} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.sectionTitle}>Your Accountability Details</Text>

        {/* Stats Grid */}
        <View style={styles.gridContainer}>
          {[
            { label: 'Total Goals on time', value: habitStats.total ?? '--' },
            { label: 'Streak', value: habitStats.streak ?? '--' },
            { label: 'Pending Goals', value: habitStats.pending ?? '--' },
            { label: 'Completed Goals', value: habitStats.completed ?? '--' },
          ].map((item, idx) => (
            <LinearGradient key={idx}
              start={{ x: 0, y: 0.95 }}
              end={{ x: 1, y: 1 }}
              colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
              style={styles.gridItem}>
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
          <View style={styles.myGrowthContent}>
            {/* Progress Circle - Integrated with react-native-svg */}
            <View style={styles.progressCircleOuterContainer}>
              <Svg height="100%" width="100%" viewBox="0 0 100 100">
                {/* Background circle */}
                <Circle
                  cx="50"
                  cy="50"
                  r="50"
                  stroke={theme.borderColor} // Use theme border color for background
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Progress circle */}
                <Circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={theme.primaryColor} // Use theme primary color for progress
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={(2 * Math.PI * 40) - (2 * Math.PI * 40 * (growthPercentage / 100))}
                  strokeLinecap="round"
                  fill="transparent"
                  rotation="-90"
                  origin="50,50"
                />
                <SvgText
                  x="50"
                  y="50"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize="24"
                  fontWeight="bold"
                  fill={theme.textColor}
                >
                  {growthPercentage}%
                </SvgText>
              </Svg>
            </View>
            <View style={styles.progressTaskContainer}>
              <Image source={work} style={styles.progressTaskIcon} />
              <Text style={styles.progressTaskText}>
                Progress Task: {growthPercentage}%
              </Text>
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
              <Text style={styles.dailyBreakdownDate}>{getDailyBreakdownDateText()}</Text>
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

          {/* Bar Chart - Integrated with react-native-gifted-charts */}
          <View style={styles.barChartWrapper}>
            <BarChart
              data={chartData}
              barWidth={40}
              barBorderRadius={8}
              spacing={10}
              height={200}
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

        {/* Success Tracker */}
        <View style={styles.successTrackerHeader}>
          <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Success Tracker</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Goals")} style={styles.manageRow}>
            <Text style={styles.manageText}>Manage</Text>
            <Image source={back} style={{
              width: 10,
              height: 10,
              resizeMode: 'contain',
              tintColor: theme.primaryColor,
              transform: [{ rotate: '180deg' }],
            }} />
          </TouchableOpacity>
        </View>

        <View style={styles.successTrackerList}>
          {todaysHabits.length === 0 ? (
            <Text style={{ color: '#AAA', fontSize: 12 }}>No habits for today</Text>
          ) : (
            todaysHabits.map((habit) => (
              <LinearGradient key={habit._id}
                start={{ x: 0, y: 0.95 }} end={{ x: 1, y: 1 }}
                colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                style={styles.successTrackerItem}
              >
                <View style={styles.successTrackerTextContent}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
                    <TouchableOpacity
                      onPress={() => {
                        if (!habit.completedToday) handleHabitComplete(habit._id);
                      }}
                      style={styles.checkbox}
                    >
                      <Image
                        source={habit.completedToday ? checkboxChecked : checkboxUnchecked}
                        style={{ width: 16, height: 16, resizeMode: 'contain' }}
                      />
                    </TouchableOpacity>
                    <Text style={styles.successTrackerTitle}>
                      {habit.title || "Untitled Habit"}
                    </Text>
                  </View>
                  <Text style={styles.successTrackerDescription}>
                    {habit.description || "No description"}
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
    backgroundColor: theme.backgroundColor, // Use theme background color
  },
  scrollViewContent: {
    // paddingHorizontal: 20, // Added horizontal padding
    paddingBottom: 100, // To make space for bottom nav
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
    marginBottom: 10,
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
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  myGrowthContent: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
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

  progressCircleOuterContainer: { // Renamed for clarity, contains the Svg
    width: 80,
    height: 80,
    // No border here, border is handled by SVG circles
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 0.9, borderColor: theme.borderColor,
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
    fontFamily: "Inter-SemiBold",
  },
  dailyBreakdownDate: {
    color: theme.subTextColor,
    fontSize: 12,
    fontFamily: "Inter-Light-BETA",
  },
  dailyBreakdownFilter: {
    borderRadius: 8,
    paddingHorizontal: 8,
    color: '#FFF',
    fontSize: 12,
    fontFamily: "Inter-Medium",
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
    transform: [{ rotate: '90deg' }],
  },
  barChartWrapper: { // Wrapper for the BarChart
    width: '100%',
    // height: 50,
    // No horizontal padding here, BarChart handles its own spacing
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
    alignItems: 'flex-start',
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
    flex: 1,
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
    lineHeight: 15,
  },
  tooltip: { // Styles for the custom tooltip
    backgroundColor: theme.primaryColor, // Gray-700
    borderRadius: 8,
    padding: 10,
    // borderColor: '#4B5563', // Gray-600
    // borderWidth: 1,
    zIndex: 10000,
  },
  tooltipText: {
    color: '#F9FAFB', // White
    fontSize: 11,
  },
});
