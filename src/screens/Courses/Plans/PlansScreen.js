import React, { useContext, useMemo, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground,
    Dimensions, SafeAreaView
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { bg, CheckMark, tick } from '../../../assets/images';
import Header from '../../../components/Header';
import { ThemeContext } from '../../../context/ThemeProvider';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { enrollInCourse } from '../../../functions/handleCourses';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';

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
    theme // ✅ receive theme here

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
        {/* <Text style={styles.description}>{description}</Text> */}
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
    console.log(plans);
    const userData = useSelector(state => state.auth);
    const studentId = userData.userObject?._id;

    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleEnroll = async ({ studentId, courseId, planId }) => {
        try {
            console.log(planId);
            dispatch(startLoading());
            await enrollInCourse({ studentId, courseId, plan: planId });
            dispatch(stopLoading());
            setModalVisible(true);
        } catch (error) {
            dispatch(stopLoading());
            console.error('Enrollment error:', error);
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
                                onPress={() => {
                                    setSelectedPlanId(plan._id);
                                    console.log(plan._id);
                                }}
                                isSelected={selectedPlanId === plan._id}
                                onEnroll={handleEnroll}
                                styles={styles}
                                theme={theme} // ✅ pass theme to fix tintColor

                            />
                        ))}
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
