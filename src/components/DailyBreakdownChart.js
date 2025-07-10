import React, { useState, useContext, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions, Image,
} from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { ThemeContext } from '../context/ThemeProvider';
import { back } from '../assets/images';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { useHabitsChartData } from '../functions/habbitFunctions';

const { width } = Dimensions.get('window');

const DailyBreakdownChart = ({ title = "Top Breakdown", type = "goal" }) => {
  const { primaryColor, secondaryColor, subTextColor, borderColor } = useContext(ThemeContext);
  const userId = useSelector(state => state?.auth?.userId);
  const [selectedFilter, setSelectedFilter] = useState('Daily');
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const { data: habitData = [], isLoading } = useHabitsChartData(userId);

  const filterOptions = ['Daily', 'Monthly', 'Yearly'];
  const styles = getStyles({ primaryColor, subTextColor, borderColor });

  useEffect(() => {
    const now = new Date();

    const isSameDay = (date) =>
      new Date(date).toDateString() === now.toDateString();

    const isSameMonth = (date) =>
      new Date(date).getMonth() === now.getMonth() &&
      new Date(date).getFullYear() === now.getFullYear();

    const isSameYear = (date) =>
      new Date(date).getFullYear() === now.getFullYear();

    const filterByDate = (dataToFilter) => {
      return dataToFilter.filter(item => {
        const itemDate = new Date(item.fullDate);
        if (selectedFilter === 'Daily') return isSameDay(itemDate);
        if (selectedFilter === 'Monthly') return isSameMonth(itemDate);
        if (selectedFilter === 'Yearly') return isSameYear(itemDate);
        return true;
      });
    };

    const filtered = filterByDate(habitData);
    const colored = filtered.map((item, index) => ({
      ...item,
      frontColor: index % 2 === 0 ? primaryColor : secondaryColor || '#F9FAFB',
    }));

    // Only update if data actually changed
    if (JSON.stringify(colored) !== JSON.stringify(filteredData)) {
      setFilteredData(colored);
    }
  }, [habitData, selectedFilter, primaryColor, secondaryColor]);

  const getDateLabel = () => {
    const today = new Date();
    const format = { year: 'numeric', month: 'long', day: 'numeric' };
    const monthFormat = { year: 'numeric', month: 'long' };
    const yearFormat = { year: 'numeric' };

    if (selectedFilter === 'Daily') return `Log - ${today.toLocaleDateString('en-US', format)}`;
    if (selectedFilter === 'Monthly') return `Log - ${today.toLocaleDateString('en-US', monthFormat)}`;
    if (selectedFilter === 'Yearly') return `Log - ${today.toLocaleDateString('en-US', yearFormat)}`;
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
          <Text style={styles.dailyBreakdownDate}>{getDateLabel()}</Text>
        </View>
        <View style={{ position: "relative", zIndex: 999 }}>
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

      <View style={styles.barChartWrapper}>
        {filteredData.length > 0 ? (
          <BarChart
            data={filteredData}
            barWidth={40}
            barBorderRadius={15}
            spacing={18}
            height={220}
            initialSpacing={10}
            noOfSections={4}
            yAxisThickness={0}
            xAxisThickness={0}
            hideYAxisText
            hideAxesAndRules
            showXAxisIndices={false}
            xAxisLabelTextStyle={{
              color: subTextColor,
              fontSize: 12,
              fontFamily: 'Inter-Regular',
            }}
            renderTooltip={(item) => (
              <View style={styles.tooltip}>
                <Text style={styles.tooltipText}>Completed: {item.value}</Text>
                <Text style={styles.tooltipText}>Date: {item.fullDate}</Text>
              </View>
            )}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No data available for this period.</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};




const getStyles = (theme) =>
    StyleSheet.create({
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
            top: 40,
            left: 0,
            width: "100%",
            backgroundColor: theme.primaryColor,
            borderRadius: 8,
            paddingVertical: 10,
            zIndex: 9999,
        },
        optionItem: {
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
        barChartWrapper: {
            width: '100%',
            // height is handled by gifted-charts, but you can set minHeight if needed
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
            height: 220, // Match chart height
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 8,
        },
        noDataText: {
            color: theme.subTextColor,
            fontSize: 14,
            fontFamily: 'Inter-Regular',
        },
    });

export default DailyBreakdownChart;
