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
    Image,
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
import { bg, tick, fail, back } from '../../../assets/images';
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
        const fetchAffiliateStatus = async () => {
            try {
                dispatch(startLoading());

                if (!isAffiliate) {
                    const statusData = await getAffiliateRequestStatus(userId);
                    console.log('====================================');
                    console.log('Affiliate request status:', statusData);
                    console.log('====================================');
                    if (!statusData) {
                        setAffiliateRequestStatus(null); // Show request button
                    } else if (statusData.status === 'pending') {
                        setAffiliateRequestStatus('pending'); // Show pending message
                    } else if (statusData.status === 'accepted') {
                        // Fetch latest user details after acceptance
                        const { affiliateCode, isAffiliate: newAffiliateStatus } = await getUserDetails(userId);
                        dispatch(setAffiliateData({ affiliateCode, isAffiliate: newAffiliateStatus }));
                    }
                }

                setCheckedAffiliate(true);
            } catch (err) {
                setModalData({
                    title: 'Error',
                    message: 'Could not check affiliate status',
                    icon: fail,
                });
                setModalVisible(true);

            } finally {
                dispatch(stopLoading());
            }
        };

        fetchAffiliateStatus();
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
            {!isAffiliate &&
                <Header style={{ marginBottom: 35, marginTop: 10, }} />
            }

            {checkedAffiliate ? (
                isAffiliate ? (
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
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: "100%", }}>
                                                <Text style={styles.statValue}>Available Balance</Text>
                                                <Image source={back} style={{ width: 10, height: 10, tintColor: theme.textColor, resizeMode: "contain", transform: [{ rotate: '180deg' }] }} />
                                            </View>
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
                                        <Text style={styles.statValue}>Conversions</Text>
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
                ) : (
                    <View style={styles.noDataContainer}>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            colors={['rgba(17, 103, 177, 0.05)', 'rgba(42, 157, 244, 0.01)', 'transparent']}
                            style={styles.noDataGradientWrapper}
                        >
                            <View style={styles.decorativeCircle1} />
                            <View style={styles.decorativeCircle2} />

                            <View style={styles.noDataContentContainer}>
                                <View style={styles.noDataIconContainer}>
                                    <Text style={styles.noDataIcon}>
                                        {affiliateRequestStatus === 'pending' ? '⏳' : '✨'}
                                    </Text>
                                    <View style={styles.iconGlow} />
                                </View>

                                <Text style={styles.noDataTitle}>
                                    {affiliateRequestStatus === 'pending' ? 'Request Pending' : 'Ready to Earn'}
                                </Text>

                                <Text style={styles.noDataSubtitle}>
                                    {affiliateRequestStatus === 'pending'
                                        ? 'Your request is under review. Please wait for approval.'
                                        : 'Transform your passion into profit, one course at a time'}
                                </Text>

                                <View style={styles.noDataActionContainer}>
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        colors={[theme.primaryColor, theme.primaryColor + '80']}
                                        style={styles.noDataDot}
                                    />
                                    <Text style={styles.noDataMessage}>
                                        {affiliateRequestStatus === 'pending'
                                            ? 'You will be notified once approved to start earning.'
                                            : 'Begin your affiliate journey and watch the magic unfold'}
                                    </Text>
                                </View>

                                {affiliateRequestStatus !== 'pending' && (
                                    <TouchableOpacity style={styles.requestButton} onPress={handleRequestAffiliate}>
                                        <Text style={styles.requestButtonText}>Request Affiliate Access</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </LinearGradient>
                    </View>
                )
            ) : null}



        </ImageBackground>
    );
};

const getStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: '#08131F', padding: 25, paddingTop: 5 },
    listContainer: { paddingBottom: 120, marginBottom: 100 },
    messageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
    messageText: { color: '#FFF', fontSize: 14, fontFamily: 'Outfit-Regular', marginBottom: 20, textAlign: 'center' },
    requestButton: { backgroundColor: theme.primaryColor, paddingVertical: 12, paddingHorizontal: 25, borderRadius: 28 },
    requestButtonText: { color: '#FFF', fontSize: 12, fontFamily: 'Outfit-Regular' },
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
    statLabel: { color: theme.textColor, fontSize: 20, fontFamily: 'Outfit-SemiBold' },
    statValue: { color: theme.subTextColor, fontSize: 10, fontFamily: 'Outfit-Light-BETA' },
    noDataContainer: {
        marginTop: width * 0.3,
        alignSelf: "center",
        overflow: 'hidden',
    },
    noDataGradientWrapper: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden',
    },
    noDataContentContainer: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
        minHeight: 280,
        borderWidth: 2,
        borderColor: theme.borderColor,
    },
    decorativeCircle1: {
        position: 'absolute',
        top: -30,
        right: -30,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        opacity: 0.6,
    },
    decorativeCircle2: {
        position: 'absolute',
        bottom: -40,
        left: -40,
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(147, 51, 234, 0.06)',
        opacity: 0.4,
    },
    noDataIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 20,
        position: 'relative',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        marginVertical: 20,
    },
    iconGlow: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.primaryColor,
        opacity: 0.1,
        zIndex: -1,
    },
    noDataIcon: {
        fontSize: 36,
        zIndex: 1,
    },
    noDataTitle: {
        color: theme.subTextColor,
        fontSize: 18,
        fontFamily: 'Outfit-Bold',
        marginBottom: 10,
        textAlign: 'center',
        letterSpacing: 0.3,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        paddingHorizontal: 8,
    },
    noDataSubtitle: {
        color: theme.subTextColor,
        fontSize: 14,
        fontFamily: 'Outfit-Medium',
        textAlign: 'center',
        opacity: 0.9,
        marginBottom: 24,
        lineHeight: 20,
        paddingHorizontal: 12,
    },
    inspirationalContainer: {

        // marginBottom: 20,
    },
    motivationalBadge: {
        borderRadius: 20,
    },
    motivationalBadgeInner: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 20,
        shadowColor: theme.primaryColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    motivationalText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontFamily: 'Outfit-SemiBold',
        textAlign: 'center',
        letterSpacing: 0.2,
    },
    noDataActionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        marginHorizontal: 4,
        marginBottom: 20,
    },
    noDataDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 12,
        shadowColor: theme.primaryColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 4,
    },
    noDataMessage: {
        color: theme.subTextColor,
        fontSize: 13,
        fontFamily: 'Outfit-Medium',
        textAlign: 'left',
        lineHeight: 19,
        opacity: 0.9,
        flex: 1,
        letterSpacing: 0.1,
    },
});

export default AffiliateCoursesScreen;
