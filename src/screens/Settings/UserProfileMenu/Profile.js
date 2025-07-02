import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Dimensions, ImageBackground } from 'react-native';
import { back, bg, p1, p2, p3, p4, p5, p6, p7, p8, p9, userProfile } from '../../../assets/images';
import Header from '../../../components/Header';
import theme from '../../../themes/theme';
import { logoutUser } from '../../../redux/slice/authSlice';
import { useDispatch } from 'react-redux';
const { width, height } = Dimensions.get('window');
const scale = size => (width / 375) * size;      // base width: 375
const verticalScale = size => (height / 812) * size; // base height: 812

const UserProfileMenuScreen = ({ navigation }) => {
  // const mockNavigation = {
  //   // navigate: (screenName, params) => console.log(`Navigating to: ${screenName}`, params),
  //   goBack: () => console.log('Going back'),
  // };
  // const currentNavigation = navigation || mockNavigation;
  const dispatch = useDispatch();
  const MenuItem = ({ icon, text, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemContent}>
        <Image source={icon} style={styles.menuIcon} />
        <Text style={styles.menuText}>{text}</Text>
      </View>
      <Image source={back} style={styles.chevronIcon} />
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={bg} style={{ flex: 1, }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Header />
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

            {/* Menu Items */}
            <View style={styles.menuItemsContainer}>
              <MenuItem icon={p1} text="Profile" onPress={() => navigation.navigate('UserProfileDetails')} />
              <MenuItem icon={p2} text="Courses"  onPress={() => navigation.navigate('Courses')} />
              <MenuItem icon={p2} text="Affiliate"  onPress={() => navigation.navigate('Affiliate')} />
              <MenuItem icon={p2} text="Subscriptions Plans"  />
              <MenuItem icon={p3} text="Account Security" onPress={() => navigation.navigate('Menu', { screen: 'AccountSecurity' })} />
              <MenuItem icon={p4} text="Help Center" onPress={() => navigation.navigate('Menu', { screen: 'HelpCenter' })} />
              <MenuItem icon={p5} text="Report a Problem" onPress={() => navigation.navigate('Menu', { screen: 'ReportProblem' })} />
              <MenuItem icon={p6} text="About" onPress={() => navigation.navigate('Menu', { screen: 'About' })} />
              <MenuItem icon={p7} text="Terms and Conditions" onPress={() => navigation.navigate('Menu', { screen: 'TermsAndConditions' })} />
              {/* <MenuItem icon={p8} text="Privacy Policy" onPress={() => navigation.navigate('Menu', { screen: 'About' })} /> */}
              <MenuItem icon={p9} text="Logout" onPress={() => dispatch(logoutUser())} /> 
            </View>
 
          </ScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>

  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginBottom: verticalScale(85),
    paddingHorizontal: scale(25),
  },
  scrollContent: {
    paddingBottom: verticalScale(100),
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
    borderWidth: scale(4),
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
    textAlign: "center",
    fontSize: scale(16),
    fontFamily: "Inter-Medium",
    color: "#FFFFFF",
  },
  profileSubtitle: {
    fontSize: scale(14),
    fontFamily: "Inter-Thin-BETA",
    color: "#C4C7C9",
    marginTop: verticalScale(1),
    marginBottom: verticalScale(10),
  },
  menuItemsContainer: {
    marginBottom: verticalScale(20),
    rowGap: verticalScale(10), // better than `gap` for RN
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(15),
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: theme.borderColor,
    borderRadius: scale(8),
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: scale(25),
    height: scale(25),
    resizeMode: 'contain',
    marginRight: scale(10),
  },
  menuText: {
    fontSize: scale(13.6),
    fontFamily: "Inter-Regular",
    color: "#FFFFFF",
  },
  chevronIcon: {
    width: scale(15),
    height: scale(15),
    resizeMode: 'contain',
    transform: [{ rotate: '180deg' }],
  },
});


export default UserProfileMenuScreen;