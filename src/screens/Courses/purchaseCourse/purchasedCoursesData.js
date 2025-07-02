import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ImageBackground,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { bg, fail, tick, user } from '../../../assets/images';
import Header from '../../../components/Header';
import PurchasedCourseCard from './PurchaseCourseCard';
import CourseCard from '../courseList/CourseCard';
import { useEnrolledCourses, useCourses } from '../../../functions/handleCourses';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import theme from '../../../themes/theme';
import { sendAffiliateRequest } from '../../../functions/affiliateApi';
import ConfirmationModal from '../../../components/ConfirmationModal';

const { height, width } = Dimensions.get('window');

const PurchasedCoursesScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalSuccess, setModalSuccess] = useState(null); // true = success, false = failure
    const [modalMessage, setModalMessage] = useState('');

    const navigation = useNavigation();
    const { userObject } = useSelector(state => state.auth);
    const studentId = userObject?._id;
    const dispatch = useDispatch();

    const { data: enrolledCourses, isLoading: isLoadingEnrolled, error: errorEnrolled } = useEnrolledCourses(studentId);
    const { data: allCourses, isLoading: isLoadingAll, error: errorAll, refetch: refetchAll } = useCourses();

    const [refreshing, setRefreshing] = useState(false);
    const overallLoading = isLoadingEnrolled || isLoadingAll;

    useEffect(() => {
        dispatch(startLoading());
        const timeout = setTimeout(() => {
            if (!overallLoading) {
                dispatch(stopLoading());
            }
        }, 1000);
        return () => clearTimeout(timeout);
    }, [overallLoading]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        dispatch(startLoading());
        await Promise.all([refetchAll()]);
        setTimeout(() => {
            setRefreshing(false);
            dispatch(stopLoading());
        }, 1500);
    }, [refetchAll]);


    const handleAffiliateRequest = async () => {
        try {
            await sendAffiliateRequest(studentId);
            setModalSuccess(true);
            setModalMessage('Affiliate request sent successfully!');
        } catch (error) {
            setModalSuccess(false);
            setModalMessage('Failed to send affiliate request. Please try again.');
        } finally {
            setModalVisible(true);
        }
    };



    // Prepare data for single FlatList
    const flatListData = [];

    if (enrolledCourses?.length > 0) {
        enrolledCourses.forEach(item => {
            flatListData.push({ type: 'purchased', data: item });
        });
    } else if (!isLoadingEnrolled && !errorEnrolled) {
        flatListData.push({ type: 'message', text: 'You have not purchased any courses yet.' });
    }

    if (allCourses?.length > 0) {
        flatListData.push({ type: 'header', title: 'More Courses' });

        for (let i = 0; i < allCourses.length; i += 2) {
            const rowItems = allCourses.slice(i, i + 2);
            flatListData.push({ type: 'gridRow', items: rowItems });
        }
    }

    const renderItem = ({ item }) => {
        switch (item.type) {
            case 'purchased':
                return (
                    <PurchasedCourseCard
                        course={item.data}
                        showplaybtn={false}
                        showUrl={false}
                        onPress={() => {
                            navigation.navigate('CourseEpisodesScreen', {
                                courseId: item.data._id,
                                courseTitle: item.data.title,
                                courseImage: item.data.thumbnail
                            });
                        }}
                    />
                );
            case 'message':
                return (
                    <View style={styles.centered}>
                        <Text style={styles.messageText}>{item.text}</Text>
                    </View>
                );
            case 'header':
                return (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{item.title}</Text>
                    </View>
                );
            case 'gridRow':
                return (
                    <View style={styles.gridRow}>
                        {item.items.map((course, index) => (
                            <View key={course._id || index} style={styles.gridItem}>
                                <CourseCard
                                    id={course._id}
                                    navigation={navigation}
                                    imageSource={{ uri: course.thumbnail }}
                                    title={course.title}
                                    rating={course.averageRating ?? 0}
                                    description={course.description}
                                    profileImage={user}
                                    profileName={course.instructorName}
                                    price={`${course.price} $`}
                                    onPress={() =>
                                        navigation.navigate('CourseDetailScreen', {
                                            courseId: course._id,
                                            courseTitle: course.title
                                        })
                                    }
                                />
                            </View>
                        ))}
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <ImageBackground source={bg} style={styles.container}>
            {modalVisible &&
                <ConfirmationModal
                    visible={modalVisible}
                    title={modalMessage}
                    icon={modalSuccess ? tick : fail} // Add your 'cross' icon
                    onClose={() => setModalVisible(false)}
                />}

            <SafeAreaView style={{ flex: 1 }}>
                <Header title="My Courses" style={{ marginBottom: 35, marginLeft: 20, }} />
                <FlatList
                    ListFooterComponent={() => (
                        <TouchableOpacity style={styles.joinButton} onPress={handleAffiliateRequest}>
                            <Text style={styles.joinButtonText}>Become an Affiliate</Text>
                        </TouchableOpacity>
                    )}
                    data={flatListData}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item?.data?._id || item?.text || item?.title || index.toString()}
                    contentContainerStyle={styles.listContent}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#08131F',
        paddingBottom: height * 0.11,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    centered: {
        alignItems: 'center',
        marginVertical: 20,
    },
    messageText: {
        color: '#ccc',
        fontSize: 14,
    },
    sectionHeader: {
        marginTop: 20,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 17,
        color: theme.textColor,
        fontFamily: 'Inter-SemiBold',
        textAlign: 'center',
        marginBottom: 20,
    },
    gridRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 5,
        // marginBottom: 10,
    },
    gridItem: {
        width: (width - 40) / 2, // Adjust based on padding
    },
    joinButton: {
        backgroundColor: theme.primaryColor,
        width: '100%',
        padding: 12,
        borderRadius: 11,
        marginTop: 20,
        alignItems: 'center',
    },
    joinButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        fontFamily: "Inter-SemiBold",
    },
});

export default PurchasedCoursesScreen;
