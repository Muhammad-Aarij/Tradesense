import React, { useState, useContext, useMemo } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Image, ImageBackground, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../../components/Header';
import { bank, bg, blueArrow, cardd, googlePay, PayPal } from '../../../assets/images';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { ThemeContext } from '../../../context/ThemeProvider';
import LinearGradient from 'react-native-linear-gradient';
import { usePayments } from '../../../functions/affiliateApi';
import { useSelector } from 'react-redux';

const { height } = Dimensions.get("window");

const WithdrawScreen = ({ navigation, route }) => {
    const { theme, isDarkMode } = useContext(ThemeContext);
    const styles = useMemo(() => getStyles(theme), [theme]);
    const [showModal, setShowModal] = useState(false);
    const { totalAmount } = route.params;
    const { userId, isLoading: authLoading } = useSelector(state => state.auth);
    const { data: payments = [], isLoading } = usePayments(userId);
    console.log("✅ userId passed to usePayments:", userId);


    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <ImageBackground source={theme.bg} style={styles.container}>
            <ConfirmationModal
                title="Zero Balance Available"
                isVisible={showModal}
                onClose={() => setShowModal(false)}
            />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Header title="Withdraw" style={{ marginTop: 10, marginBottom: 20 }} />

                {/* Available Balance */}
                <LinearGradient start={{ x: 0, y: 0.95 }} end={{ x: 1, y: 1 }}
                    colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']} style={styles.balanceContainer}>
                    <Text style={styles.balanceAmount}>${totalAmount}</Text>
                    <Text style={styles.balanceLabel}>Available Balance</Text>
                </LinearGradient>

                {/* Withdraw Button */}
                <TouchableOpacity
                    style={styles.withdrawButton}
                    onPress={() => {
                        if (totalAmount < 1) {
                            setShowModal(true);
                        } else {
                            navigation.navigate('WithdrawDetailScreen', { totalAmount: totalAmount });
                        }
                    }}
                >
                    <Text style={styles.withdrawButtonText}>Withdraw</Text>
                </TouchableOpacity>

                {/* History Section */}
                <Text style={styles.historyTitle}>History</Text>
                <View style={styles.historyContainer}>
                    {[...payments]
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((item) => (

                            <LinearGradient
                                key={item._id}
                                start={{ x: 0, y: 0.95 }}
                                end={{ x: 1, y: 1 }}
                                colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                                style={styles.historyItem}
                            >
                                <View style={styles.historyItemLeft}>
                                    <Image source={cardd} style={styles.historyItemIcon} />
                                    <View>
                                        <Text style={styles.historyItemType}>{item.status}</Text>
                                        <Text style={styles.historyItemType2}>{formatDate(item.createdAt)}</Text>
                                    </View>
                                </View>
                                <View style={styles.historyItemRight}>
                                    <Text style={styles.historyItemAmount}>${item.amount}</Text>
                                    <Image source={blueArrow} style={styles.historyItemArrow} />
                                </View>
                            </LinearGradient>
                        ))}

                </View>
            </ScrollView>
        </ImageBackground>
    );
};

const getStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.backgroundColor,
            padding: 25,
        },
        scrollContent: {},
        balanceContainer: {
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderWidth: 0.9,
            borderColor: theme.borderColor,
            padding: 27,
            borderRadius: 14,
            alignItems: 'center',
            marginTop: 20,
        },
        balanceAmount: {
            color: theme.textColor,
            fontSize: 30,
            fontFamily: 'Outfit-Bold',
            marginBottom: 10,
        },
        balanceLabel: {
            color: theme.subTextColor,
            fontSize: 13,
            fontFamily: 'Outfit-Light-BETA',
        },
        withdrawButton: {
            backgroundColor: theme.primaryColor,
            width: '100%',
            padding: 15,
            borderRadius: 14,
            marginVertical: 30,
            alignItems: 'center',
        },
        withdrawButtonText: {
            color: '#fff',
            fontSize: 15,
            fontFamily: 'Outfit-Medium',
        },
        historyContainer: {
            marginBottom: 40,
            gap: 13,
        },
        historyTitle: {
            color: theme.textColor,
            fontSize: 14,
            fontFamily: 'Outfit-Regular',
            marginBottom: 15,
        },
        historyItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderWidth: 0.9,
            borderColor: theme.borderColor,
            padding: 16,
            borderRadius: 8,
        },
        historyItemLeft: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        historyItemIcon: {
            width: 37,
            height: 35,
            resizeMode: 'contain',
            marginRight: 10,
        },
        historyItemType: {
            textTransform: "capitalize",
            color: theme.textColor,
            fontSize: 13,
            fontFamily: 'Outfit-Regular',
        },
        historyItemType2: {
            color: theme.subTextColor,
            fontSize: 10,
            fontFamily: 'Outfit-Regular',
        },
        historyItemRight: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        historyItemAmount: {
            color: theme.textColor,
            fontSize: 13,
            fontFamily: 'Outfit-Medium',
            marginRight: 10,
        },
        historyItemArrow: {
            width: 15,
            height: 15,
            tintColor: '#AAAAAA',
            resizeMode: 'contain',
        },
    });

export default WithdrawScreen;
