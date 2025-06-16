import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground,
    Dimensions,
    SafeAreaView
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { bg, CheckMark, tick } from '../../../assets/images';
import Header from '../../../components/Header';
import theme from '../../../themes/theme';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { enrollInCourse } from '../../../functions/handleCourses';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
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
        <Text style={styles.description}>{description}</Text>
        <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
                <Image source={CheckMark} style={styles.checkIcon} />
                <Text style={styles.featureText}>Full Access to Modules</Text>
            </View>
            <View style={styles.featureItem}>
                <Image source={CheckMark} style={styles.checkIcon} />
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

const PlansScreen = () => {
    const route = useRoute();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { plans = [], Courseid: courseId } = route.params || {};
    const userData = useSelector(state => state.auth);
    console.log("UserData", userData);
    const studentId = userData.userObject?._id;

    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleEnroll = async ({ studentId, courseId, planId }) => {
        try {
            dispatch(startLoading);
            await enrollInCourse({ studentId, courseId, plan: planId });
            dispatch(stopLoading);
            setModalVisible(true);
        } catch (error) {
            dispatch(stopLoading);
            console.error('Enrollment error:', error);
            // You can add a toast here if you want
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
                                onEnroll={handleEnroll}
                            />
                        ))}
                    </ScrollView>
                </SafeAreaView>
            </ImageBackground>
        </>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 25, paddingTop: 20 },
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
    planTitle: { color: '#FFFFFF', fontSize: 20, fontFamily: 'Inter-Bold', marginBottom: 10 },
    planPrice: { color: theme.primaryColor, fontSize: 19, fontFamily: 'Inter-Bold', marginBottom: 15 },
    divider: {
        width: '100%',
        marginBottom: 15,
        borderTopWidth: 1,
        borderColor: 'rgba(209, 209, 209, 0.46)',
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
        fontFamily: 'Inter-SemiBold',
    },
});

export default PlansScreen;
