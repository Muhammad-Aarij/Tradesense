import React, { useContext, useMemo, useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground,
    Dimensions, SafeAreaView
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from "@env"; // Ensure you have API_URL set in your .env file
import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';

import { bg, CheckMark, tick } from '../../../assets/images';
import Header from '../../../components/Header';
import { ThemeContext } from '../../../context/ThemeProvider';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { enrollInCourse } from '../../../functions/Courses'; // You should already have this

const { height } = Dimensions.get('window');

// ------------------ Plan Card Component ------------------
const PlanCard = ({
    title,
    price,
    description,
    planId,
    courseId,
    studentId,
    onPress,
    isSelected,
    onEnroll,
    styles,
    theme
}) => (
    <TouchableOpacity
        style={[styles.planCard, isSelected && styles.planCardSelected]}
        onPress={onPress}
        activeOpacity={0.9}
    >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.planTitle, { textTransform: "capitalize" }]}>{title}</Text>
            <Text style={styles.planPrice}>${price}</Text>
        </View>
        <View style={styles.divider} />
        <Text style={styles.description}>{description}</Text>
        <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
                <Image source={CheckMark} style={[styles.checkIcon, { tintColor: theme.textColor }]} />
                <Text style={styles.featureText}>Full Access to Modules</Text>
            </View>
            <View style={styles.featureItem}>
                <Image source={CheckMark} style={[styles.checkIcon, { tintColor: theme.textColor }]} />
                <Text style={styles.featureText}>No Time Limit</Text>
            </View>
        </View>

        <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => onEnroll({ studentId, courseId, planId })}
        >
            <Text style={styles.checkoutButtonText}>Join</Text>
        </TouchableOpacity>
    </TouchableOpacity>
);

// ------------------ Main Screen ------------------
const PlansScreen = () => {
    const { theme } = useContext(ThemeContext);
    const styles = useMemo(() => getStyles(theme), [theme]);

    const route = useRoute();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const userData = useSelector(state => state.auth);
    const studentId = userData?.userObject?._id;
    const { Courseid: courseId } = route.params || {};

    const [plans, setPlans] = useState([]);
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     const fetchPlans = async () => {
    //         try {
    //             dispatch(startLoading());
    //             const response = await axios.get(`${API_URL}/api/plans?category=plans`);
    //             setPlans(response.data || []);
    //         } catch (error) {
    //             console.error('Failed to fetch plans:', error);
    //         } finally {
    //             dispatch(stopLoading());
    //         }
    //     };

    //     fetchPlans();

    //     return () => {
    //         dispatch(stopLoading()); // Optional: only needed if you want to ensure cleanup
    //     };
    // }, []);

    useEffect(() => {
        const fetchRevenueCatPlans = async () => {
            try {
                dispatch(startLoading());

                // Initialize RevenueCat
                await Purchases.configure({
                    apiKey: Platform.select({
                        ios: 'appl_oUpJQhOOMgTrruGSdHIbPStHUNm',
                        android: 'goog_NoUVHlSMLZnJLTGBDglGNAvuYyK',
                    }),
                    appUserID: studentId ?? null,
                });

                const offerings = await Purchases.getOfferings();

                if (offerings.current && offerings.current.availablePackages.length > 0) {
                    const mappedPlans = offerings.current.availablePackages.map((pkg) => ({
                        id: pkg.identifier,
                        title: pkg.product.title,
                        description: pkg.product.description,
                        price: pkg.product.priceString,
                        package: pkg, // Store original package for purchase
                    }));

                    setPlans(mappedPlans);
                } else {
                    setPlans([]);
                }

            } catch (error) {
                console.error('Failed to fetch offerings:', error);
            } finally {
                dispatch(stopLoading());
            }
        };

        fetchRevenueCatPlans();

        return () => {
            dispatch(stopLoading());
        };
    }, []);

    // const handleEnroll = async ({ studentId, courseId, planId }) => {
    //     // try {
    //     //   dispatch(startLoading());
    //     //   await enrollInCourse({ studentId, courseId, plan: planId });
    //     //   dispatch(stopLoading());
    //     //   setModalVisible(true);
    //     // } catch (error) {
    //     //   dispatch(stopLoading());
    //     //   console.error('Enrollment error:', error);
    //     // }
    // };

    const handleEnroll = async ({ packagee }) => {
        try {
            dispatch(startLoading());

            const { customerInfo } = await Purchases.purchasePackage(packagee);

            const isEntitled = customerInfo.entitlements.active["Premium Courses Access"]; 

            if (isEntitled) {
                setModalVisible(true); // show success modal
            }

        } catch (error) {
            if (!error.userCancelled) {
                console.error('Purchase failed:', error);
            }
        } finally {
            dispatch(stopLoading());
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        navigation.navigate('PurchasedCoursesScreen');
    };

    return (
        <>
            {modalVisible && (
                <ConfirmationModal
                    title={'Course Purchased Successfully'}
                    icon={tick}
                    onClose={handleCloseModal}
                />
            )}

            <ImageBackground source={theme.bg || bg} style={styles.container}>
                <SafeAreaView>
                    <Header title={'Subscription Plans'} />

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {plans.length === 0 ? (
                            <Text style={{ color: theme.subTextColor, textAlign: 'center', marginTop: 20 }}>
                                No plans found.
                            </Text>
                        ) : (
                            plans.map((plan) => (
                                <PlanCard
                                    key={plan.id}
                                    title={plan.title}
                                    price={plan.price}
                                    description={plan.description}
                                    planId={plan.id}
                                    courseId={courseId}
                                    studentId={studentId}
                                    onPress={() => setSelectedPlanId(plan.id)}
                                    isSelected={selectedPlanId === plan.id}
                                    onEnroll={() => handleEnroll({ packagee: plan.package })}
                                    styles={styles}
                                    theme={theme}
                                />
                            ))

                        )}
                    </ScrollView>
                </SafeAreaView>
            </ImageBackground>
        </>
    );
};

// ------------------ Styles ------------------
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
    planTitle: { color: theme.textColor, fontSize: 20, fontFamily: 'Inter-Bold', marginBottom: 10 },
    planPrice: { color: theme.primaryColor, fontSize: 19, fontFamily: 'Inter-Bold', marginBottom: 15 },
    divider: {
        width: '100%',
        marginBottom: 15,
        borderWidth: 0.7,
        borderColor: theme.borderColor,
    },
    description: {
        color: theme.textColor,
        fontSize: 14,
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
    checkoutButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
    },
});

export default PlansScreen;
