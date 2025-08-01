import React, { useContext, useMemo, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground,
    SafeAreaView, Alert, ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { bg, tick, fail, info } from '../../../assets/images';
import Header from '../../../components/Header';
import { ThemeContext } from '../../../context/ThemeProvider';
import { useSubscriptionContext } from '../../../context/SubscriptionProvider';
import ConfirmationModal from '../../../components/ConfirmationModal';

const SubscriptionManagementScreen = () => {
    const { theme } = useContext(ThemeContext);
    const styles = useMemo(() => getStyles(theme), [theme]);
    const navigation = useNavigation();

    const {
        isSubscribed,
        customerInfo,
        activeEntitlements,
        isLoading,
        error,
        restorePurchases,
        refreshSubscriptionStatus
    } = useSubscriptionContext();

    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalIcon, setModalIcon] = useState(null);
    const [isRestoring, setIsRestoring] = useState(false);

    const handleRestorePurchases = async () => {
        try {
            setIsRestoring(true);
            await restorePurchases();
            
            setModalTitle('Purchases Restored');
            setModalMessage('Your previous purchases have been successfully restored.');
            setModalIcon(tick);
            setModalVisible(true);
        } catch (error) {
            console.error('Restore failed:', error);
            setModalTitle('Restore Failed');
            setModalMessage('Failed to restore purchases. Please try again.');
            setModalIcon(fail);
            setModalVisible(true);
        } finally {
            setIsRestoring(false);
        }
    };

    const handleRefreshStatus = async () => {
        try {
            await refreshSubscriptionStatus();
            Alert.alert('Success', 'Subscription status refreshed successfully.');
        } catch (error) {
            Alert.alert('Error', 'Failed to refresh subscription status.');
        }
    };

    const getSubscriptionInfo = () => {
        if (!isSubscribed || !customerInfo) {
            return {
                status: 'Not Subscribed',
                statusColor: '#FF6B6B',
                details: 'You are not currently subscribed to any plan.'
            };
        }

        const activeSubscription = Object.values(activeEntitlements)[0];
        if (!activeSubscription) {
            return {
                status: 'Active Subscription',
                statusColor: '#4ECDC4',
                details: 'You have an active subscription.'
            };
        }

        const expirationDate = new Date(activeSubscription.expirationDate);
        const isExpired = expirationDate < new Date();

        return {
            status: isExpired ? 'Expired' : 'Active',
            statusColor: isExpired ? '#FF6B6B' : '#4ECDC4',
            details: isExpired 
                ? `Your subscription expired on ${expirationDate.toLocaleDateString()}`
                : `Your subscription is active until ${expirationDate.toLocaleDateString()}`
        };
    };

    const subscriptionInfo = getSubscriptionInfo();

    return (
        <>
            {modalVisible && (
                <ConfirmationModal
                    title={modalTitle}
                    description={modalMessage}
                    icon={modalIcon}
                    onClose={() => setModalVisible(false)}
                />
            )}

            <ImageBackground source={theme.bg || bg} style={styles.container}>
                <Header title="Subscription Management" />
                <SafeAreaView>
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        
                        {/* Subscription Status Card */}
                        <View style={styles.statusCard}>
                            <View style={styles.statusHeader}>
                                <Text style={styles.statusTitle}>Subscription Status</Text>
                                <View style={[styles.statusBadge, { backgroundColor: subscriptionInfo.statusColor }]}>
                                    <Text style={styles.statusBadgeText}>{subscriptionInfo.status}</Text>
                                </View>
                            </View>
                            <Text style={[styles.statusDetails, { color: theme.textColor }]}>
                                {subscriptionInfo.details}
                            </Text>
                        </View>

                        {/* Subscription Details */}
                        {isSubscribed && customerInfo && (
                            <View style={styles.detailsCard}>
                                <Text style={[styles.detailsTitle, { color: theme.textColor }]}>
                                    Subscription Details
                                </Text>
                                
                                {Object.entries(activeEntitlements).map(([entitlementId, entitlement]) => (
                                    <View key={entitlementId} style={styles.entitlementItem}>
                                        <Text style={[styles.entitlementName, { color: theme.primaryColor }]}>
                                            {entitlementId}
                                        </Text>
                                        <Text style={[styles.entitlementDetails, { color: theme.textColor }]}>
                                            Product: {entitlement.productIdentifier}
                                        </Text>
                                        {entitlement.expirationDate && (
                                            <Text style={[styles.entitlementDetails, { color: theme.textColor }]}>
                                                Expires: {new Date(entitlement.expirationDate).toLocaleDateString()}
                                            </Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Action Buttons */}
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: theme.primaryColor }]}
                                onPress={handleRestorePurchases}
                                disabled={isRestoring || isLoading}
                            >
                                {isRestoring ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={styles.actionButtonText}>Restore Purchases</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: theme.borderColor }]}
                                onPress={handleRefreshStatus}
                                disabled={isLoading}
                            >
                                <Text style={[styles.actionButtonText, { color: theme.textColor }]}>
                                    Refresh Status
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Info Section */}
                        <View style={styles.infoCard}>
                            <Text style={[styles.infoTitle, { color: theme.textColor }]}>
                                Need Help?
                            </Text>
                            <Text style={[styles.infoText, { color: theme.subTextColor }]}>
                                If you're having issues with your subscription, try restoring your purchases first. 
                                For additional support, contact our customer service team.
                            </Text>
                        </View>

                        {error && (
                            <View style={styles.errorCard}>
                                <Text style={[styles.errorText, { color: '#FF6B6B' }]}>
                                    Error: {error}
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
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 0,
    },
    scrollContent: {
        paddingBottom: 50,
    },
    statusCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.borderColor,
    },
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    statusTitle: {
        color: theme.textColor,
        fontSize: 18,
        fontFamily: 'Outfit-Bold',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Outfit-SemiBold',
    },
    statusDetails: {
        fontSize: 14,
        fontFamily: 'Outfit-Regular',
        lineHeight: 20,
    },
    detailsCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.borderColor,
    },
    detailsTitle: {
        fontSize: 16,
        fontFamily: 'Outfit-Bold',
        marginBottom: 15,
    },
    entitlementItem: {
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme.borderColor,
    },
    entitlementName: {
        fontSize: 14,
        fontFamily: 'Outfit-SemiBold',
        marginBottom: 5,
    },
    entitlementDetails: {
        fontSize: 12,
        fontFamily: 'Outfit-Regular',
        marginBottom: 2,
    },
    actionsContainer: {
        marginBottom: 20,
    },
    actionButton: {
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 10,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Outfit-SemiBold',
    },
    infoCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.borderColor,
    },
    infoTitle: {
        fontSize: 16,
        fontFamily: 'Outfit-Bold',
        marginBottom: 10,
    },
    infoText: {
        fontSize: 14,
        fontFamily: 'Outfit-Regular',
        lineHeight: 20,
    },
    errorCard: {
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderRadius: 15,
        padding: 20,
        borderWidth: 1,
        borderColor: '#FF6B6B',
    },
    errorText: {
        fontSize: 14,
        fontFamily: 'Outfit-Regular',
        textAlign: 'center',
    },
});

export default SubscriptionManagementScreen; 