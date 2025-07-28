import React, { useState, useContext, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ImageBackground,
} from 'react-native';
import { back, bell, bellWhite, bg, user, userDefault } from '../../../assets/images';
import Accountability from './Accountability/Accountability';
import Journaling from './Journaling/Journaling';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../../../context/ThemeProvider';
import { useFocusEffect } from '@react-navigation/native';
import OptimizedImage from '../../../components/OptimizedImage';

const Dashboard = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState('Accountability');
  const name = useSelector(state => state.auth.userObject?.name);
  const { theme, isDarkMode } = useContext(ThemeContext);
  const styles = useMemo(() => getStyles(theme), [theme]);
  const profilePic = useSelector(state => state.auth.userObject?.profilePic);
  useFocusEffect(
    useCallback(() => {
      console.log('====================================');
      console.log("ROUTE", route?.params?.goJournaling);
      console.log('====================================');
      if (route?.params?.goJournaling === true && activeTab !== 'Journaling') {
        console.log("Navigating to Journaling");
        setActiveTab('Journaling');
      }
    }, [route?.params?.goJournaling, activeTab])
  );


  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning! ☀️';
    if (hour < 17) return 'Good Afternoon! 🌤️';
    return 'Good Evening! 🌙';
  };

  return (
    <ImageBackground source={theme.bg} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <OptimizedImage
                uri={profilePic ? `http://13.61.22.84/${profilePic}` : null}
                style={styles.avatar}
                isAvatar={true}
                username={name}
                showInitials={true}
                fallbackSource={userDefault}
                borderRadius={22}
                showLoadingIndicator={false}
                initialsStyle={{
                  backgroundColor: 'rgba(29, 172, 255, 0.15)',
                  borderColor: 'rgba(29, 172, 255, 0.3)',
                  text: {
                    fontSize: 14,
                    color: theme.primaryColor,
                    fontFamily: 'Outfit-Bold',
                  }
                }}
              />
              <View>
                <Text style={styles.username}>{name}</Text>
                <Text style={styles.greeting}>{getTimeBasedGreeting()}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
              <Image source={isDarkMode ? bell : bellWhite} style={styles.bellIcon} />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {['Accountability', 'Journaling'].map(tab => (
              <TouchableOpacity
                key={tab}
                style={activeTab === tab ? styles.activeTab : styles.inactiveTab}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={activeTab === tab ? styles.activeTabText : styles.inactiveTabText}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Content */}
          {activeTab === 'Accountability'
            ? <Accountability navigation={navigation} />
            : <Journaling navigation={navigation} />}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: { flex: 1 },
    scrollViewContent: {
      paddingHorizontal: 20,
      paddingBottom: 100,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: "space-between",
      marginVertical: 20,
    },
    avatar: {
      width: 45,
      height: 45,
      borderRadius: 88,
      marginRight: 10,
    },
    greeting: {
      color: theme.primaryColor,
      fontSize: 12,
      fontFamily: 'Outfit-Regular',
    },
    username: {
      color: theme.textColor,
      fontSize: 12,
      fontFamily: 'Outfit-Medium',
    },
    bellIcon: { width: 35, height: 35, resizeMode: "contain", alignSelf: 'center' },

    tabsContainer: {
      flexDirection: 'row',
      backgroundColor: theme.inputBg || 'rgba(255, 255, 255, 0.06)',
      borderWidth: 0.9,
      borderColor: theme.borderColor,
      borderRadius: 8,
      padding: 5,
      marginBottom: 20,
    },
    activeTab: {
      flex: 1,
      backgroundColor: theme.primaryLight || 'rgba(29, 172, 255, 0.44)',
      borderWidth: 0.9,
      borderColor: theme.primaryColor,
      borderRadius: 8,
      paddingVertical: 10,
      alignItems: 'center',
    },
    inactiveTab: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
    },
    activeTabText: {
      fontSize: 12,
      color: theme.onPrimary || '#FFF',
      fontWeight: 'bold',
    },
    inactiveTabText: {
      fontSize: 12,
      color: theme.subTextColor || '#A0A0B0',
    },
  });

export default Dashboard;
