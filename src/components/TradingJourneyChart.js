
import React, { useContext, useMemo } from 'react';
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

const TradingJourneyChart = ({ userId }) => {
    const { theme } = useContext(ThemeContext);
    const styles = useMemo(() => createStyles(theme), [theme]);

    // Guard: If userId is not valid, show a message and do not fetch data
    if (!userId) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>User not found. Please log in again.</Text>
            </View>
        );
    }

    // 1. fetch P/L --------------------------------------------------------------
    const { data, isLoading, isError, error } = useWeeklyProfitLoss(userId);
    console.log("trading chat", data);

    // 2. last-7-days series -----------------------------------------------------
    const rawSeries = useMemo(() => {
        const map = new Map((data || []).map(i => [
            new Date(i.date).toISOString().split('T')[0],
            i.amount,
        ]));

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const out = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const key = d.toISOString().split('T')[0];
            const val = map.get(key) ?? 0;

            out.push({
                trueValue: val,                           // keep original
                label: d.toLocaleDateString('en-US', { weekday: 'short' }),
                dateLabel: d.getDate(),
            });
        }
        return out;
    }, [data]);

    // 3. shift upward so min → 0 -----------------------------------------------
    const shifted = useMemo(() => {
        if (!rawSeries.length) return [];

        const rawMin = Math.min(...rawSeries.map(p => p.trueValue));
        const offset = rawMin < 0 ? -rawMin : 0;      // ≥ 0

        return rawSeries.map(p => ({
            ...p,
            value: p.trueValue + offset,                // ⬆ shifted for chart
        }));
    }, [rawSeries]);

    // 4. axis labels reflecting TRUE values ------------------------------------
    const axisInfo = useMemo(() => {
        if (!shifted.length) return { min: 0, max: 1, labels: ['0'] };

        const vals = shifted.map(p => p.value);
        const minShifted = Math.min(...vals);         // always 0
        const maxShifted = Math.max(...vals);

        // nice step for 7 ticks
        const step = (() => {
            const rough = (maxShifted || 1) / 6;
            const pow10 = 10 ** Math.floor(Math.log10(rough));
            const f = rough / pow10;
            const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
            return nice * pow10;
        })();

        const maxRounded = Math.ceil(maxShifted / step) * step;

        const labels = Array.from({ length: 7 }, (_, i) => {
            // convert back to TRUE values by subtracting the offset
            const shiftedVal = minShifted + i * step; // 0, step, …

            const offset = Math.min(...rawSeries.map(p => p.trueValue)) < 0
                ? Math.min(...rawSeries.map(p => p.trueValue))
                : 0;

            const trueVal = shiftedVal + offset;

            return trueVal >= 1000
                ? `${Math.round(trueVal / 1000)}k`
                : trueVal.toFixed(trueVal % 1 ? 4 : 0); // keep decimals tidy
        });


        return { min: minShifted, max: maxRounded, labels };
    }, [shifted, rawSeries]);

    // 5. states ----------------------------------------------------------------
    if (isLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={theme.primaryColor} />
                <Text style={styles.loadingText}>Loading trading data…</Text>
            </View>
        );
    }
    if (isError) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>
                    {error?.message || 'Failed to fetch data. Please try again later.'}
                </Text>
            </View>
        );
    }

    // 6. render -----------------------------------------------------------------
    if (!data || data.length === 0 || !shifted || shifted.length === 0) {
        return null; // Don't render chart for empty data
    }


    return (
        <View style={styles.container}>
            <View style={styles.tradesHeader}>
                <Text style={styles.sectionTitle}>Your Trading Journey</Text>
                <TouchableOpacity>
                    <Image
                        source={back}
                        style={{
                            width: 10,
                            height: 10,
                            resizeMode: "contain",
                            tintColor: "#79869B",
                            transform: [{ rotate: "180deg" }],
                        }}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.chartWrapper}>
                <LineChart
                    data={shifted}
                    width={width - 40}
                    height={CHART_HEIGHT}
                    spacing={width / 9}
                    color={theme.primaryColor}
                    thickness={1}
                    hideDataPoints
                    hideRules={false}
                    rulesColor={theme.borderColor}
                    rulesThickness={0.2}
                    xAxisColor="transparent"
                    yAxisColor="transparent"
                    xAxisLabelTextStyle={styles.xAxisLabel}
                    minValue={axisInfo.min}
                    maxValue={axisInfo.max}
                    stepValue={(axisInfo.max - axisInfo.min) / 6}
                    yAxisLabelTexts={axisInfo.labels}
                    yAxisTextStyle={styles.yAxisLabel}
                    howVerticalLines
                    verticalLinesColor={theme.borderColor}
                    verticalLinesThickness={0.2}
                    areaChart
                    startFillColor={theme.primaryColor}
                    endFillColor={theme.backgroundColor}
                    startOpacity={0.3}
                    endOpacity={0}
                    pointerConfig={{
                        pointerStripUptoDataPoint: true,
                        pointerLabelComponent: items => (
                            <View style={styles.tooltip}>
                                <Text style={styles.tooltipText}>
                                    {items[0].label} {items[0].dateLabel}
                                </Text>
                                <Text style={styles.tooltipText}>
                                    P/L: ${items[0].trueValue.toLocaleString()}
                                </Text>
                            </View>
                        ),
                    }}
                    renderXAxisLabel={item => (
                        <View style={styles.customXAxisLabel}>
                            <Text style={styles.xAxisLabelDay}>{item.label}</Text>
                            <Text style={styles.xAxisLabelDate}>{item.dateLabel}</Text>
                        </View>
                    )}
                />
            </View>
        </View>
    );
}
// styles ---------------------------------------------------------------------
const createStyles = theme =>
    StyleSheet.create({
        container: { borderRadius: 8, marginBottom: 10 },
        center: {
            minHeight: CHART_HEIGHT,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.cardBackground,
        },
        sectionTitle: {
            color: theme.textColor,
            fontSize: 14,
            fontFamily: 'Outfit-Regular',
        },
        loadingText: { marginTop: 10, color: theme.textColor, fontSize: 16 },
        tradesHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        manageTradesText: {
            color: theme.primaryColor,
            fontSize: 11,
        },
        errorText: {
            color: theme.errorColor || 'red',
            fontSize: 16,
            textAlign: 'center',
            marginHorizontal: 20,
        },
        chartWrapper: { alignItems: 'center', padding: 10 },
        xAxisLabel: { color: theme.subTextColor, fontSize: 12 },
        yAxisLabel: { color: theme.subTextColor, fontSize: 12 },
        customXAxisLabel: { marginBottom: 12, alignItems: 'center' },
        xAxisLabelDay: {
            color: theme.subTextColor,
            fontSize: 12,
            fontWeight: 'bold',
        },
        xAxisLabelDate: { color: theme.subTextColor, fontSize: 10 },
        tooltip: {
            backgroundColor: theme.primaryColor,
            padding: 8,
            width: 140,
            borderRadius: 5,
            alignItems: 'center',
        },
        tooltipText: { color: '#FFFFFF', fontSize: 12 },
    });

export default TradingJourneyChart;