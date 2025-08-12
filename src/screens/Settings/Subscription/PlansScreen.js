import React, { useContext, useMemo, useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground,
    Dimensions, SafeAreaView, Alert, Linking
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Purchases from 'react-native-purchases';
import axios from 'axios';
import { API_URL } from "@env";
import { bg, CheckMark, tick } from '../../../assets/images';
import Header from '../../../components/Header';
import { ThemeContext } from '../../../context/ThemeProvider';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import LinearGradient from 'react-native-linear-gradient';
import SnackbarMessage from '../../../functions/SnackbarMessage';
import { getUserData } from '../../../functions/affiliateApi';
import { updateUserData } from '../../../redux/slice/authSlice';

const { height, width } = Dimensions.get('window');

// ✅ Duration formatter (legacy minutes support if needed elsewhere)
const getDurationText = (minutes) => {
    if (minutes < 0 || isNaN(minutes)) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ${mins} min`;
    } else {
        return `${mins} min`;
    }
};

// ✅ Subscription helpers
const formatSubscriptionLength = (count, unit) => {
    if (!count || !unit) return null;
    const unitMap = { DAY: 'Day', WEEK: 'Week', MONTH: 'Month', YEAR: 'Year' };
    const base = unitMap[unit] || String(unit).toString();
    return `${count} ${base}${count > 1 ? 's' : ''}`;
};

const formatPricePer = (priceString, count, unit) => {
    if (!priceString) return '';
    if (!unit) return priceString;
    const unitMap = { DAY: 'day', WEEK: 'week', MONTH: 'month', YEAR: 'year' };
    const base = unitMap[unit] || String(unit).toLowerCase();
    if (count && count !== 1) return `${priceString}/${count} ${base}s`;
    return `${priceString}/${base}`;
};

const PlanCard = ({ title, price, description, durationMinutes, periodCount, periodUnit, onPress, isSelected, onEnroll, styles, theme }) => (
    <TouchableOpacity
        style={[styles.planCard, isSelected && styles.planCardSelected]}
        onPress={onPress}
        activeOpacity={0.9}
    >
        <View style={{ flexDirection: 'column', justifyContent: 'space-between', width: "100%" }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={[styles.planTitle, { textTransform: "capitalize" }]}>{title.replace("(trader 365)", "")}</Text>
                <Text style={[styles.planTitle, { textTransform: "capitalize", fontSize: 12, fontFamily: 'Outfit-Medium', color: theme.subTextColor }]}>(Monthly Subscription)</Text>
            </View>
            <Text style={styles.planPrice}>{formatPricePer(price, periodCount, periodUnit)}</Text>
        </View>
        <View style={styles.divider} />

        {!!description && (
            <Text style={styles.description}>
                {description} 
            </Text>
        )}

        {!!formatSubscriptionLength(periodCount, periodUnit) && (
            <Text style={styles.planMeta}>Length: {formatSubscriptionLength(periodCount, periodUnit)}</Text>
        )}

        <View style={styles.featuresContainer}>
            {["Full Access to Modules", "No Time Limit"].map((feature, i) => (
                <View key={i} style={styles.featureItem}>
                    <Image source={CheckMark} style={[styles.checkIcon, { tintColor: theme.textColor }]} />
                    <Text style={styles.featureText}>{feature}</Text>
                </View>
            ))}
        </View>

        <View style={styles.linkRow}>
            <TouchableOpacity onPress={() => Linking.openURL('https://trader365.co.uk/privacy-policy-for-trader365/') }>
                <Text style={styles.linkText}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.dotSeparator}> • </Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://trader365.co.uk/trader365-end-user-license-agreement-eula/') }>
                <Text style={styles.linkText}>Terms of Use</Text>
            </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.checkoutButton} onPress={onEnroll}>
            <Text style={styles.checkoutButtonText}>Join</Text>
        </TouchableOpacity>
    </TouchableOpacity>
);

const PlansScreen = () => {
    const { theme } = useContext(ThemeContext);
    const styles = useMemo(() => getStyles(theme), [theme]);

    const route = useRoute();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const userData = useSelector(state => state.auth);
    const studentId = userData?.userObject?._id;
    const isPremiumUser = userData?.userObject?.isPremium;

    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [plansFetched, setPlansFetched] = useState(false);
    const [snackbar, setSnackbar] = useState({ visible: false, text: '', type: 'info' });

    const showSnackbar = (text, type = 'info') => {
        setSnackbar({ visible: true, text, type });
        setTimeout(() => setSnackbar({ visible: false, text: '', type: 'info' }), 3000);
    };

    useEffect(() => {
        if (!studentId) return;

        const initializeScreen = async () => {
            dispatch(startLoading());
            try {
                if (isPremiumUser) {
                    setIsSubscribed(true);
                    showSnackbar("You already have an active subscription.", "success");
                    setPlansFetched(true);
                    return;
                }

                const offerings = await Purchases.getOfferings();
                const allPackages = Object.values(offerings.all || {}).flatMap(offering =>
                    (offering.availablePackages || []).map(pkg => ({
                        id: pkg.identifier,
                        title: pkg.product.title.replace(/\s*\(.*?\)\s*/g, "").trim(),
                        description: pkg.product.description,
                        price: pkg.product.priceString,
                        // Subscription period details surfaced by RevenueCat
                        periodUnit: pkg.product.subscriptionPeriodUnit, // DAY | WEEK | MONTH | YEAR
                        periodCount: pkg.product.subscriptionPeriodNumberOfUnits, // number of units
                        durationMinutes: null, // legacy field not used for subscriptions
                        package: pkg
                    }))
                );

                setPlans(allPackages);
            } catch (error) {
                console.error("Error initializing plans:", error);
                showSnackbar("Failed to fetch plans or user data.", "error");
            } finally {
                setPlansFetched(true);
                dispatch(stopLoading());
            }
        };

        initializeScreen();
    }, [studentId, theme, userData?.userToken]);

    const closeBackend = async (data) => {
        try {
            dispatch(startLoading());
            await axios.post(`${API_URL}/api/subscription`, data, {
                headers: { "Content-Type": "application/json" },
                responseType: "text"
            });
            showSnackbar("Subscription saved successfully!", "success");

            const updatedUser = await getUserData(studentId);
            dispatch(updateUserData(updatedUser));

        } catch (error) {
            console.error("Backend subscription save failed:", error.message);
            showSnackbar("Failed to save subscription data.", "error");
        } finally {
            dispatch(stopLoading());
        }
    };

    const handleEnroll = async (packagee) => {
        try {
            dispatch(startLoading());
            await Purchases.purchasePackage(packagee);
            const { entitlements, originalAppUserId, managementURL } = await Purchases.getCustomerInfo();
            const entitlement = entitlements.active["premium_subscription"];
            console.log(entitlement);
            if (!entitlement) {
                Alert.alert("Purchase Failed", "Purchase succeeded but entitlement was not confirmed.");
                return;
            }

            const data = {
                userId: studentId,
                appUserId: originalAppUserId,
                productIdentifier: entitlement.productIdentifier,
                purchaseDate: entitlement.latestPurchaseDate,
                expirationDate: entitlement.expirationDate,
                environment: managementURL?.includes("sandbox") ? "sandbox" : "production",
            };

            await closeBackend(data);
            setModalVisible(true);
        } catch (error) {
            if (error.code === Purchases.PURCHASE_CANCELLED_ERROR_CODE) {
                showSnackbar("You have cancelled the purchase.", "info");
            } else if (error.message?.includes("already active for the user")) {
                showSnackbar("You already own this subscription.", "success");
            } else {
                console.error("Purchase failed:", error);
                showSnackbar("An error occurred while buying the subscription", "error");
            }
        } finally {
            dispatch(stopLoading());
        }
    };

    const handleRestorePurchases = async () => {
        try {
            dispatch(startLoading());
            const customerInfo = await Purchases.restorePurchases();
            if (customerInfo.entitlements.active["Premium Courses Access"]) {
                Alert.alert("Success", "Your purchases have been restored!");
            } else {
                Alert.alert("No Purchases Found", "No active purchases were found to restore.");
            }
        } catch (error) {
            console.error('Restore failed:', error);
            Alert.alert("Error", "Failed to restore purchases. Please try again.");
        } finally {
            dispatch(stopLoading());
        }
    };

    return (
        <>
            {modalVisible && (
                <ConfirmationModal
                    title={'Course Purchased Successfully'}
                    icon={tick}
                    onClose={() => { setModalVisible(false); navigation.goBack(); }}
                />
            )}

            <ImageBackground source={theme.bg || bg} style={styles.container}>
                <SafeAreaView>
                    <SnackbarMessage visible={snackbar.visible} message={snackbar.text} type={snackbar.type} />
                    <Header title={'Subscription Plans'} />

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {plansFetched && (
                            <>
                                {(isSubscribed || plans.length === 0) ? (
                                    <View style={styles.noDataContainer}>
                                        <LinearGradient
                                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                                            colors={['rgba(17, 103, 177, 0.05)', 'rgba(42, 157, 244, 0.01)', 'transparent']}
                                            style={styles.noDataGradientWrapper}
                                        >
                                            <View style={styles.decorativeCircle1} />
                                            <View style={styles.decorativeCircle2} />
                                            <View style={styles.noDataContentContainer}>
                                                <View style={styles.noDataIconContainer}>
                                                    <Text style={styles.noDataIcon}>{isSubscribed ? '✅' : '📭'}</Text>
                                                    <View style={styles.iconGlow} />
                                                </View>
                                                <Text style={styles.noDataTitle}>
                                                    {isSubscribed ? 'You’re Subscribed!' : 'No Plans Available'}
                                                </Text>
                                                <Text style={styles.noDataSubtitle}>
                                                    {isSubscribed
                                                        ? 'You already have full access to all premium content.'
                                                        : 'Please check back later for available subscription plans.'}
                                                </Text>
                                            </View>
                                        </LinearGradient>
                                    </View>
                                ) : (
                                    plans.map(plan => (
                                        <PlanCard
                                            key={plan.id}
                                            title={plan.title}
                                            price={plan.price}
                                            description={plan.description}
                                            durationMinutes={plan.durationMinutes}
                                            periodUnit={plan.periodUnit}
                                            periodCount={plan.periodCount}
                                            onPress={() => setSelectedPlan(plan)}
                                            isSelected={selectedPlan?.id === plan.id}
                                            onEnroll={() => handleEnroll(plan.package)}
                                            styles={styles}
                                            theme={theme}
                                        />
                                    ))
                                )}
                            </>
                        )}

                        <TouchableOpacity style={styles.restoreButton} onPress={handleRestorePurchases}>
                            <Text style={styles.restoreButtonText}>Restore Purchases</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </SafeAreaView>
            </ImageBackground>
        </>
    );
};

const getStyles = (theme) => StyleSheet.create({
    container: { flex: 1, padding: 25, paddingTop: 0 },
    scrollContent: { paddingBottom: height * 0.1 },
    planCard: {
        padding: 16,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9,
        borderColor: theme.borderColor,
        marginBottom: 25,
    },
    planCardSelected: { borderColor: theme.primaryColor },
    planTitle: { color: theme.textColor, fontSize: 15, fontFamily: 'Outfit-Bold', marginBottom: 10 },
    planPrice: { color: theme.primaryColor, fontSize: 16, fontFamily: 'Outfit-Bold', marginBottom: 15, textAlign: "right" },
    divider: { width: '100%', marginBottom: 15, borderWidth: 0.7, borderColor: theme.borderColor },
    description: { color: theme.textColor, fontSize: 14, marginBottom: 15 },
    planMeta: { color: theme.subTextColor, fontSize: 13, marginBottom: 12, fontFamily: 'Outfit-Medium' },
    featuresContainer: { marginBottom: 20 },
    featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    checkIcon: { width: 20, height: 20, resizeMode: 'contain' },
    featureText: { color: theme.textColor, fontSize: 14, marginLeft: 10 },
    linkRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginTop: 4, marginBottom: 12 },
    linkText: { color: theme.primaryColor, fontSize: 13, textDecorationLine: 'underline', fontFamily: 'Outfit-SemiBold' },
    dotSeparator: { color: theme.subTextColor, fontSize: 13, marginHorizontal: 8 },
    checkoutButton: { backgroundColor: theme.primaryColor, width: '100%', padding: 12, borderRadius: 11, marginTop: 20, alignItems: 'center' },
    checkoutButtonText: { color: '#fff', fontSize: 15, fontFamily: 'Outfit-SemiBold' },
    restoreButton: { marginTop: 20, alignSelf: 'center' },
    restoreButtonText: { color: theme.primaryColor, fontSize: 14, fontFamily: 'Outfit-SemiBold' },
    noDataContainer: { marginTop: width * 0.3, alignSelf: "center" },
    noDataGradientWrapper: { borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' },
    noDataContentContainer: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20, minHeight: 280, borderWidth: 2, borderColor: theme.borderColor },
    decorativeCircle1: { position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(59,130,246,0.1)', opacity: 0.6 },
    decorativeCircle2: { position: 'absolute', bottom: -40, left: -40, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(147,51,234,0.06)', opacity: 0.4 },
    noDataIconContainer: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)', marginVertical: 20 },
    iconGlow: { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: theme.primaryColor, opacity: 0.1, zIndex: -1 },
    noDataIcon: { fontSize: 36, zIndex: 1 },
    noDataTitle: { color: theme.subTextColor, fontSize: 18, fontFamily: 'Outfit-Bold', marginBottom: 10, textAlign: 'center' },
    noDataSubtitle: { color: theme.subTextColor, fontSize: 14, fontFamily: 'Outfit-Medium', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
});

export default PlansScreen;
