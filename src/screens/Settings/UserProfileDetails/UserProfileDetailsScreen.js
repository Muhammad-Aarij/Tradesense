import React, { useContext } from 'react';
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
import { userProfile, userT, userDefault } from '../../../assets/images';
import Header from '../../../components/Header';
import GradientStatCard from './GradientStatCard';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../../../context/ThemeProvider'; // ✅ Correct theme context
import { useAffiliateStats } from '../../../functions/affiliateApi';
import { useHabitStats } from '../../../functions/habbitFunctions';
const { width, height } = Dimensions.get('window');

const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;

const UserProfileDetailsScreen = () => {
  const { theme } = useContext(ThemeContext); // ✅ use dynamic theme
  const styles = getStyles(theme);
  const profilePic = useSelector(state => state.auth.userObject?.profilePic);
  const name = useSelector(state => state.auth.userObject?.name);
  const userId = useSelector(state => state.auth.userId);
  const { data: affiliateStats = { enrolled: 0, money: 0, visited: 0 } } = useAffiliateStats(userId);
  const { data: habitStats = { total: 0, completed: 0, pending: 0, streak: 0 } } = useHabitStats(userId);


  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning! ☀️';
    if (hour < 17) return 'Good Afternoon! 🌤️';
    return 'Good Evening! 🌙';
  };

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
    <ImageBackground source={theme.bg} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Header title="Profile" />

            {/* Profile Card */}
            <View style={styles.profileCard}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={profilePic ? { uri: `http://13.61.22.84/${profilePic}` } : userDefault}
                  style={styles.avatar}
                />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{name}</Text>
                <Text style={styles.profileSubtitle}>{getTimeBasedGreeting()}</Text>
              </View>
            </View>

            {/* Stats */}
            {/* <View style={styles.statsContainer}>
              <GradientStatCard value={userData.totalSessions} label="Total Streaks" />
              <GradientStatCard value={userData.totalTime} label="Total Time Spend" />
            </View> */}

            <Text style={styles.progressTitle}>Goal Statistics</Text>
            <View style={styles.statsContainer}>
              <GradientStatCard value={habitStats.streak} label="Streak" />
            </View>
            <View style={styles.statsContainer}>
              <GradientStatCard value={habitStats.total} label="Total" />
              <GradientStatCard value={habitStats.completed} label="Completed" />
              <GradientStatCard value={habitStats.pending} label="Pending" />
            </View>


            <Text style={styles.progressTitle}>Affiliate Statistics</Text>
            <View style={styles.statsContainer}>
              <GradientStatCard value={affiliateStats.visited} label="Visits" />
              <GradientStatCard value={affiliateStats.enrolled} label="Enrolled" />
            </View>
            <View style={styles.statsContainer}>
              <GradientStatCard value={`$${affiliateStats.money}`} label="Earnings" />
              <GradientStatCard
                value={
                  affiliateStats.visited
                    ? affiliateStats.enrolled / affiliateStats.visited
                    : 0
                }
                label="Conversion Rate"
              />
            </View>

          </ScrollView>
        </View>
      </SafeAreaView>

      {/* Fixed Footer Button */}
      {/* <View style={styles.absoluteFooter}>
        <View style={styles.footerWrapper}>
          <TouchableOpacity style={styles.profileButton} onPress={() => console.log('Edit Profile')}>
            <Image source={userT} style={styles.profileButtonIcon} />
            <Text style={styles.profileButtonText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View> */}
    </ImageBackground>
  );
};

const getStyles = (theme) => StyleSheet.create({
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
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: 'white',
  },
  avatarWrapper: {
    padding: scale(4),
    borderRadius: scale(110),
    borderWidth: 1.5,
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
    fontFamily: 'Outfit-Medium',
    color: theme.textColor, // ✅ dynamic
  },
  profileSubtitle: {
    fontSize: scale(14),
    fontFamily: 'Outfit-Thin-BETA',
    color: theme.subTextColor ?? '#C4C7C9',
    marginTop: verticalScale(1),
    marginBottom: verticalScale(10),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(10),
    gap: scale(8),
  },
  progressSection: {
    marginBottom: verticalScale(20),
  },
  progressTitle: {
    fontSize: scale(12),
    color: theme.textColor,
    fontFamily: 'Outfit-Medium',
    marginVertical: verticalScale(10),
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
    borderColor: theme.borderColor,
    borderWidth: 1,
    borderRadius: scale(102),
    padding: scale(12),
    paddingHorizontal: scale(20),
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
    fontFamily: 'Outfit-Medium',
  },
});

export default UserProfileDetailsScreen;
