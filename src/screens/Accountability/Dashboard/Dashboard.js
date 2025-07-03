import React, { useState } from 'react';
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
import { back, bell, bg, user } from '../../../assets/images';
import theme from '../../../themes/theme';
import Accountability from './Accountability/Accountability'
import Journaling from './Journaling/Journaling';
import { useSelector } from 'react-redux';

const Dashboard = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Accountability');

  const name = useSelector(state => state.auth.userObject?.name);
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good Morning! ☀️';
    if (hour < 17) return 'Good Afternoon! 🌤️';
    return 'Good Evening! 🌙';
  };

  return (
    <ImageBackground source={bg} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={user} style={styles.avatar} />
              <View>
                <Text style={styles.username}>{name}</Text>
                <Text style={styles.greeting}>{getTimeBasedGreeting()}</Text>
              </View>
            </View>
            <Image source={bell} style={{ width: 40, height: 40, resizeMode: "contain", alignSelf: 'center' }} />
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={activeTab === 'Accountability' ? styles.activeTab : styles.inactiveTab}
              onPress={() => setActiveTab('Accountability')}
            >
              <Text style={styles.activeTabText}>Accountability</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={activeTab === 'Journaling' ? styles.activeTab : styles.inactiveTab}
              onPress={() => setActiveTab('Journaling')}
            >
              <Text style={styles.activeTabText}>Journaling</Text>
            </TouchableOpacity>
          </View>

          {/* Conditional Rendering */}
          {activeTab === 'Accountability' ? <Accountability navigation={navigation} /> : <Journaling navigation={navigation} />}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // To make space for bottom nav
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    marginVertical: 20,
  },
  avatar: { width: 45, height: 45, borderRadius: 8, marginRight: 10 },
  greeting: { color: theme.primaryColor, fontSize: 12, fontFamily: 'Inter-Regular' },
  username: { color: theme.textColor, fontSize: 12, fontFamily: 'Inter-Medium' },
  notificationIcon: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#2C2C4A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlaceholder: {
    fontSize: 20,
    color: '#FFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 0.9,
    borderColor: theme.borderColor,
    borderRadius: 8,
    padding: 5,
    marginBottom: 20,
  },
  activeTab: {
    flex: 1,
    backgroundColor: 'rgba(29, 172, 255, 0.44)', // Blue for active day
    borderWidth: 0.9,
    borderColor: theme.primaryColor,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTabText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  inactiveTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  inactiveTabText: {
    color: '#A0A0B0',
  },
});

export default Dashboard;