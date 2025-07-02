import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Dimensions,
    ImageBackground,
    Text,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../../components/Header';
import PurchasedCourseCard from '../../Courses/purchaseCourse/PurchaseCourseCard';
import { useEnrolledCourses } from '../../../functions/handleCourses';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { setAffiliateData } from '../../../redux/slice/authSlice';
import { bg } from '../../../assets/images';
import { getUserDetails, sendAffiliateRequest } from '../../../functions/affiliateApi';
import theme from '../../../themes/theme';

const encodeToken = (courseId, userToken) => {
    const payload = JSON.stringify({ courseId, userToken });
    return Buffer.from(payload).toString('base64');
};

const { width } = Dimensions.get('window');

const AffiliateCoursesScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { userToken, userId, isAffiliate } = useSelector(state => state.auth);
    const { data: courses, isLoading } = useEnrolledCourses(userId);
    console.log("UserId", userId);

    const [checkedAffiliate, setCheckedAffiliate] = useState(false);

    useEffect(() => {
        const checkAffiliateStatus = async () => {
            try {
                dispatch(startLoading());

                // Skip API call if already affiliate
                if (!isAffiliate) {
                    const { affiliateCode, isAffiliate } = await getUserDetails(userId);
                    dispatch(setAffiliateData({ isAffiliate, affiliateCode }));
                }

                setCheckedAffiliate(true);
            } catch (err) {
                Alert.alert('Error', 'Could not check affiliate status');
            } finally {
                dispatch(stopLoading());
            }
        };

        checkAffiliateStatus();
    }, []);

    const handleRequestAffiliate = async () => {
        try {
            dispatch(startLoading());
            await sendAffiliateRequest(userId);
            Alert.alert('Success', 'Affiliate request sent successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to send affiliate request');
        } finally {
            dispatch(stopLoading());
        }
    };

    const renderItem = ({ item }) => {
        const token = encodeToken(item._id, userToken);
        const deepLinkUrl = `https://radiant-semifreddo-45674c.netlify.app/?token=${token}`;

        return (
            <PurchasedCourseCard
                course={{
                    ...item,
                    type: 'Affiliate',
                    url: deepLinkUrl,
                }}
                onPress={() => console.log(deepLinkUrl)}
            />
        );
    };

    return (
        <ImageBackground source={bg} style={styles.container}>
            <Header title="Affiliated Courses" style={{ marginBottom: 35 }} />

            {checkedAffiliate && isAffiliate ? (
                <FlatList
                    data={courses}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            ) : checkedAffiliate && !isAffiliate ? (
                <View style={styles.messageContainer}>
                    <Text style={styles.messageText}>
                        You are not an affiliate yet.
                    </Text>
                    <TouchableOpacity style={styles.requestButton} onPress={handleRequestAffiliate}>
                        <Text style={styles.requestButtonText}>Request Affiliate Access</Text>
                    </TouchableOpacity>
                </View>
            ) : null}
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#08131F',
        padding: 25,
        paddingTop: 5,
    },
    listContainer: {
        paddingBottom: 120,
        marginBottom: 100,
    },
    messageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    messageText: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        marginBottom: 20,
        textAlign: 'center',
    },
    requestButton: {
        backgroundColor: theme.primaryColor,
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 28,
    },
    requestButtonText: {
        color: '#FFF',
        fontSize: 12,
        fontFamily: 'Inter-Regular',
    },
});

export default AffiliateCoursesScreen;
