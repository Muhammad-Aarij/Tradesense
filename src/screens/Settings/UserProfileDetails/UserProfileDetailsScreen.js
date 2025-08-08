import React, { useCallback, useContext, useState } from 'react';
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
import OptimizedImage from '../../../components/OptimizedImage';
import { userProfile, userT, userDefault, info } from '../../../assets/images';
import Header from '../../../components/Header';
import GradientStatCard from './GradientStatCard';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../../../context/ThemeProvider';
import { useAffiliateStats } from '../../../functions/affiliateApi';
import { useHabitStats } from '../../../functions/habbitFunctions';
import ProfileImage from '../../../components/ProfileImage';
import AnimatedInfoBox from '../../../components/AnimatedInfoBox';
const { width, height } = Dimensions.get('window');

const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;

const UserProfileDetailsScreen = () => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const profilePic = useSelector(state => state.auth.userObject?.profilePic);
  const name = useSelector(state => state.auth.userObject?.name);
  const userId = useSelector(state => state.auth.userId);
  const { data: affiliateStats = { enrolled: 0, money: 0, visited: 0 } } = useAffiliateStats(userId);
  const { data: habitStats = { total: 0, completed: 0, pending: 0, streak: 0 } } = useHabitStats(userId);

  // 👇 Change 1: Use state to manage the info box content
  const [infoBoxContent, setInfoBoxContent] = useState({
    title: '',
    message: '',
    isVisible: false
  });

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning! ☀️';
    if (hour < 17) return 'Good Afternoon! 🌤️';
    return 'Good Evening! 🌙';
  };

  // 👇 Change 2: Create a function to open the info box with specific content
  const handleInfoPress = useCallback((title, message) => {
    setInfoBoxContent({
      title,
      message,
      isVisible: true,
    });
  }, []);

  // 👇 Change 3: Create a function to close the info box
  const handleCloseInfoBox = useCallback(() => {
    setInfoBoxContent(prev => ({ ...prev, isVisible: false }));
  }, []);

  return (
    <ImageBackground source={theme.bg} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        {/* 👇 Change 4: Pass the dynamic state to AnimatedInfoBox */}
        <AnimatedInfoBox
          isVisible={infoBoxContent.isVisible}
          onClose={handleCloseInfoBox}
          title={infoBoxContent.title}
          message={infoBoxContent.message}
          position="center"
        />

        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Header title="Profile" />

            {/* Profile Card */}
            <View style={styles.profileCard}>
              <View style={styles.avatarWrapper}>
                <ProfileImage
                  uri={profilePic ? `${profilePic}` : null}
                  name={name}
                  size={55}
                  borderRadius={22}
                  style={styles.avatar}
                  textStyle={{ fontSize: 14, color: theme.primaryColor }}
                />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{name}</Text>
                <Text style={styles.profileSubtitle}>{getTimeBasedGreeting()}</Text>
              </View>
            </View>

            {/* Stats */}
            <View style={{ flexDirection: "row", gap: 15, alignItems: "center", }}>
              <Text style={styles.progressTitle}>Goal Statistics</Text>
              {/* 👇 Change 5: Update onPress handler for Goal Statistics */}
              <TouchableOpacity
                onPress={() => handleInfoPress(
                  'Goal Statistics',
                  'This section tracks your personal habit progress, including total habits, completed tasks, pending items, and your current streak. It helps you stay motivated and monitor your consistency over time.'
                )}
              >
                <Image source={info} style={{ width: 15, height: 15, resizeMode: "contain", tintColor: theme.primaryColor }} />
              </TouchableOpacity>
            </View>
            <View style={styles.statsContainer}>
              <GradientStatCard value={habitStats.streak} label="Streak" />
            </View>
            <View style={styles.statsContainer}>
              <GradientStatCard value={habitStats.total} label="Total" />
              <GradientStatCard value={habitStats.completed} label="Completed" />
              <GradientStatCard value={habitStats.pending} label="Pending" />
            </View>

            <View style={{ flexDirection: "row", gap: 15, alignItems: "center", }}>
              <Text style={styles.progressTitle}>Affiliate Statistics</Text>
              {/* 👇 Change 6: Update onPress handler for Affiliate Statistics */}
              <TouchableOpacity
                onPress={() => handleInfoPress(
                  'Affiliate Statistics',
                  'This section summarizes your affiliate performance, showing how many people visited your referral link, how many enrolled, your total earnings, and your conversion rate. It’s a snapshot of your impact and rewards from sharing the platform.'
                )}
              >
                <Image source={info} style={{ width: 15, height: 15, resizeMode: "contain", tintColor: theme.primaryColor }} />
              </TouchableOpacity>
            </View>
            <View style={styles.statsContainer}>
              <GradientStatCard value={affiliateStats.visited} label="Visits" />
              <GradientStatCard value={affiliateStats.enrolled} label="Enrolled" />
            </View>
            <View style={styles.statsContainer}>
              <GradientStatCard value={`$${affiliateStats.money}`} label="Earnings" />
              <GradientStatCard
                value={
                  affiliateStats.visited
                    ? (affiliateStats.enrolled / affiliateStats.visited).toFixed(2)
                    : 0
                }
                isPercent={true}
                label="Conversion Rate"
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
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
    // borderColor: 'transparent',
    // backgroundColor: 'white',
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
  progressDescr: {
    fontSize: scale(10),
    color: theme.subTextColor,
    fontFamily: 'Outfit-Regular',
    marginBottom: verticalScale(14),
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
