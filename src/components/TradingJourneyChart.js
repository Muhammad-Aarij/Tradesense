import React, { useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { ThemeContext } from '../context/ThemeProvider';
import { useWeeklyProfitLoss } from '../functions/Trades';
import { back } from '../assets/images';

const { width } = Dimensions.get('window');
const CHART_HEIGHT = 220;
const HORIZONTAL_PADDING = 20;

/** utils: make a local YYYY-MM-DD (no timezone shifting) */
const ymdLocal = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/** If API gives "2025-08-09", parse as local midnight, not UTC */
const parseAPIDateLocal = (yyyyMmDd) => {
  const [y, m, d] = yyyyMmDd.split('-').map((n) => parseInt(n, 10));
  return new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
};

const niceStep = (roughStep) => {
  if (!isFinite(roughStep) || roughStep <= 0) return 1;
  const exp = Math.floor(Math.log10(roughStep));
  const frac = roughStep / Math.pow(10, exp);
  const niceFrac = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 5 ? 5 : 10;
  return niceFrac * Math.pow(10, exp);
};

const computeYAxis = (values, sections = 6) => {
  if (!values || values.length === 0) return { min: 0, max: 1, sections };
  // Determine range strictly from the dataset, but ignore zeros when they're
  // the only small values (common when "no trade" days are encoded as 0).
  const finiteValues = values.filter((v) => Number.isFinite(v));
  const negatives = finiteValues.filter((v) => v < 0);
  const positives = finiteValues.filter((v) => v > 0);

  // min: prefer actual negatives if present; otherwise smallest positive
  // (ignoring zeros). Fallback to 0 when all zeroes.
  let rawMin;
  if (negatives.length > 0) rawMin = Math.min(...negatives);
  else if (positives.length > 0) rawMin = Math.min(...positives);
  else rawMin = 0;

  // max: prefer positives if present; otherwise take the largest (likely a
  // negative or zero)
  let rawMax;
  if (positives.length > 0) rawMax = Math.max(...positives);
  else rawMax = Math.max(...finiteValues);

  let min = rawMin;
  let max = rawMax;
  if (max === min) {
    const pad = Math.max(100, Math.abs(max) * 0.5 || 100);
    min -= pad / 2;
    max += pad / 2;
  }

  const step = niceStep((max - min) / sections);
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  return { min: niceMin, max: niceMax, sections };
};

const TradingJourneyChart = ({ userId }) => {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [chartProcessingError] = useState(false);

  if (!userId) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>User ID not available for chart.</Text>
      </View>
    );
  }

  const { data, isLoading, isError, error } = useWeeklyProfitLoss(userId);
  // console.log('data in journey chart ++++?>>>>>>>', data);

  // ---- Build 7-day series using LOCAL date keys (critical fix) ----
  const series = useMemo(() => {
    try {
      if (!data || !Array.isArray(data)) return [];

      // Map API data -> local key
      const map = new Map(
        data.map((i) => {
          const dt = parseAPIDateLocal(String(i.date)); // local date from "YYYY-MM-DD"
          const key = ymdLocal(dt);
          return [key, Number(i.amount) || 0];
        })
      );

      // Build last 7 local days (Sun..Sat or whatever today is)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const out = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);

        const key = ymdLocal(d); // local key to match the map above
        const val = map.get(key) ?? 0;

        out.push({
          value: val,
          label: d.toLocaleDateString('en-US', { weekday: 'short' }),
          dateLabel: d.getDate(),
        });
      }
      return out;
    } catch (e) {
      console.error('Failed to process series data:', e);
      return [];
    }
  }, [data]);

  const yAxis = useMemo(() => {
    const vals = series.map((p) => p.value);
    return computeYAxis(vals, 6);
  }, [series]);

  // Shift data so that chart's baseline (0) equals the real min. This works
  // around the library's areaChart baseline being fixed at 0.
  const shiftedSeries = useMemo(() => {
    const offset = yAxis.min;
    return series.map((p) => ({ ...p, value: p.value - offset }));
  }, [series, yAxis.min]);

  const yAxisLabelTexts = useMemo(() => {
    const labels = [];
    const totalSteps = yAxis.sections;
    const step = (yAxis.max - yAxis.min) / totalSteps;
    for (let i = 0; i <= totalSteps; i++) {
      const v = yAxis.min + i * step;
      labels.push(Number.isFinite(v) ? Math.round(v).toLocaleString('en-US') : '');
    }
    return labels;
  }, [yAxis.min, yAxis.max, yAxis.sections]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.primaryColor} />
        <Text style={styles.loadingText}>Loading chart data...</Text>
      </View>
    );
  }

  if (isError || chartProcessingError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {isError ? error?.message || 'Failed to load chart data.' : 'Error processing chart data.'}
        </Text>
      </View>
    );
  }

  if (!series || series.length === 0) {
    return (
      <View style={{ ...styles.center, marginBottom: 15 }}>
        <Text style={styles.errorText}>No trading data available for the last 7 days.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tradesHeader}>
        <Text style={styles.sectionTitle}>Your trading journey</Text>
        <TouchableOpacity>
          <Image
            source={back}
            style={{
              width: 10,
              height: 10,
              resizeMode: 'contain',
              tintColor: '#79869B',
              transform: [{ rotate: '180deg' }],
            }}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.chartWrapper}>
        <LineChart
          data={shiftedSeries}
          width={width - HORIZONTAL_PADDING * 2}
          height={CHART_HEIGHT}
          spacing={width / 9}
          color={theme.primaryColor}
          thickness={1}
          showDataPoints
          dataPointsRadius={3}
          rulesColor={theme.borderColor}
          rulesThickness={0.2}
          xAxisColor={theme.borderColor}
          yAxisColor="transparent"
          xAxisLabelTextStyle={styles.xAxisLabel}
          minValue={0}
          maxValue={yAxis.max - yAxis.min}
          noOfSections={yAxis.sections}
          yAxisLabelTexts={yAxisLabelTexts}
          yAxisLabelWidth={56}
          yAxisTextStyle={styles.yAxisLabel}
          showVerticalLines
          verticalLinesColor={theme.borderColor}
          verticalLinesThickness={0.2}
          areaChart
          startFillColor={theme.primaryColor}
          endFillColor={theme.backgroundColor}
          startOpacity={0.3}
          endOpacity={0}
          hideRules
          showReferenceLine1
          referenceLine1Position={0}
          referenceLine1Color={theme.borderColor}
          referenceLine1StrokeDashArray={[4, 4]}
          referenceLine1Thickness={0.2}
          xAxisLabelsVerticalShift={0}
          renderXAxisLabel={(item) => (
            <View style={styles.customXAxisLabel}>
              <Text style={styles.xAxisLabelDay}>{item.label}</Text>
              <Text style={styles.xAxisLabelDate}>{item.dateLabel}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      borderRadius: 8,
      marginBottom: 10,
    },
    center: {
      minHeight: CHART_HEIGHT,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.cardBackground || 'rgba(255, 255, 255, 0.06)',
      borderRadius: 8,
    },
    sectionTitle: {
      color: theme.textColor,
      fontSize: 14,
      fontFamily: 'Outfit-Regular',
    },
    loadingText: {
      marginTop: 10,
      color: theme.textColor,
      fontSize: 16,
      fontFamily: 'Outfit-Regular',
    },
    tradesHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    errorText: {
      color: theme.errorColor || 'white',
      fontSize: 12,
      textAlign: 'center',
      marginHorizontal: 20,
      fontFamily: 'Outfit-Bold',
    },
    chartWrapper: {
      alignItems: 'center',
      padding: 10,
      backgroundColor: theme.cardBackground || 'rgba(255, 255, 255, 0.06)',
      borderRadius: 8,
    },
    xAxisLabel: {
      color: theme.subTextColor,
      fontSize: 12,
    },
    yAxisLabel: {
      color: theme.subTextColor,
      fontSize: 12,
    },
    customXAxisLabel: {
      marginBottom: 12,
      alignItems: 'center',
    },
    xAxisLabelDay: {
      color: theme.subTextColor,
      fontSize: 12,
      fontWeight: 'bold',
    },
    xAxisLabelDate: {
      color: theme.subTextColor,
      fontSize: 10,
    },
  });

export default TradingJourneyChart;
