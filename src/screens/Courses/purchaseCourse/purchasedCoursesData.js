import React, { useEffect, useState, useCallback, useContext } from 'react';
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
import { bg, fail, tick, user, book } from '../../../assets/images';
import Header from '../../../components/Header';
import PurchasedCourseCard from './PurchaseCourseCard';
import CourseCard from '../courseList/CourseCard';
import { useEnrolledCourses, useCourses } from '../../../functions/handleCourses';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { ThemeContext } from '../../../context/ThemeProvider';

const { height, width } = Dimensions.get('window');

const PurchasedCoursesScreen = () => {
    const { theme } = useContext(ThemeContext); // ✅ Get dynamic theme
    const [modalVisible, setModalVisible] = useState(false);
    const [modalSuccess, setModalSuccess] = useState(null);
    const [modalMessage, setModalMessage] = useState('');

    const navigation = useNavigation();
    const { userObject } = useSelector(state => state.auth);
    const studentId = userObject?._id;
    const dispatch = useDispatch();

    const { data: enrolledCourses, isLoading: isLoadingEnrolled, error: errorEnrolled } = useEnrolledCourses(studentId);
    const { data: allCourses, isLoading: isLoadingAll, error: errorAll, refetch: refetchAll } = useCourses();

    // console.log(studentId);
    // console.log("All ENROLLED COurses", allCourses);
    
    const [refreshing, setRefreshing] = useState(false);
    const overallLoading = isLoadingEnrolled && isLoadingAll;

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


    const formatDuration = (seconds) => {
        if (seconds < 60) return '1 min';
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(seconds / 3600);
        return seconds >= 3600 ? `${hours} hour${hours > 1 ? 's' : ''}` : `${minutes} min`;
    };

    // Prepare flatList data
    const flatListData = [];
    const enrolledIds = new Set(enrolledCourses?.map(course => course._id));
    const nonEnrolledCourses = allCourses?.filter(course => !enrolledIds.has(course._id)) || [];

    if (enrolledCourses?.length > 0) {
        enrolledCourses.forEach(item => {
            flatListData.push({ type: 'purchased', data: item });
        });
    } else if (!isLoadingEnrolled && !errorEnrolled) {
        flatListData.push({ type: 'message', text: 'You have not purchased any courses yet.' });
    }

    if (nonEnrolledCourses.length > 0) {
        flatListData.push({ type: 'header', title: 'More Courses' });
        for (let i = 0; i < nonEnrolledCourses.length; i += 2) {
            const rowItems = nonEnrolledCourses.slice(i, i + 2);
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
                                courseImage: item.data.thumbnail,
                                instructorImage: item.data.instructorImage
                            });
                        }}
                    />
                );
            case 'message':
                return (
                    <View style={styles.emptyStateContainer}>
                        <View style={[styles.emptyStateIconContainer, { backgroundColor: theme.primaryColor + '15' }]}>
                            <Text style={[styles.emptyStateIcon, { color: theme.primaryColor }]}>📚</Text>
                        </View>
                        <Text style={[styles.emptyStateTitle, { color: theme.textColor }]}>No Courses Yet</Text>
                        <Text style={[styles.emptyStateDescription, { color: theme.textColor }]}>
                            Start your learning journey by exploring our amazing courses below and unlock your trading potential!
                        </Text>
                        <TouchableOpacity
                            style={[styles.exploreBButton, { backgroundColor: theme.primaryColor }]}
                            onPress={() => navigation.navigate('OurCoursesScreen')}
                        >
                            <Text style={styles.exploreButtonText}>Explore Courses</Text>
                        </TouchableOpacity>
                    </View>
                );
            case 'header':
                return (
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>{item.title}</Text>
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
                                    // rating={course.averageRating ?? 0}
                                    description={course.description}
                                    instructorImage={course.instructorImage}
                                    duration={formatDuration(course.duration)}
                                    profileName={course.instructorName}
                                    price={`${course.price} $`}
                                    onPress={() =>
                                        navigation.navigate('CourseDetailScreen', {
                                            courseId: course._id,
                                            courseTitle: course.title,
                                            instructorImage: course.instructorImage
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
        <ImageBackground source={theme.bg} style={styles.container}>
            {modalVisible &&
                <ConfirmationModal
                    visible={modalVisible}
                    title={modalMessage}
                    icon={modalSuccess ? tick : fail}
                    onClose={() => setModalVisible(false)}
                />}

            <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                    ListHeaderComponent={() => (
                        <Header title="My Courses" onPress={() => { navigation.navigate("More") }} style={{ marginBottom: 35 }} />
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
        fontSize: 14,
    },
    emptyStateContainer: {
        alignItems: 'center',
        paddingVertical: 0,
        paddingHorizontal: 20,
        marginVertical: 20,
    },
    emptyStateIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyStateIcon: {
        fontSize: 36,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontFamily: 'Outfit-SemiBold',
        textAlign: 'center',
        marginBottom: 12,
    },
    emptyStateDescription: {
        fontSize: 12,
        fontFamily: 'Outfit-Regular',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 25,
        paddingHorizontal: 10,
        opacity: 0.5,
    },
    exploreBButton: {
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    exploreButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
        fontFamily: 'Outfit-SemiBold',
    },
    sectionHeader: {
        marginTop: 20,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 17,
        fontFamily: 'Outfit-SemiBold',
        textAlign: 'center',
        marginBottom: 20,
    },
    gridRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 5,
    },
    gridItem: {
        width: (width - 40) / 2,
    },
    joinButton: {
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
        fontFamily: 'Outfit-SemiBold',
    },
});

export default PurchasedCoursesScreen;
