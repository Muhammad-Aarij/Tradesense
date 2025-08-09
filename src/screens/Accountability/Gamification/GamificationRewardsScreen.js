
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, ImageBackground, SafeAreaView, Dimensions } from 'react-native';
import { bell, bg } from '../../../assets/images';
import theme from '../../../themes/theme';
const { width, height } = Dimensions.get('window');

const GamificationRewardsScreen = ({ navigation }) => {
    // Mock data for rewards/badges
    const rewards = [
        {
            id: 'r1',
            title: 'Starter',
            description: '/7 days streak',
            icon: '🔥', // Flame icon for streaks
            type: 'streak',
            status: 'claim', // or 'locked'
        },
        {
            id: 'r2',
            title: 'Consistency King',
            description: '/daily habits completed',
            icon: '👑', // Crown icon for consistency
            type: 'consistency',
            status: 'locked',
        },
        {
            id: 'r3',
            title: 'Steak Master', // typo from image, assuming 'Streak Master'
            description: '/30 days streak',
            icon: '🔥',
            type: 'streak',
            status: 'locked',
        },
        {
            id: 'r4',
            title: 'Consistency King',
            description: '/daily habits completed',
            icon: '👑',
            type: 'consistency',
            status: 'locked',
        },
        {
            id: 'r5',
            title: 'Starter',
            description: '/7 days streak',
            icon: '🔥',
            type: 'streak',
            status: 'unlocked',
        },
        {
            id: 'r6',
            title: 'Steak Master', // typo from image
            description: '/30 days streak',
            icon: '🔥',
            type: 'streak',
            status: 'locked',
        },
        {
            id: 'r7',
            title: 'Consistency King',
            description: '/daily habits completed',
            icon: '👑',
            type: 'consistency',
            status: 'locked',
        },
        {
            id: 'r8',
            title: 'Consistency King',
            description: '/daily habits completed',
            icon: '👑',
            type: 'consistency',
            status: 'Unlocked',
        },
    ];

    return (
        <ImageBackground source={bg} style={styles.container}>
            {/* Header */}
            <SafeAreaView>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Gamification & Rewards</Text>
                    <TouchableOpacity onPress={() => console.log('Notification icon pressed')} style={styles.notificationButton}>
                        <Image source={bell} style={{ width: 45, height: 45, resizeMode: "contain" }} />
                    </TouchableOpacity>
                </View>

                {/* Rewards List */}
                <ScrollView contentContainerStyle={styles.rewardsListContent} showsVerticalScrollIndicator={false}>
                    {rewards.map((reward) => (
                        <View key={reward.id} style={styles.rewardItem}>
                            <View style={styles.rewardIconContainer}>
                                <Text style={styles.rewardIcon}>{reward.icon}</Text>
                            </View>
                            <View style={styles.rewardInfo}>
                                <Text style={styles.rewardTitle}>{reward.title}</Text>
                                <Text style={styles.rewardDescription}>{reward.description}</Text>
                            </View>
                            <View style={[styles.rewardStatusBadge, reward.status === 'unlocked' ? styles.unlockedBadge : styles.lockedBadge]}>
                                <Text
                                    style={[
                                        styles.rewardStatusText,
                                        {
                                            color:
                                                reward.status === 'unlocked'
                                                    ? '#70C2E8'
                                                    : reward.status === 'claim'
                                                        ? '#29B422'
                                                        : 'white',
                                        },
                                    ]}
                                >
                                    {reward.status === 'unlocked' ? 'Unlocked' : reward.status === 'claim' ? 'Claim' : 'Locked'}
                                </Text>

                            </View>
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111317', // Overall dark background
        paddingTop: Platform.OS === 'ios' ? 0 : 20,
        paddingBottom: height * 0.2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        paddingRight: 15,
    },
    backIcon: {
        fontSize: 24,
        color: '#E0E0E0',
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 18,
        color: theme.textColor,
        fontFamily: 'Outfit-SemiBold',
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
    },
    notificationButton: {
        paddingLeft: 15,
    },
    notificationIcon: {
        fontSize: 24,
        color: '#E0E0E0',
    },
    rewardsListContent: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        paddingBottom: 20, // Space at the bottom
    },
    rewardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 1.3, borderColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 8,
        paddingVertical: 9,
        paddingHorizontal: 9,
        paddingRight: 14,
        marginBottom: 10,
    },
    rewardIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    rewardIcon: {
        fontSize: 24,
        color: '#FFD700', // Gold color for icons
    },
    rewardInfo: {
        flex: 1,
    },
    rewardTitle: {
        fontSize: 14.5,
        fontFamily: "Outfit-Regular",
        color: '#E0E0E0',
        marginBottom: 2,
    },
    rewardDescription: {
        fontFamily: "Outfit-Light",
        fontSize: 10,
        color: '#B0B0B0',
    },
    rewardStatusBadge: {
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 12,
    },
    rewardStatusText: {
        fontSize: 12,
        fontFamily: 'Outfit-Regular',
        color: '#FFFFFF',
    },
});

export default GamificationRewardsScreen;

