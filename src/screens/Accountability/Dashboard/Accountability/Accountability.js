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
import { PieChart } from 'react-native-gifted-charts';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg'; // Import Svg components
import { back, work, checkboxChecked, checkboxUnchecked } from '../../../../assets/images';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '../../../../redux/slice/loaderSlice';
import { createHabitLog } from '../../../../functions/habbitFunctions';
import { ThemeContext } from '../../../../context/ThemeProvider';
import { useTodaysHabits, useHabitStats } from '../../../../functions/habbitFunctions';
import DailyBreakdownChart from '../../../../components/DailyBreakdownChart';

// Get screen width for responsive design for the chart spacing
const screenWidth = Dimensions.get('window').width;

export default function Accountability({ navigation }) {
  const [selectedFilter, setSelectedFilter] = useState('Daily');
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [chartData, setChartData] = useState([]); // State for chart data
  const filterOptions = ['Daily', 'Monthly', 'Yearly'];
  const userId = useSelector(state => state.auth.userId);
  const dispatch = useDispatch();
  const { theme, isDarkMode } = useContext(ThemeContext);
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
    ? Math.round((2 / habitStats.total) * 100)
    : 0;


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
            // { label: 'Pending Goals', value: habitStats.pending ?? '--' },
            // { label: 'Completed Goals', value: habitStats.completed ?? '--' },
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
            <View style={styles.pieChartWrapper}>
              <PieChart
                data={[
                  {
                    value: growthPercentage,
                    color: theme.primaryColor,
                  },
                  {
                    value: 100 - growthPercentage,
                    color: theme.borderColor,
                  },
                ]}
                radius={50}
                donut
                strokeCap={'round'}
                innerRadius={35}
                innerCircleColor="transparent"
                centerLabelComponent={() => (
                  <View style={{
                    backgroundColor: !isDarkMode ? "white" : "#080E17",
                    width: 70,
                    height: 70,
                    flexDirection: "row",
                    borderRadius: 100,
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                    <Text style={{
                      color: theme.textColor, fontSize: 14, fontFamily: "Inter-Bold"
                    }}>
                      {growthPercentage}%
                    </Text>
                  </View>
                )}
              />

            </View>
            <View style={{flexDirection:"column",justifyContent:"space-between",height:"auto"}}>
              <View
                style={styles.gridItem2}>
                <Text style={styles.gridItemLabel}>Completed Goals</Text>
                <Text style={styles.gridItemValue}>{habitStats.completed}</Text>
              </View>
              <View
                style={styles.gridItem2}>
                <Text style={styles.gridItemLabel}>Pending Goals</Text>
                <Text style={styles.gridItemValue}>{habitStats.pending}</Text>
              </View>

              <View style={styles.progressTaskContainer}>
                <Image source={work} style={styles.progressTaskIcon} />
                <Text style={styles.progressTaskText}>
                  Progress Task: {growthPercentage}%
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <DailyBreakdownChart />

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
    </SafeAreaView >
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
  gridItem2: {
    flexDirection: "row",
    justifyContent:"space-between",
    alignItems:"center",
    // backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 0.9,
    borderColor: theme.borderColor,
    borderRadius: 8,
    padding: 15,
    paddingVertical:4,
    width: 'auto', // Roughly half width with spacing
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
  pieChartWrapper: {
    width: 100,
    height: 100,
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
    marginTop:2,
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
