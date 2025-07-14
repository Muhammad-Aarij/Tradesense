import React, { useContext, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  SafeAreaView, Dimensions, ImageBackground, Alert
} from 'react-native';
import axios from 'axios';
import {
  back, bg, camera, userDefault,
  p1, p2, p3, p4, p5, p6, p7, f, p9,
  affiliate1, tick, fail
} from '../../../assets/images';
import { ThemeContext } from '../../../context/ThemeProvider';
import { loginUser, logoutUser, setProfilePic } from '../../../redux/slice/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { API_URL } from '@env';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';

const { width, height } = Dimensions.get('window');
const scale = size => (width / 375) * size;
const verticalScale = size => (height / 812) * size;

const UserProfileMenuScreen = ({ navigation }) => {
  const name = useSelector(state => state.auth.userObject?.name);
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  const [profileImage, setProfileImage] = useState(null);
  const [confirmation, setConfirmation] = useState({ visible: false, success: true, message: '' });
  const userId = useSelector(state => state.auth.userObject?._id); 
  const profilePic = useSelector(state => state.auth.userObject?.profilePic);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning! ☀️';
    if (hour < 17) return 'Good Afternoon! 🌤️';
    return 'Good Evening! 🌙';
  };

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      async (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          console.error('ImagePicker Error:', response.errorMessage);
          Alert.alert('Error', 'Could not open image picker');
          return;
        }

        if (response.assets && response.assets.length > 0) {
          const image = response.assets[0];
          const file = {
            uri: image.uri,
            type: image.type,
            name: image.fileName || 'profile.jpg',
          };
          uploadProfileImage(file);
        }
      }
    );
  };

  const uploadProfileImage = async (image) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.name || 'profile.jpg',
      });

      const res = await axios.post(`${API_URL}/api/file/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('📦 Upload response:', res.data);

      if (res.status === 200 && res.data?.file?.path) {
        const uploadedPath = res.data.file.path;

        // ✅ Send the uploaded path to update the profile
        const updateRes = await axios.post(`${API_URL}/api/auth/profile-pic`, {
          userId,
          profilePic: uploadedPath,
        });

        console.log('✅ Profile picture updated:', updateRes.data);

        // ✅ Dispatch loginUser to refresh Redux state
        dispatch(setProfilePic(uploadedPath));

        // ✅ Set image for UI
        const fullUrl = uploadedPath.startsWith('http')
          ? uploadedPath
          : `${API_URL}/${uploadedPath.replace(/\\/g, '/')}`;

        setProfileImage(fullUrl);
        setConfirmation({
          visible: true,
          success: true,
          message: 'Profile picture uploaded and saved successfully!',
        });
      } else {
        console.warn('⚠️ Unexpected upload response:', res.data);
        throw new Error('Upload failed: Invalid response');
      }
    } catch (err) {
      console.log('Full error:', err.response?.data || err.message);
      setConfirmation({
        visible: true,
        success: false,
        message: 'Failed to upload profile picture. Please try again.',
      });
    }
  };


  const MenuItem = ({ icon, text, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <LinearGradient
        start={{ x: 0.0, y: 0.95 }}
        end={{ x: 1.0, y: 1.0 }}
        colors={['rgba(0, 0, 0, 0.04)', 'rgba(255, 255, 255, 0)']}
        style={styles.menuItemContent}
      >
        <Image source={icon} style={styles.menuIcon} />
        <Text style={styles.menuText}>{text}</Text>
      </LinearGradient>
      <Image source={back} style={styles.chevronIcon} />
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={theme.bg} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <ConfirmationModal
          isVisible={confirmation.visible}
          icon={confirmation.success ? tick : fail}
          title={confirmation.success ? 'Success' : 'Failed'}
          message={confirmation.message}
          onClose={() => setConfirmation({ ...confirmation, visible: false })}
        />

        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.profileCard}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={profilePic ? { uri: `http://13.61.22.84/${profilePic}` } : userDefault}
                  style={styles.avatar}
                />
                <TouchableOpacity onPress={openGallery} style={styles.cameraIconWrapper}>
                  <Image source={camera} style={styles.cameraIcon} />
                </TouchableOpacity>
              </View>
              <Text style={styles.profileName}>{name}</Text>
              <Text style={styles.profileSubtitle}>{getTimeBasedGreeting()}</Text>
            </View>

            <View style={styles.menuItemsContainer}>
              <MenuItem icon={p1} text="Profile" onPress={() => navigation.navigate('Menu', { screen: 'UserProfileDetails' })} />
              <MenuItem icon={p2} text="Subscriptions Plans" onPress={() => navigation.navigate('Menu', { screen: 'AppSubscription' })} />
              <MenuItem icon={f} text="Courses" onPress={() => navigation.navigate('Courses')} />
              <MenuItem icon={affiliate1} text="Affiliate" onPress={() => navigation.navigate('Affiliate')} />
              <MenuItem icon={p3} text="Account Settings" onPress={() => navigation.navigate('Menu', { screen: 'AccountSecurity' })} />
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

const getStyles = (theme) => StyleSheet.create({
  background: { flex: 1, paddingTop: 50 },
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
    color: theme.textColor,
  },
  profileSubtitle: {
    fontSize: scale(14),
    fontFamily: "Inter-Regular",
    color: theme.subTextColor,
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
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: theme.borderColor,
    borderRadius: scale(8),
  },
  menuItemContent: {
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(15),
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: scale(25),
    height: scale(25),
    tintColor: theme.primaryColor,
    resizeMode: 'contain',
    marginRight: scale(20),
  },
  menuText: {
    fontSize: scale(13),
    fontFamily: "Inter-Regular",
    color: theme.textColor,
  },
  chevronIcon: {
    marginRight: scale(15),
    width: scale(15),
    height: scale(15),
    tintColor: theme.bw,
    resizeMode: 'contain',
    transform: [{ rotate: '180deg' }],
  },
});

export default UserProfileMenuScreen;
