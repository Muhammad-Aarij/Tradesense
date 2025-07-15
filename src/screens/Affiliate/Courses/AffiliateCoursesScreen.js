import React, { useEffect, useState, useContext, useMemo } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Dimensions,
    ImageBackground,
    Text,
    TouchableOpacity,
    Alert,
    Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../../components/Header';
import PurchasedCourseCard from '../../Courses/purchaseCourse/PurchaseCourseCard';
import { useEnrolledCourses } from '../../../functions/handleCourses';
import {
    useAffiliateStats,
    getUserDetails,
    sendAffiliateRequest,
    getAffiliateRequestStatus,
} from '../../../functions/affiliateApi';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { setAffiliateData } from '../../../redux/slice/authSlice';
import { bg, tick, fail } from '../../../assets/images';
import { ThemeContext } from '../../../context/ThemeProvider';
import LinearGradient from 'react-native-linear-gradient';
import DailyBreakdownChart from '../../../components/DailyBreakdownChart';
import ConfirmationModal from '../../../components/ConfirmationModal';

const { width } = Dimensions.get('window');

const AffiliateCoursesScreen = () => {
    const { theme } = useContext(ThemeContext);
    const styles = useMemo(() => getStyles(theme), [theme]);

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { userId, isAffiliate, userObject } = useSelector(state => state.auth);

    const { data: courses, isLoading: coursesLoading } = useEnrolledCourses(userId);
    const { data: affiliateStats, isLoading: statsLoading } = useAffiliateStats(userId);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState({ title: '', message: '', icon: '' });

    const [checkedAffiliate, setCheckedAffiliate] = useState(false);
    const [affiliateRequestStatus, setAffiliateRequestStatus] = useState(null); // 'pending' | 'accepted' | null

    useEffect(() => {
        const fetchInitial = async () => {
            try {
                dispatch(startLoading());

                const statusData = await getAffiliateRequestStatus(userId);
                if (statusData.length > 0) {
                    setAffiliateRequestStatus(statusData[0].status);
                }

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

        fetchInitial();
    }, []);

    const handleRequestAffiliate = async () => {
        try {
            dispatch(startLoading());
            await sendAffiliateRequest(userId);

            setAffiliateRequestStatus('pending'); // Optimistically update UI

            setModalData({
                title: '',
                message: 'Affiliate request sent successfully!',
                icon: tick,
            });
        } catch (error) {
            setModalData({
                title: 'Error ❌',
                message: 'Failed to send affiliate request',
                icon: fail,
            });
        } finally {
            setModalVisible(true);
            dispatch(stopLoading());
        }
    };

    const renderItem = ({ item }) => {
        const { affiliateCode } = userObject || {};
        const deepLinkUrl = `https://radiant-semifreddo-45674c.netlify.app/T365-${item._id}-${affiliateCode}`;

        return (
            <PurchasedCourseCard
                course={{ ...item, type: 'Affiliate', url: deepLinkUrl }}
                onPress={() => console.log(deepLinkUrl)}
            />
        );
    };

    if (coursesLoading || statsLoading) return null;

    return (
        <ImageBackground source={theme.bg || bg} style={styles.container}>
            {modalVisible &&
                <ConfirmationModal
                    visible={modalVisible}
                    title={modalData.title}
                    message={modalData.message}
                    icon={modalData.icon}
                    onClose={() => setModalVisible(false)}
                />
            }

            {checkedAffiliate && isAffiliate ? (
                <FlatList
                    data={courses}
                    ListHeaderComponent={() => (
                        <>
                            <Header title="Affiliated Courses" style={{ marginBottom: 35 }} />
                            <View style={styles.statsContainer}>
                                <Pressable onPress={() => {
                                    navigation.navigate("WithdrawScreen", { totalAmount: affiliateStats?.money });
                                }}>
                                    <LinearGradient
                                        start={{ x: 0, y: 0.95 }}
                                        end={{ x: 1, y: 1 }}
                                        colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                                        style={styles.statCard}
                                    >
                                        <Text style={styles.statLabel}>${affiliateStats?.money?.toFixed(2) || '0.00'}</Text>
                                        <Text style={styles.statValue}>Available Balance</Text>
                                    </LinearGradient>
                                </Pressable>

                                <LinearGradient
                                    start={{ x: 0, y: 0.95 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                                    style={styles.statCard}
                                >
                                    <Text style={styles.statLabel}>
                                        {affiliateStats?.enrolled && affiliateStats?.visited
                                            ? ((affiliateStats.enrolled / affiliateStats.visited) * 100).toFixed(1)
                                            : '0'}%
                                    </Text>
                                    <Text style={styles.statValue}>Conversion Rate</Text>
                                </LinearGradient>

                                <LinearGradient
                                    start={{ x: 0, y: 0.95 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                                    style={styles.statCard}
                                >
                                    <Text style={styles.statLabel}>{affiliateStats?.visited || 0}</Text>
                                    <Text style={styles.statValue}>Views</Text>
                                </LinearGradient>

                                <LinearGradient
                                    start={{ x: 0, y: 0.95 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                                    style={styles.statCard}
                                >
                                    <Text style={styles.statLabel}>{affiliateStats?.enrolled || 0}</Text>
                                    <Text style={styles.statValue}>Clicks</Text>
                                </LinearGradient>
                            </View>

                            <DailyBreakdownChart type='affiliate' />
                        </>
                    )}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            ) : checkedAffiliate && affiliateRequestStatus === 'pending' ? (
                <View style={styles.messageContainer}>
                    <Text style={styles.messageText}>
                        Your affiliate request is pending. Please wait for approval.
                    </Text>
                </View>
            ) : checkedAffiliate && !isAffiliate ? (
                <View style={styles.messageContainer}>
                    <Text style={styles.messageText}>You are not an affiliate yet.</Text>
                    <TouchableOpacity style={styles.requestButton} onPress={handleRequestAffiliate}>
                        <Text style={styles.requestButtonText}>Request Affiliate Access</Text>
                    </TouchableOpacity>
                </View>
            ) : null}
        </ImageBackground>
    );
};

const getStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: '#08131F', padding: 25, paddingTop: 5 },
    listContainer: { paddingBottom: 120, marginBottom: 100 },
    messageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
    messageText: { color: '#FFF', fontSize: 14, fontFamily: 'Inter-Regular', marginBottom: 20, textAlign: 'center' },
    requestButton: { backgroundColor: theme.primaryColor, paddingVertical: 12, paddingHorizontal: 25, borderRadius: 28 },
    requestButtonText: { color: '#FFF', fontSize: 12, fontFamily: 'Inter-Regular' },
    statsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    statCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9,
        borderColor: theme.borderColor,
        borderRadius: 8,
        width: (width - 65) / 2,
        padding: 15,
        marginBottom: 16,
        alignItems: 'flex-start',
    },
    statLabel: { color: theme.textColor, fontSize: 20, fontFamily: 'Inter-SemiBold' },
    statValue: { color: theme.subTextColor, fontSize: 10, fontFamily: 'Inter-Light-BETA' },
});

export default AffiliateCoursesScreen;
