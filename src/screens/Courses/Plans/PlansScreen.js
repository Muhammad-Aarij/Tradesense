// import React, { useContext, useMemo, useState, useEffect } from 'react';
// import {
//     View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground,
//     Dimensions, SafeAreaView, Alert, Platform
// } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { useDispatch, useSelector } from 'react-redux';
// import Purchases from 'react-native-purchases'; // Re-added Purchases import
// import { API_URL } from "@env"; // Keep if still used elsewhere, otherwise can be removed
// import { bg, CheckMark, tick, fail } from '../../../assets/images'; // Added 'fail' for error modal
// import Header from '../../../components/Header';
// import { ThemeContext } from '../../../context/ThemeProvider';
// import ConfirmationModal from '../../../components/ConfirmationModal';
// import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
// // Removed import for enrollInCourse as it's not used with RevenueCat purchases
// import LinearGradient from 'react-native-linear-gradient'; // Keep if used for styling

// const { height, width } = Dimensions.get('window');

// // ------------------ Plan Card Component ------------------
// const PlanCard = ({
//     title,
//     price,
//     description,
//     onPress,
//     isSelected,
//     onEnroll, // This will now receive the RevenueCat package object
//     styles,
//     theme
// }) => (
//     <TouchableOpacity
//         style={[styles.planCard, isSelected && styles.planCardSelected]}
//         onPress={onPress}
//         activeOpacity={0.9}
//     >
//         <View style={{ flexDirection: 'column', justifyContent: 'space-between', width: "100%", }}>
//             <Text style={[styles.planTitle, { textTransform: "capitalize" }]}>{title.replace("(trader 365)", "")}</Text>
//             <Text style={styles.planPrice}>{price}</Text>
//         </View>
//         <View style={styles.divider} />
//         {/* The description parsing logic from the previous version is retained here */}
//         <View style={styles.featuresContainer}>
//             {description
//                 .replace('Plan includes :', '') // remove leading label
//                 .split('\n') // split by newlines
//                 .map((line, index) => {
//                     const trimmed = line.trim();
//                     if (!trimmed) return null; // skip empty lines

//                     return (
//                         <View key={index} style={styles.featureItem}>
//                             <Image source={CheckMark} style={[styles.checkIcon, { tintColor: theme.textColor }]} />
//                             <Text style={styles.featureText}>{trimmed}</Text>
//                         </View>
//                     );
//                 })}
//         </View>

//         <TouchableOpacity
//             style={styles.checkoutButton}
//             onPress={onEnroll} // onEnroll is now directly called with the package
//         >
//             <Text style={styles.checkoutButtonText}>Join</Text>
//         </TouchableOpacity>
//     </TouchableOpacity>
// );

// // ------------------ Main Screen ------------------
// const PlansScreen = () => {
//     const { theme } = useContext(ThemeContext);
//     const styles = useMemo(() => getStyles(theme), [theme]);

//     const route = useRoute();
//     const dispatch = useDispatch();
//     const navigation = useNavigation();
//     const userData = useSelector(state => state.auth);
//     const studentId = userData?.userObject?._id;
//     // courseId might still be relevant if you want to associate RevenueCat purchases with specific courses in your backend
//     const { Courseid: courseId } = route.params || {}; 

//     const [plans, setPlans] = useState([]);
//     const [selectedPlan, setSelectedPlan] = useState(null);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [modalTitle, setModalTitle] = useState(''); // Added for dynamic modal content
//     const [modalMessage, setModalMessage] = useState(''); // Added for dynamic modal content
//     const [modalIcon, setModalIcon] = useState(null); // Added for dynamic modal content (tick/fail)

//     const [isSubscribed, setIsSubscribed] = useState(false);
//     const [plansFetched, setPlansFetched] = useState(false);

//     // Function to check subscription status using RevenueCat
//     const checkSubscriptionStatus = async () => {
//         try {
//             const customerInfo = await Purchases.getCustomerInfo();
//             // Assuming "Cours_Plans" is the entitlement ID you configured in RevenueCat
//             const entitlement = customerInfo.entitlements.active["Cours_Plans"];
//             return Boolean(entitlement); // true if active
//         } catch (error) {
//             console.error("Failed to fetch subscription status:", error);
//             return false;
//         }
//     };

//     // Effect to fetch plans from RevenueCat and check subscription status
//     useEffect(() => {
//         const fetchRevenueCatPlans = async () => {
//             dispatch(startLoading());
//             try {
//                 const [offerings, subscribed] = await Promise.all([
//                     Purchases.getOfferings(),
//                     checkSubscriptionStatus()
//                 ]);

//                 setIsSubscribed(subscribed);
//                 setPlansFetched(true);

//                 if (offerings.current && offerings.current.availablePackages.length > 0) {
//                     const mappedPlans = offerings.current.availablePackages.map(pkg => ({
//                         id: pkg.identifier,
//                         title: pkg.product.title.replace(/\s*\(.*?\)\s*/g, "").trim(),
//                         description: pkg.product.description,
//                         price: pkg.product.priceString,
//                         package: pkg // Store the full package object for purchase
//                     }));
//                     setPlans(mappedPlans);
//                     // Optionally pre-select the first plan if available
//                     if (mappedPlans.length > 0) {
//                         setSelectedPlan(mappedPlans[0]);
//                     }
//                 } else {
//                     setPlans([]);
//                 }
//             } catch (error) {
//                 console.error("Error fetching plans or status:", error);
//                 Alert.alert("Error", "Failed to load subscription plans. Please try again later.");
//                 setPlans([]);
//             } finally {
//                 dispatch(stopLoading());
//             }
//         };

//         fetchRevenueCatPlans();
//     }, [dispatch]); // Removed authToken from dependencies as it's not directly used here for RevenueCat fetches

//     // Handle enrollment (purchase) using RevenueCat
//     const handleEnroll = async (packagee) => {
//         try {
//             dispatch(startLoading());

//             const { customerInfo } = await Purchases.purchasePackage(packagee);
//             // Verify entitlement after purchase
//             const entitlement = customerInfo.entitlements.active["Cours_Plans"];

//             if (entitlement) {
//                 console.log("✅ Entitlement found!");

//                 // You can still send purchase data to your backend for your records if needed
//                 const purchaseData = {
//                     userId: studentId, // your app's user ID
//                     platform: Platform.OS,
//                     appUserID: customerInfo.originalAppUserId,
//                     productIdentifier: entitlement.productIdentifier,
//                     purchaseDate: entitlement.purchaseDate,
//                     expirationDate: entitlement.expirationDate,
//                     isSandbox: customerInfo.managementURL?.includes("sandbox") || false,
//                     // Add courseId if you want to link the purchase to a specific course in your backend
//                     courseId: courseId,
//                     planId: packagee.identifier // The RevenueCat package identifier can be your planId
//                 };
//                 console.log("purchaseData", purchaseData);

//                 // Example of sending data to your backend (uncomment and implement if needed)
//                 /*
//                 const response = await fetch(`${API_URL}/api/store-subscription`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${userData.token}` // Optional: If you require auth
//                     },
//                     body: JSON.stringify(purchaseData)
//                 });

//                 if (!response.ok) {
//                     throw new Error('Failed to store subscription in backend');
//                 }
//                 */

//                 setModalTitle('Course Purchased Successfully');
//                 setModalMessage('You have been successfully enrolled in this course.');
//                 setModalIcon(tick);
//                 setModalVisible(true);
//                 setIsSubscribed(true); // Update subscription status immediately
//             } else {
//                 setModalTitle("Purchase Failed");
//                 setModalMessage("The purchase was successful, but we could not verify your entitlement.");
//                 setModalIcon(fail);
//                 setModalVisible(true);
//             }
//         } catch (error) {
//             dispatch(stopLoading());

//             if (error.code === Purchases.PURCHASE_CANCELLED_ERROR_CODE) {
//                 Alert.alert("Purchase Cancelled", "You have cancelled the purchase.");
//             } else {
//                 console.error("❌ Purchase failed:", error);
//                 setModalTitle("Purchase Error");
//                 setModalMessage(`An error occurred: ${error.message || 'Something went wrong.'}`);
//                 setModalIcon(fail);
//                 setModalVisible(true);
//             }
//         } finally {
//             dispatch(stopLoading());
//         }
//     };

//     // Handle restoring purchases using RevenueCat
//     const handleRestorePurchases = async () => {
//         try {
//             dispatch(startLoading());
//             const customerInfo = await Purchases.restorePurchases();
//             // Check for the same entitlement used for purchases
//             const isEntitled = customerInfo.entitlements.active["Cours_Plans"];

//             if (isEntitled) {
//                 Alert.alert("Success", "Your purchases have been restored!");
//                 setIsSubscribed(true); // Update subscription status
//                 // Navigate or update state as needed
//             } else {
//                 Alert.alert("No Purchases Found", "No active purchases were found to restore.");
//             }
//         } catch (error) {
//             console.error('Restore failed:', error);
//             Alert.alert("Error", "Failed to restore purchases. Please try again.");
//         } finally {
//             dispatch(stopLoading());
//         }
//     };

//     const handleCloseModal = () => {
//         setModalVisible(false);
//         if (modalIcon === tick) {
//             // Navigate to the purchased courses screen or similar on successful enrollment
//             navigation.navigate('PurchasedCoursesScreen');
//         }
//     };

//     return (
//         <>
//             {modalVisible && (
//                 <ConfirmationModal
//                     isVisible={modalVisible}
//                     title={modalTitle}
//                     message={modalMessage} // Use 'message' prop for consistency
//                     icon={modalIcon}
//                     onClose={handleCloseModal}
//                 />
//             )}

//             <ImageBackground source={theme.bg || bg} style={styles.container}>
//                 <SafeAreaView>
//                     <Header title={'Subscription Plans'} />

//                     <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//                         {plansFetched && ( // Only render content once plans are fetched
//                             <>
//                                 {(isSubscribed || plans.length === 0) ? (
//                                     <View style={styles.noDataContainer}>
//                                         <LinearGradient
//                                             start={{ x: 0, y: 0 }}
//                                             end={{ x: 1, y: 1 }}
//                                             colors={['rgba(17, 103, 177, 0.05)', 'rgba(42, 157, 244, 0.01)', 'transparent']}
//                                             style={styles.noDataGradientWrapper}
//                                         >
//                                             <View style={styles.decorativeCircle1} />
//                                             <View style={styles.decorativeCircle2} />

//                                             <View style={styles.noDataContentContainer}>
//                                                 <View style={styles.noDataIconContainer}>
//                                                     <Text style={styles.noDataIcon}>{isSubscribed ? '✅' : '📭'}</Text>
//                                                     <View style={styles.iconGlow} />
//                                                 </View>

//                                                 <Text style={styles.noDataTitle}>
//                                                     {isSubscribed ? 'You’re Subscribed!' : 'No Plans Available'}
//                                                 </Text>

//                                                 <Text style={styles.noDataSubtitle}>
//                                                     {isSubscribed
//                                                         ? 'You already have full access to all premium content.'
//                                                         : 'Please check back later for available subscription plans.'}
//                                                 </Text>

//                                                 {isSubscribed && (
//                                                     <View style={styles.noDataActionContainer}>
//                                                         <LinearGradient
//                                                             start={{ x: 0, y: 0 }}
//                                                             end={{ x: 1, y: 0 }}
//                                                             colors={[theme.primaryColor, theme.primaryColor + '80']}
//                                                             style={styles.noDataDot}
//                                                         />
//                                                         <Text style={styles.noDataMessage}>
//                                                             Explore the courses section to start learning.
//                                                         </Text>
//                                                     </View>
//                                                 )}
//                                             </View>
//                                         </LinearGradient>
//                                     </View>
//                                 ) : (
//                                     plans.map((plan) => (
//                                         <PlanCard
//                                             key={plan.id}
//                                             title={plan.title}
//                                             price={plan.price}
//                                             description={plan.description}
//                                             onPress={() => setSelectedPlan(plan)}
//                                             isSelected={selectedPlan && selectedPlan.id === plan.id}
//                                             onEnroll={() => handleEnroll(plan.package)} // Pass the full package object
//                                             styles={styles}
//                                             theme={theme}
//                                         />
//                                     ))
//                                 )}
//                             </>
//                         )}

//                         <TouchableOpacity style={styles.restoreButton} onPress={handleRestorePurchases}>
//                             <Text style={styles.restoreButtonText}>Restore Purchases</Text>
//                         </TouchableOpacity>
//                     </ScrollView>
//                 </SafeAreaView>
//             </ImageBackground>
//         </>
//     );
// };

// // ------------------ Styles ------------------
// const getStyles = (theme) => StyleSheet.create({
//     container: { flex: 1, padding: 25, paddingTop: 0 },
//     scrollContent: { paddingBottom: height * 0.1 },
//     planCard: {
//         padding: 16,
//         borderRadius: 15,
//         backgroundColor: 'rgba(255, 255, 255, 0.06)',
//         borderWidth: 0.9,
//         borderColor: theme.borderColor,
//         marginBottom: 25,
//     },
//     planCardSelected: { borderColor: theme.primaryColor },
//     planTitle: { color: theme.textColor, fontSize: 15, lineHeight: 24, fontFamily: 'Outfit-Bold', marginBottom: 10, maxWidth: "100%", },
//     planPrice: { color: theme.primaryColor, fontSize: 13, fontFamily: 'Outfit-Bold', marginBottom: 15, textAlign: "right" },
//     divider: {
//         width: '100%',
//         marginBottom: 15,
//         borderWidth: 0.7,
//         borderColor: theme.borderColor,
//     },
//     description: {
//         color: theme.textColor,
//         fontSize: 14,
//         marginBottom: 15,
//     },
//     featuresContainer: { marginBottom: 20 },
//     featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
//     checkIcon: { width: 20, height: 20, resizeMode: 'contain' },
//     featureText: { color: theme.textColor, fontSize: 14, marginLeft: 10 },
//     checkoutButton: {
//         backgroundColor: theme.primaryColor,
//         width: '100%',
//         padding: 12,
//         borderRadius: 11,
//         marginTop: 20,
//         alignItems: 'center',
//     },
//     checkoutButtonText: {
//         color: '#fff',
//         fontSize: 15,
//         fontWeight: '600',
//         fontFamily: 'Outfit-SemiBold',
//     },
//     restoreButton: {
//         marginTop: 20,
//         alignSelf: 'center',
//     },
//     restoreButtonText: {
//         color: theme.primaryColor,
//         fontSize: 14,
//         fontFamily: 'Outfit-SemiBold',
//     },
//     noDataContainer: {
//         marginTop: width * 0.3,
//         alignSelf: "center",
//         overflow: 'hidden',
//     },
//     noDataGradientWrapper: {
//         borderRadius: 16,
//         borderWidth: 1,
//         borderColor: 'rgba(255, 255, 255, 0.1)',
//         position: 'relative',
//         overflow: 'hidden',
//     },
//     noDataContentContainer: {
//         alignItems: 'center',
//         paddingVertical: 40,
//         paddingHorizontal: 20,
//         minHeight: 280,
//         borderWidth: 2,
//         borderColor: theme.borderColor,
//     },
//     decorativeCircle1: {
//         position: 'absolute',
//         top: -30,
//         right: -30,
//         width: 120,
//         height: 120,
//         borderRadius: 60,
//         backgroundColor: 'rgba(59, 130, 246, 0.1)',
//         opacity: 0.6,
//     },
//     decorativeCircle2: {
//         position: 'absolute',
//         bottom: -40,
//         left: -40,
//         width: 140,
//         height: 140,
//         borderRadius: 70,
//         backgroundColor: 'rgba(147, 51, 234, 0.06)',
//         opacity: 0.4,
//     },
//     noDataIconContainer: {
//         width: 80,
//         height: 80,
//         borderRadius: 40,
//         alignItems: 'center',
//         justifyContent: 'center',
//         alignSelf: 'center',
//         marginBottom: 20,
//         position: 'relative',
//         borderWidth: 2,
//         borderColor: 'rgba(255, 255, 255, 0.2)',
//         marginVertical: 20,
//     },
//     iconGlow: {
//         position: 'absolute',
//         width: 100,
//         height: 100,
//         borderRadius: 50,
//         backgroundColor: theme.primaryColor,
//         opacity: 0.1,
//         zIndex: -1,
//     },
//     noDataIcon: {
//         fontSize: 36,
//         zIndex: 1,
//     },
//     noDataTitle: {
//         color: theme.subTextColor,
//         fontSize: 18,
//         fontFamily: 'Outfit-Bold',
//         marginBottom: 10,
//         textAlign: 'center',
//         letterSpacing: 0.3,
//         textShadowColor: 'rgba(0, 0, 0, 0.3)',
//         textShadowOffset: { width: 0, height: 2 },
//         textShadowRadius: 4,
//         paddingHorizontal: 8,
//     },
//     noDataSubtitle: {
//         color: theme.subTextColor,
//         fontSize: 14,
//         fontFamily: 'Outfit-Medium',
//         textAlign: 'center',
//         opacity: 0.9,
//         marginBottom: 24,
//         lineHeight: 20,
//         paddingHorizontal: 12,
//     },
//     inspirationalContainer: {

//         // marginBottom: 20,
//     },
//     motivationalBadge: {
//         borderRadius: 20,
//     },
//     motivationalBadgeInner: {
//         paddingVertical: 10,
//         paddingHorizontal: 18,
//         borderRadius: 20,
//         shadowColor: theme.primaryColor,
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.4,
//         shadowRadius: 8,
//         elevation: 6,
//         borderWidth: 1,
//         borderColor: 'rgba(255, 255, 255, 0.2)',
//     },
//     motivationalText: {
//         color: '#FFFFFF',
//         fontSize: 13,
//         fontFamily: 'Outfit-SemiBold',
//         textAlign: 'center',
//         letterSpacing: 0.2,
//     },
//     noDataActionContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         alignSelf: 'stretch',
//         paddingHorizontal: 16,
//         backgroundColor: 'rgba(255, 255, 255, 0.05)',
//         paddingVertical: 14,
//         borderRadius: 12,
//         borderWidth: 1,
//         borderColor: 'rgba(255, 255, 255, 0.1)',
//         marginHorizontal: 4,
//         marginBottom: 20,
//     },
//     noDataDot: {
//         width: 6,
//         height: 6,
//         borderRadius: 3,
//         marginRight: 12,
//         shadowColor: theme.primaryColor,
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.6,
//         shadowRadius: 4,
//         elevation: 4,
//     },
//     noDataMessage: {
//         color: theme.subTextColor,
//         fontSize: 13,
//         fontFamily: 'Outfit-Medium',
//         textAlign: 'left',
//         lineHeight: 19,
//         opacity: 0.9,
//         flex: 1,
//         letterSpacing: 0.1,
//     },
// });

// export default PlansScreen;
import React, { useContext, useMemo, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground,
    Dimensions, SafeAreaView, Alert
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { bg, CheckMark, tick, fail } from '../../../assets/images';
import Header from '../../../components/Header';
import { ThemeContext } from '../../../context/ThemeProvider';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { enrollInCourse } from '../../../functions/handleCourses';

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
            <Text style={styles.planTitle}>{title}</Text>
            <Text style={styles.planPrice}>${price}</Text>
        </View>
        <View style={styles.divider} />
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

        <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => onEnroll({ studentId, courseId, planId })}
        >
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
    const { plans = [], Courseid: courseId } = route.params || {};
    
    const userData = useSelector(state => state.auth);
    const studentId = userData.userObject?._id;

    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalIcon, setModalIcon] = useState(null);

    const handleEnroll = async ({ studentId, courseId, planId }) => {
        console.log("Enrolling with:", studentId, courseId, planId);

        try {
            dispatch(startLoading());

            const result = await enrollInCourse({
                studentId,
                courseId,
                plan: planId,
            });

            if (result && result._id) {
                setModalTitle('Course Purchased Successfully');
                setModalMessage('You have been successfully enrolled in this course.');
                setModalIcon(tick);
                setModalVisible(true);
            } else if (result?.message === 'Enrollment already exists') {
                setModalTitle('Already Enrolled');
                setModalMessage('You are already enrolled in this course.');
                setModalIcon(fail);
                setModalVisible(true);
            } else {
                console.warn("Enrollment failed: ", result);
                setModalIcon(fail);
                setModalTitle('Error');
                setModalMessage('Something went wrong. Please try again.');
                setModalVisible(true);
            }

        } catch (error) {
            console.error('Enrollment error:', error);
            if (error?.response?.data?.message === 'Enrollment already exists') {
                setModalTitle('Already Enrolled');
                setModalMessage('You are already enrolled in this course.');
                setModalIcon(fail);
            } else {
                setModalTitle('Error');
                setModalMessage('Something went wrong. Please try again.');
                setModalIcon(fail);
            }
            setModalVisible(true);
        } finally {
            dispatch(stopLoading());
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        if (modalIcon === tick) {
            // Navigate to purchased courses on successful enrollment
            navigation.navigate('PurchasedCoursesScreen');
        }
    };

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
                <SafeAreaView>
                <Header title={'Memberships'} />
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {plans.map((plan) => (
                            <PlanCard
                                key={plan._id}
                                title={plan.name}
                                price={plan.price}
                                description={plan.description}
                                planId={plan._id}
                                courseId={courseId}
                                studentId={studentId}
                                onPress={() => setSelectedPlanId(plan._id)}
                                isSelected={selectedPlanId === plan._id}
                                onEnroll={() =>
                                    handleEnroll({
                                        studentId,
                                        courseId,
                                        planId: plan._id,
                                    })
                                }
                                styles={styles}
                                theme={theme}
                            />
                        ))}
                        
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
    checkoutButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        fontFamily: 'Outfit-SemiBold',
    },
});

export default PlansScreen;