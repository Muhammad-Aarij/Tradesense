import React, { forwardRef, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { ThemeContext } from '../context/ThemeProvider';
import { back } from '../assets/images';

const screenHeight = Dimensions.get('window').height;

const TradeBottomSheet = forwardRef(({ trade }, ref) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const tradeDetails = trade
        ? [
            { label: 'Trade Date', value: new Date(trade.tradeDate).toLocaleDateString() },
            { label: 'Setup Name', value: trade.setupName },
            { label: 'Direction', value: trade.direction },
            { label: 'Entry Price', value: `$${trade.entryPrice}` },
            { label: 'Exit Price', value: `$${trade.exitPrice}` },
            { label: 'Quantity', value: `${trade.quantity}` },
            { label: 'Stop Loss', value: `$${trade.stopLoss}` },
            { label: 'Take Profit Target', value: `$${trade.takeProfitTarget}` },
            { label: 'Actual Exit Price', value: `$${trade.actualExitPrice}` },
            { label: 'Result', value: trade.result },
            { label: 'Emotional State', value: trade.emotionalState },
            { label: 'Attach Link', value: trade.image || 'No image' },
        ]
        : [];

    return (
        <RBSheet
            ref={ref}
            height={screenHeight * 0.75}
            closeOnDragDown={true}
            closeOnPressMask={true}
            customStyles={{
                container: {
                    backgroundColor: theme.darkBlue,
                    borderTopColor: theme.primaryColor,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    borderWidth: 1,
                    padding: 40,
                    paddingTop: 0,
                    paddingHorizontal: 40,
                },
            }}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => ref.current?.close()}>
                    <Text style={styles.title} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {tradeDetails.map((item, index) => (
                    <View key={index} style={styles.detailRow}>
                        <Text style={styles.label}>{item.label}</Text>
                        <Text style={styles.value}>{item.value}</Text>
                    </View>
                ))}
            </ScrollView>
        </RBSheet>
    );
});

const getStyles = (theme) =>
    StyleSheet.create({
        header: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
            width: "100%",
            marginTop: 20,
        },
        title: {
            height: 1,
            marginBottom: 20,
            width: 100,
            borderWidth: 2,
            borderRadius: 10,
            borderTopColor: theme.subTextColor,
            fontSize: 16,
            color: theme.textColor,
            fontWeight: 'bold',
        },
        closeIcon: {
            width: 22,
            height: 22,
            resizeMode: "contain",
            tintColor: theme.subTextColor,
            transform: [{ rotate: '90deg' }],
        },
        detailRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 16,
            //   borderBottomWidth: 0.6,
            //   borderBottomColor: theme.borderColor,
        },
        label: {
            fontSize: 13,
            color: "white" || '#AAA',
        },
        value: {
            fontSize: 13,
            color: "white",
        },
    });

export default TradeBottomSheet;
