import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  SafeAreaView, Dimensions, ImageBackground
} from 'react-native';
import axios from 'axios';
import {
  back, bg, camera, p1, p2, p3, p4, p5, p6, p7, f, p9, userDefault,
  affiliate1, tick, fail
} from '../../../assets/images';
import theme from '../../../themes/theme';
import { logoutUser } from '../../../redux/slice/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import UploadModal from '../../../components/ConfirmationModal copy';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { API_URL } from "@env";

const { width, height } = Dimensions.get('window');
const scale = size => (width / 375) * size;
const verticalScale = size => (height / 812) * size;

const UserProfileMenuScreen = ({ navigation }) => {
  const name = useSelector(state => state.auth.userObject?.name);
  const userId = useSelector(state => state.auth.userObject?._id);
  const dispatch = useDispatch();

  const [profileImage, setProfileImage] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [confirmation, setConfirmation] = useState({ visible: false, success: true, message: '' });

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning! ☀️';
    if (hour < 17) return 'Good Afternoon! 🌤️';
    return 'Good Evening! 🌙';
  };

  const uploadProfileImage = async (image) => {
    try {
      setProfileImage(image.uri);
      const formData = {
        userId,
        profilePic: image.uri
      };

      const res = await axios.post(`${API_URL}/api/auth/profile-pic`, formData);

      if (res.status === 200) {
        setConfirmation({
          visible: true,
          success: true,
          message: 'Profile picture uploaded successfully!'
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      setConfirmation({
        visible: true,
        success: false,
        message: 'Failed to upload profile picture. Please try again.'
      });
    }
  };

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
    <ImageBackground source={bg} style={{ flex: 1, paddingTop: 50 }}>
      <SafeAreaView style={styles.safeArea}>
        <UploadModal
          isVisible={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onImagePicked={(image) => {
            if (image) uploadProfileImage(image);
          }}
        />

        <ConfirmationModal
          isVisible={confirmation.visible}
          icon={confirmation.success ? tick : fail}
          title={confirmation.success ? "Success" : "Failed"}
          message={confirmation.message}
          onClose={() => setConfirmation({ ...confirmation, visible: false })}
        />

        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.profileCard}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={profileImage ? { uri: profileImage } : userDefault}
                  style={styles.avatar}
                />
                <TouchableOpacity onPress={() => setShowUploadModal(true)} style={styles.cameraIconWrapper}>
                  <Image source={camera} style={styles.cameraIcon} />
                </TouchableOpacity>
              </View>
              <Text style={styles.profileName}>{name}</Text>
              <Text style={styles.profileSubtitle}>{getTimeBasedGreeting()}</Text>
            </View>

            <View style={styles.menuItemsContainer}>
              <MenuItem icon={p1} text="Profile" onPress={() => navigation.navigate('Menu', { screen: 'UserProfileDetails' })} />
              <MenuItem icon={p2} text="Subscriptions Plans" />
              <MenuItem icon={f} text="Courses" onPress={() => navigation.navigate('Courses')} />
              <MenuItem icon={affiliate1} text="Affiliate" onPress={() => navigation.navigate('Affiliate')} />
              <MenuItem icon={p3} text="Account Security" onPress={() => navigation.navigate('Menu', { screen: 'AccountSecurity' })} />
              <MenuItem icon={p4} text="Help Center" onPress={() => navigation.navigate('Menu', { screen: 'HelpCenter' })} />
              <MenuItem icon={p5} text="Report a Problem" onPress={() => navigation.navigate('Menu', { screen: 'ReportProblem' })} />
              <MenuItem icon={p6} text="About" onPress={() => navigation.navigate('Menu', { screen: 'About' })} />
              <MenuItem icon={p7} text="Terms and Conditions" onPress={() => navigation.navigate('Menu', { screen: 'TermsAndConditions' })} />
              <MenuItem icon={p9} text="Logout" onPress={() => dispatch(logoutUser())} />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    marginBottom: verticalScale(85),
    paddingHorizontal: scale(25),
  },
  scrollContent: { paddingBottom: verticalScale(100) },
  profileCard: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  avatarWrapper: {
    padding: scale(4),
    borderRadius: scale(110),
    borderWidth: 2.5,
    borderColor: theme.primaryColor,
    backgroundColor: 'transparent',
    position: 'relative',
    shadowColor: theme.primaryColor,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 15, 
  },
  avatar: {
    width: scale(100),
    height: scale(100),
    resizeMode: "cover",
    borderRadius: scale(105),
    borderWidth: scale(4),
    borderColor: 'transparent',
    backgroundColor: 'white',
  },
  cameraIconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.primaryColor,
    borderRadius: 50,
    padding: scale(6),
  },
  cameraIcon: {
    width: scale(16),
    height: scale(16),
    tintColor: "white",
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
    rowGap: verticalScale(10),
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
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: scale(25),
    height: scale(25),
    tintColor: theme.primaryColor,
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
