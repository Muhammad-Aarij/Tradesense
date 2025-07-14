import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { back } from '../assets/images';
import { ThemeContext } from '../context/ThemeProvider';

const { width } = Dimensions.get('window');

const TopBreakdownChart = () => {
  const { theme } = useContext(ThemeContext);

  const [selectedFilter, setSelectedFilter] = useState('Daily');
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const filterOptions = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

  const styles = getStyles(theme);

  const chartData = [
    { value: 250, label: 'JAN', dataPointText: '250' },
    { value: 450, label: 'FEB', dataPointText: '450' },
    {
      value: 400,
      label: 'MAR',
      dataPointText: '400',
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
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={width}
          color={theme.primaryColor}
          curved
          dataPointsColor={theme.textColor}
          dataPointsRadius={4}
          yAxisColor="transparent"
          yAxisThickness={0}
          yAxisTextStyle={styles.yAxisText}
          maxValue={600}
          noOfSections={5}
          xAxisColor="transparent"
          xAxisThickness={0}
          xAxisLabelTextStyle={styles.xAxisText}
          verticalLinesOpacity={0.3}
          rulesColor="transparent"
          rulesThickness={0}
          areaChart={false}
        />

        <View style={styles.backgroundBars}>
          {chartData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.backgroundBar,
                {
                  left: 25 + index * 50,
                  backgroundColor: index === 2
                    ? theme.highlightBg || '#D6D6D6'
                    : theme.chartBg || '#eaeaea',
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {},
  chartContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundBars: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    marginBottom: 20,
    marginLeft: 10,
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
    backgroundColor: theme.primaryColor,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.bg || '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerDot: {
    width: 4,
    height: 4,
    backgroundColor: theme.textColor,
    borderRadius: 2,
  },
  yAxisText: {
    marginRight: 15,
    color: theme.subTextColor,
    fontSize: 12,
    fontFamily: 'Inter-Light-BETA',
  },
  xAxisText: {
    marginRight: 20,
    marginBottom: 5,
    color: theme.subTextColor,
    fontSize: 12,
    fontFamily: 'Inter-Light-BETA',
  },
});

export default TopBreakdownChart;
