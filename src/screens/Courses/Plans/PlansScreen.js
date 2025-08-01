import React, { useContext, useMemo, useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground,
    Dimensions, SafeAreaView, Alert, ActivityIndicator
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { bg, CheckMark, tick, fail } from '../../../assets/images';
import Header from '../../../components/Header';
import { ThemeContext } from '../../../context/ThemeProvider';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { useSubscriptionContext } from '../../../context/SubscriptionProvider';

const { height } = Dimensions.get('window');

const PlanCard = ({
    title,
    price,
    description,
    planId,
    courseId,
    studentId,
    onPress,
    isSelected,
    onPurchase,
    styles,
    theme,
    isLoading = false,
    packageeToPurchase = null
}) =>
    <TouchableOpacity
        style={[styles.planCard, isSelected && styles.planCardSelected]}
        onPress={onPress}
        activeOpacity={0.9}
    >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.planTitle}>{title}</Text>
            <Text style={styles.planPrice}>${price}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.featuresContainer}>
            <View style={styles.featuresContainer}>
                {description
                    .replace('Plan includes :', '') // remove leading label
                    .split('\n') // split by newlines
                    .map((line, index) => {
                        const trimmed = line.trim();
                        if (!trimmed) return null; // skip empty lines

                        return (
                            <View key={index} style={styles.featureItem}>
                                <Image source={CheckMark} style={[styles.checkIcon, { tintColor: theme.textColor }]} />
                                <Text style={styles.featureText}>{trimmed}</Text>
                            </View>
                        );
                    })}
            </View>
        </View>

        <TouchableOpacity
            style={[styles.checkoutButton, isLoading && styles.checkoutButtonDisabled]}
            onPress={() => onPurchase(packageeToPurchase)}
            disabled={isLoading || !packageeToPurchase}
        >
            {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
            ) : (
                <Text style={styles.checkoutButtonText}>Subscribe Now</Text>
            )}
        </TouchableOpacity>
    </TouchableOpacity>
;

const PlansScreen = () => {
    const { theme } = useContext(ThemeContext);
    const styles = useMemo(() => getStyles(theme), [theme]);

    const route = useRoute();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { plans = [], Courseid: courseId } = route.params || {};
    
    const userData = useSelector(state => state.auth);
    const studentId = userData.userObject?._id;

    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalIcon, setModalIcon] = useState(null);
    const [purchasingPlanId, setPurchasingPlanId] = useState(null);

    // RevenueCat subscription context
    const { 
        offerings, 
        isLoading: subscriptionLoading, 
        purchasepackagee, 
        isSubscribed 
    } = useSubscriptionContext();

    // Map plans to RevenueCat packagees
    const [planTopackageeMap, setPlanTopackageeMap] = useState({});

    useEffect(() => {
        if (offerings && offerings.current) {
            const mapping = {};
            plans.forEach(plan => {
                // Try to find matching packagee by plan name or ID
                const packagee = offerings.current.availablepackagees.find(pkg => 
                    pkg.identifier === plan._id || 
                    pkg.product.identifier === plan._id ||
                    pkg.product.title.toLowerCase().includes(plan.name.toLowerCase())
                );
                if (packagee) {
                    mapping[plan._id] = packagee;
                }
            });
            setPlanTopackageeMap(mapping);
        }
    }, [offerings, plans]);

    const handlePurchase = async (packageeToPurchase) => {
        if (!packageeToPurchase) {
            Alert.alert('Error', 'Subscription packagee not available');
            return;
        }

        try {
            setPurchasingPlanId(packageeToPurchase.identifier);
            dispatch(startLoading());

            await purchasepackagee(packageeToPurchase);
            
            setModalTitle('Subscription Successful');
            setModalMessage('You have been successfully subscribed to this plan.');
            setModalIcon(tick);
            setModalVisible(true);
        } catch (error) {
            console.error('Purchase error:', error);
            
            let errorMessage = 'Something went wrong. Please try again.';
            if (error.userCancelled) {
                errorMessage = 'Purchase was cancelled.';
            } else if (error.code === 'PURCHASE_CANCELLED_ERROR') {
                errorMessage = 'Purchase was cancelled.';
            } else if (error.code === 'NETWORK_ERROR') {
                errorMessage = 'Network error. Please check your connection.';
            }

            setModalTitle('Purchase Failed');
            setModalMessage(errorMessage);
            setModalIcon(fail);
            setModalVisible(true);
        } finally {
            setPurchasingPlanId(null);
            dispatch(stopLoading());
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        if (modalIcon === tick) {
            // Navigate to purchased courses on successful subscription
            navigation.navigate('PurchasedCoursesScreen');
        }
    };

    if (subscriptionLoading) {
        return (
            <ImageBackground source={theme.bg || bg} style={styles.container}>
                <Header title={'Memberships'} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.primaryColor} />
                    <Text style={[styles.loadingText, { color: theme.textColor }]}>
                        Loading subscription options...
                    </Text>
                </View>
            </ImageBackground>
        );
    }

    return (
        <>
            {modalVisible && (
                <ConfirmationModal
                    title={modalTitle}
                    description={modalMessage}
                    icon={modalIcon}
                    onClose={handleCloseModal}
                />
            )}

            <ImageBackground source={theme.bg || bg} style={styles.container}>
                <Header title={'Memberships'} />
                <SafeAreaView>
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {plans.map((plan) => {
                            const packageeToPurchase = planTopackageeMap[plan._id];
                            const isPurchasing = purchasingPlanId === plan._id;
                            
                            return (
                                <PlanCard
                                    key={plan._id}
                                    title={plan.name}
                                    price={packageeToPurchase ? packageeToPurchase.product.priceString : plan.price}
                                    description={plan.description}
                                    planId={plan._id}
                                    courseId={courseId}
                                    studentId={studentId}
                                    onPress={() => {
                                        setSelectedPlanId(plan._id);
                                    }}
                                    isSelected={selectedPlanId === plan._id}
                                    onPurchase={handlePurchase}
                                    styles={styles}
                                    theme={theme}
                                    isLoading={isPurchasing}
                                    packageeToPurchase={packageeToPurchase}
                                />
                            );
                        })}
                        
                        {plans.length === 0 && (
                            <View style={styles.noPlansContainer}>
                                <Text style={[styles.noPlansText, { color: theme.textColor }]}>
                                    No subscription plans available at the moment.
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </SafeAreaView>
            </ImageBackground>
        </>
    );
};

const getStyles = (theme) => StyleSheet.create({
    container: { flex: 1, padding: 25, paddingTop: 0 },
    scrollContent: { paddingBottom: height * 0.1 },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        textAlign: 'center'
    },
    noPlansContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 50
    },
    noPlansText: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24
    },
    planCard: {
        padding: 20,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9,
        borderColor: theme.borderColor,
        marginBottom: 25,
    },
    planCardSelected: { borderColor: theme.primaryColor },
    planTitle: { color: theme.textColor, fontSize: 19, fontFamily: 'Outfit-Bold', marginBottom: 10 },
    planPrice: { color: theme.primaryColor, fontSize: 19, fontFamily: 'Outfit-Bold', marginBottom: 15 },
    divider: {
        width: '100%',
        marginBottom: 15,
        borderWidth: 0.7,
        borderColor: theme.borderColor,
    },
    description: {
        color: theme.textColor,
        fontSize: 13,
        marginBottom: 15,
    },
    featuresContainer: { marginBottom: 20 },
    featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    checkIcon: { width: 20, height: 20, resizeMode: 'contain' },
    featureText: { color: theme.textColor, fontSize: 14, marginLeft: 10 },
    checkoutButton: {
        backgroundColor: theme.primaryColor,
        width: '100%',
        padding: 12,
        borderRadius: 11,
        marginTop: 20,
        alignItems: 'center',
    },
    checkoutButtonDisabled: {
        backgroundColor: theme.borderColor,
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        fontFamily: 'Outfit-SemiBold',
    },
});

export default PlansScreen;
