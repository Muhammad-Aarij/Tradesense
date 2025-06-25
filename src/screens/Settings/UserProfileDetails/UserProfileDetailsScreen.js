import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { bg, userProfile, userT } from '../../../assets/images';
import Header from '../../../components/Header';
import GradientStatCard from './GradientStatCard';
import theme from '../../../themes/theme';

const { width, height } = Dimensions.get('window');
const scale = (size) => (width / 375) * size; // assuming 375 is the base width
const verticalScale = (size) => (height / 812) * size; // assuming 812 is the base height

const UserProfileDetailsScreen = () => {
  const userData = {
    name: 'SAM SMITH',
    title: 'Good Day',
    avatar: userProfile,
    totalSessions: '23145',
    totalTime: '4h30m',
    totalCourses: '02',
    daysLearningStreak: 5,
    daysLearningStreakTarget: 10,
    weeksLearningStreak: 2,
    weeksLearningStreakTarget: 10,
  };

  return (
    <ImageBackground source={bg} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Header title="Profile" />

            {/* Profile Card */}
            <View style={styles.profileCard}>
              <View style={styles.avatarWrapper}>
                <Image source={userProfile} style={styles.avatar} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Julie Coyette</Text>
                <Text style={styles.profileSubtitle}>Industry and Development</Text>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <GradientStatCard value={userData.totalSessions} label="Total Points" />
              <GradientStatCard value={userData.totalTime} label="Total Time" />
              <GradientStatCard value={userData.totalCourses} label="Total Courses" />
            </View>

            {/* Streaks */}
            <View style={styles.progressSection}>
              <Text style={styles.progressTitle}>Days Learning Streak</Text>
              <View style={styles.streakCardsRow}>
                <GradientStatCard value={userData.daysLearningStreak} label="Current" />
                <GradientStatCard value={userData.daysLearningStreakTarget} label="Target" />
              </View>
            </View>

            <View style={styles.progressSection}>
              <Text style={styles.progressTitle}>Weeks Learning Streak</Text>
              <View style={styles.streakCardsRow}>
                <GradientStatCard value={userData.weeksLearningStreak} label="Current" />
                <GradientStatCard value={userData.weeksLearningStreakTarget} label="Target" />
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* Fixed Footer Button */}
      <View style={styles.absoluteFooter}>
        <View style={styles.footerWrapper}>
          <TouchableOpacity style={styles.profileButton} onPress={() => console.log('Edit Profile')}>
            <Image source={userT} style={styles.profileButtonIcon} />
            <Text style={styles.profileButtonText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    position: 'relative',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
  scrollContent: {
    paddingBottom: verticalScale(20),
  },
  profileCard: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  avatar: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(105),
    borderWidth: 4,
    borderColor: 'transparent',
    backgroundColor: 'white',
  },
  avatarWrapper: {
    padding: scale(4),
    borderRadius: scale(110),
    borderWidth: 2.5,
    borderColor: theme.primaryColor,
    backgroundColor: 'transparent',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    marginTop: verticalScale(15),
    textAlign: 'center',
    fontSize: scale(16),
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  profileSubtitle: {
    fontSize: scale(14),
    fontFamily: 'Inter-Thin-BETA',
    color: '#C4C7C9',
    marginTop: verticalScale(1),
    marginBottom: verticalScale(10),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(30),
    gap: scale(8),
  },
  progressSection: {
    marginBottom: verticalScale(20),
  },
  progressTitle: {
    fontSize: scale(14),
    color: 'white',
    fontFamily: 'Inter-Medium',
    marginBottom: verticalScale(15),
  },
  streakCardsRow: {
    flexDirection: 'row',
    gap: scale(10),
  },
  absoluteFooter: {
    position: 'absolute',
    bottom: verticalScale(15),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: theme.borderColor, borderWidth: 1,
    borderRadius: scale(102),
    padding: scale(14),
    paddingHorizontal: scale(26),
    justifyContent: 'center',
    flexDirection: 'row',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.primaryColor,
    borderRadius: scale(120),
    padding: scale(7),
    paddingHorizontal: scale(25),
    justifyContent: 'center',
  },
  profileButtonIcon: {
    width: scale(25),
    height: scale(25),
    resizeMode: 'contain',
    marginRight: scale(10),
    tintColor: 'white',
  },
  profileButtonText: {
    fontSize: scale(13),
    color: 'white',
    fontFamily: 'Inter-Medium',
  },
});


export default UserProfileDetailsScreen;
