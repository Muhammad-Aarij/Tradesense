import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground,
    Dimensions,
    SafeAreaView
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { bg, CheckMark, fail, tick } from '../../../assets/images';
import Header from '../../../components/Header';
import theme from '../../../themes/theme';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { enrollInCourse } from '../../../functions/handleCourses';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { trackAffiliateVisit } from '../../../functions/affiliateApi';

const { width, height } = Dimensions.get('window');

const PlanCard = ({
    title,
    price,
    description,
    planId,
    courseId,
    studentId,
    onPress,
    isSelected,
    onEnroll
}) => (
    <TouchableOpacity
        style={[styles.planCard, isSelected && styles.planCardSelected]}
        onPress={onPress}
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

const PlansScreenDeepLink = () => {
    const route = useRoute();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { plans = [], Courseid: courseId, affiliateCode } = route.params || {};
    const userData = useSelector(state => state.auth);
    const studentId = userData.userObject?._id;

    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalIcon, setModalIcon] = useState(null);
    const { isSignedIn, userToken, isProfilingDone } = useSelector(state => state.auth);

     const logVisit = async () => {
        const result = await trackAffiliateVisit({
            referrerUserId: affiliateCode,
            courseId,
            type: 'enrolled',
        });

        if (result.error) {
            console.warn("Affiliate enrolled tracking failed:", result.details || result.error);
        } else {
            console.log("Affiliate enrolled successfully");
        }
    };
    const handleEnroll = async ({ studentId, courseId, planId }) => {
        console.log("Enrolling with:", studentId, courseId, planId);

        try {
            dispatch(startLoading());

            const result = await enrollInCourse({
                studentId,
                courseId,
                plan: planId, // fixed key name
            });

            if (result && result._id) {
                await logVisit();
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
        console.log('🔐 isSignedIn:', isSignedIn);
        console.log('🪪 userToken:', userToken);
        console.log('📌 isProfilingDone:', isProfilingDone);

        setModalVisible(false);

        navigation.replace('MainFlow');

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

            <ImageBackground source={bg} style={styles.container}>
                <Header title={'Memberships'} />
                <SafeAreaView>
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
                            />
                        ))}
                    </ScrollView>
                </SafeAreaView>
            </ImageBackground>
        </>
    );
};

const styles = StyleSheet.create({
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
    planTitle: { color: '#FFFFFF', fontSize: 20, fontFamily: 'Outfit-Bold', marginBottom: 10 },
    planPrice: { color: theme.primaryColor, fontSize: 19, fontFamily: 'Outfit-Bold', marginBottom: 15 },
    divider: {
        width: '100%',
        marginBottom: 15,
        borderWidth: 0.7,
        borderColor: theme.borderColor,
    },
    description: {
        color: '#FFFFFF',
        fontSize: 14,
        marginLeft: 0,
        marginBottom: 15,
    },
    featuresContainer: { marginBottom: 20 },
    featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    checkIcon: { width: 20, height: 20, resizeMode: 'contain' },
    featureText: { color: '#FFFFFF', fontSize: 14, marginLeft: 10 },
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

export default PlansScreenDeepLink;
