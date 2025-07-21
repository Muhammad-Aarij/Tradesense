import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
  View, Text, ScrollView, SafeAreaView, StatusBar,
  TouchableOpacity, Image, StyleSheet, Alert, Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { PieChart } from 'react-native-gifted-charts';
import {
  back, checkboxChecked, checkboxUnchecked
} from '../../../../assets/images';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '../../../../redux/slice/loaderSlice';
import { useCreateHabitLog, useTodaysHabits, useHabitStats } from '../../../../functions/habbitFunctions';
import { ThemeContext } from '../../../../context/ThemeProvider';
import DailyBreakdownChart from '../../../../components/DailyBreakdownChart';
import { useQueryClient } from '@tanstack/react-query';
import Snackbar from 'react-native-snackbar';

const screenWidth = Dimensions.get('window').width;

export default function Accountability({ navigation }) {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const userId = useSelector(state => state.auth.userId);
  const { theme, isDarkMode } = useContext(ThemeContext);
  const styles = useMemo(() => getStyles(theme), [theme]);

  const [localHabitState, setLocalHabitState] = useState({});
  const { data: todaysHabits = [], isLoading } = useTodaysHabits(userId);
  const { data: habitStats = {}, isLoading: statsLoading } = useHabitStats(userId);
  const logHabit = useCreateHabitLog();

  const visibleHabits = todaysHabits.filter(h => !(localHabitState[h._id] || h.completedToday));
  const completedCount = todaysHabits.filter(h => h.completedToday || localHabitState[h._id]).length;
  const remainingCount = todaysHabits.length - completedCount;

  useEffect(() => {
    if (isLoading || statsLoading) dispatch(startLoading());
    else dispatch(stopLoading());
  }, [isLoading, statsLoading]);

  const growthPercentage = habitStats.total > 0
    ? Math.round((habitStats.completed / habitStats.total) * 100)
    : 0;

  const handleLog = async (habitId) => {
    if (localHabitState[habitId] || todaysHabits.find(h => h._id === habitId)?.completedToday) {
      Snackbar.show({ text: 'Already checked!', duration: Snackbar.LENGTH_SHORT, backgroundColor: '#FFA726' });
      return;
    }

    setLocalHabitState(prev => ({ ...prev, [habitId]: true }));

    const result = await logHabit({ userId, habitId });
    if (result?.error) {
      setLocalHabitState(prev => ({ ...prev, [habitId]: false }));
      Alert.alert('Error', result.error);
    } else {
      Snackbar.show({ text: 'Goal checked!', duration: Snackbar.LENGTH_SHORT, backgroundColor: '#66BB6A' });
      await queryClient.invalidateQueries(['todaysHabits', userId]);
      await queryClient.invalidateQueries(['habitStats', userId]);
    }
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
            // { label: "Completed Today", value: completedCount },
            // { label: "Remaining Today", value: remainingCount },
          ].map((item, idx) => (
            <LinearGradient key={idx}
              start={{ x: 0, y: 0.95 }} end={{ x: 1, y: 1 }}
              colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
              style={styles.gridItemLinearGradient}>
              <View style={styles.gridItem}>
                <Text style={styles.gridItemValue}>{item.value}</Text>
                <Text style={styles.gridItemLabel}>{item.label}</Text>
              </View>
            </LinearGradient>
          ))}
        </View>

        {/* My Growth */}
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0.1 }}
          colors={['rgba(126, 126, 126, 0.14)', 'rgba(255,255,255,0)']}
          style={styles.myGrowthCardLinearGradient}>
          <View style={styles.myGrowthCard}>
            <Text style={styles.sectionTitle}>My Growth</Text>
            <View style={styles.myGrowthContent}>
              <View style={styles.pieChartWrapper}>
                <PieChart
                  data={[
                    { value: (completedCount / (completedCount + remainingCount)) * 100, color: theme.primaryColor },
                    { value: 100 - (completedCount / (completedCount + remainingCount)) * 100, color: theme.borderColor }
                  ]}
                  radius={50}
                  donut
                  strokeCap={'round'}
                  innerRadius={35}
                  innerCircleColor="transparent"
                  centerLabelComponent={() => (
                    <View style={{
                      backgroundColor: isDarkMode ? "#080E17" : "white",
                      width: 70, height: 70, borderRadius: 100,
                      justifyContent: "center", alignItems: "center"
                    }}>
                      <Text style={{ color: theme.textColor, fontSize: 14, fontFamily: "Inter-Bold" }}>
                        {(completedCount / (completedCount + remainingCount)) * 100}%
                      </Text>
                    </View>
                  )}
                />
              </View>
              <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
                <View style={styles.gridItem2}>
                  <Text style={styles.gridItemLabel}>Completed Goals</Text>
                  <Text style={styles.gridItemValue}>{completedCount}</Text>
                </View>
                <View style={styles.gridItem2}>
                  <Text style={styles.gridItemLabel}>Pending Goals</Text>
                  <Text style={styles.gridItemValue}>{remainingCount}</Text>
                </View>
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
              width: 10, height: 10, resizeMode: 'contain',
              tintColor: theme.primaryColor, transform: [{ rotate: '180deg' }],
            }} />
          </TouchableOpacity>
        </View>

        <View style={styles.successTrackerList}>
          {todaysHabits.length === 0 ? (
            <EmptyCard emoji="🌱" title="Ready to Grow?" subtitle="Start your journey by creating your first habit. Every small step counts towards your success!" theme={theme}  onPress={() => navigation.navigate("Goals")} />
          ) : visibleHabits.length === 0 ? (
            <EmptyCard emoji="🎉" title="Congratulations!" subtitle="All your goals for today are completed. Great job staying accountable!" theme={theme} />
          ) : (
            visibleHabits.map(habit => {
              const isChecked = localHabitState[habit._id];
              return (
                <LinearGradient key={habit._id}
                  start={{ x: 0, y: 0.95 }} end={{ x: 1, y: 1 }}
                  colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                  style={styles.successTrackerItemLinearGradient}>
                  <View style={styles.successTrackerItem}>
                    <View style={styles.successTrackerTextContent}>
                      <View style={{ flexDirection: "row", alignItems: "flex-start", marginRight: 20 }}>
                        <TouchableOpacity onPress={() => handleLog(habit._id)} style={styles.checkbox}>
                          <Image
                            source={isChecked ? checkboxChecked : checkboxUnchecked}
                            style={{ width: 16, height: 16, resizeMode: 'contain' }}
                          />
                        </TouchableOpacity>
                        <View style={{ flexDirection: "column" }}>
                          <Text style={[
                            styles.successTrackerTitle,
                            isChecked && { textDecorationLine: 'line-through', color: 'gray' }
                          ]}>
                            {habit.title || "Untitled Habit"}
                          </Text>
                          <Text style={[
                            styles.successTrackerDescription,
                            isChecked && { textDecorationLine: 'line-through', color: 'gray' }
                          ]}>
                            {habit.description || "No description"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const EmptyCard = ({ emoji, title, subtitle, onPress, theme }) => (
  <LinearGradient
    start={{ x: 0, y: 0.95 }} end={{ x: 1, y: 1 }}
    colors={['rgba(126, 126, 126, 0.2)', 'rgba(255,255,255,0)']}
    style={{
      padding: 25,
      paddingVertical:40,
      borderRadius: 12,
      // marginVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <Text style={{ fontSize: 36 }}>{emoji}</Text>
    <Text style={{ fontSize: 16, fontFamily:"Inter-SemiBold", marginTop: 10, color: theme.textColor }}>{title}</Text>
    <Text style={{ fontSize: 12, fontFamily:"Inter-Regular", textAlign: 'center', marginTop: 5, color: theme.subTextColor }}>
      {subtitle}
    </Text>
    {onPress && (
      <TouchableOpacity onPress={onPress} style={{ marginTop: 12, backgroundColor: '#444', padding: 10, borderRadius: 8 }}>
        <Text style={{ color: 'white' }}>Create Your First Goal</Text>
      </TouchableOpacity>
    )}
  </LinearGradient>
);


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
    borderRadius: 8,
    padding: 15,
  },
  gridItemLinearGradient: {
    borderWidth: 0.9,
    borderColor: theme.borderColor,
    borderRadius: 8,
    width: '49%', // Roughly half width with spacing
    marginBottom: "2.5%",
  },
  gridItem2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 0.9,
    borderColor: theme.borderColor,
    borderRadius: 8,
    padding: 20,
    paddingVertical: 7,
    width: 'auto', // Roughly half width with spacing
    marginBottom: "5%",
  },
  gridItemValue: {
    color: theme.textColor,
    fontSize: 20,
    fontFamily: 'Inter-Medium',
  },
  gridItemLabel: {
    color: theme.subTextColor,
    fontSize: 12,
    marginRight: 13,
  },
  myGrowthCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 8,
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  myGrowthCardLinearGradient: {
    borderWidth: 0.9,
    borderColor: theme.borderColor,
    borderRadius: 8,
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
    marginTop: 2,
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
    // borderWidth: 0.9,
    borderColor: theme.borderColor,
    borderRadius: 8,
    padding: 15,
    paddingVertical: 20,
  },
  successTrackerItemLinearGradient: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 0.9,
    borderColor: theme.borderColor,
    borderRadius: 8,
    marginBottom: 10,
  },
  checkbox: {
    marginTop: 3,
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
  emptyHabitsCard: {
    borderRadius: 16,
    borderWidth: 0.9,
    borderColor: theme.borderColor,
    padding: 3,
    marginBottom: 15,
  },
  emptyHabitsContent: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  emptyHabitsIconContainer: {
    marginBottom: 16,
  },
  emptyHabitsIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyHabitsIconText: {
    fontSize: 28,
  },
  emptyHabitsTextContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyHabitsTitle: {
    color: theme.textColor,
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyHabitsSubtitle: {
    color: theme.subTextColor,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  createHabitButton: {
    backgroundColor: theme.primaryColor,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: theme.primaryColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  createHabitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
});
