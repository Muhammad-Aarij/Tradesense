import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Image, ImageBackground } from 'react-native';
import { bell, bg, user, searchMf } from '../../assets/images';
import theme from '../../themes/theme';
import GoalContainer from './GoalContainer';
import HabitContainer from './HabitContainer';
const { width, height } = Dimensions.get('window');

const AccountabilityScreen = ({ navigation }) => {
  const watchlistData = [
    { id: 'w1', name: 'Apple Inc.', short: "AAPL", value: '156.40', change: '+1.20%', type: 'increase' },
    { id: 'w2', name: 'Microsoft Co', short: "MSFT", value: '256.01', change: '-0.55%', type: 'decrease' },
    { id: 'w3', name: 'Adobe Inc.', short: "AMZN", value: '3,240.8', change: '+3.10%', type: 'increase' },
    { id: 'w4', name: 'Facebook PR', short: "FB", value: '220.58', change: '+0.10%', type: 'increase' },
  ];

  const renderHeader = () => (
    <View>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={user} style={styles.avatar} />
          <View>
            <Text style={styles.greeting}>Good Evening! 😊</Text>
            <Text style={styles.username}>Alwin Smith</Text>
          </View>
        </View>
        <Image source={bell} style={{ width: 45, height: 45, resizeMode: "contain", alignSelf: 'center' }} />
      </View>

      {/* Balance Section */}
      <View style={styles.balanceSection}>
        <Text style={{ fontSize: 13, color: "gray", fontFamily: "Outfit-Thin-BETA", textTransform: "uppercase", marginBottom: 7 }}>Total Amount</Text>
        <Text style={{ fontSize: 13, color: "black", paddingVertical: 4, paddingHorizontal: 10, borderRadius: 5, fontFamily: "Outfit-Medium", backgroundColor: "#0EEF9E", marginBottom: 15, }}>Demo</Text>
        <Text style={styles.balanceAmount}>€9,968.00</Text>
        <Text style={{ fontSize: 13, color: "white", fontFamily: "Barlow-Regular", marginBottom: 7 }}>
          <Text style={{ color: "#FF4E36" }}>
            0.32%
          </Text>
          (-€32)
        </Text>
      </View>

      {/* Watchlist Header */}
      <View style={[styles.sectionContainer, styles.graybg]}>
        <View style={{ ...styles.sectionHeader, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <Text style={styles.sectionTitle}>Watchlist</Text>
          <TouchableOpacity onPress={() => console.log('Watchlist search')}>
            <View style={{ padding: 12, borderRadius: 100, backgroundColor: 'rgba(255, 255, 255, 0.06)' }}>
              <Image source={searchMf} style={{ width: 24, height: 24, resizeMode: "contain" }} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.watchlistItem}>
      <Image source={{ uri: `https://placehold.co/40x40/555/FFF?text=${item.name.charAt(0)}` }} style={styles.watchlistImage} />
      <View style={styles.watchlistTextContent}>
        <Text style={styles.watchlistItemName}>{item.name}</Text>
        <Text style={styles.watchlistItemShort}>{item.short}</Text>
      </View>
      <Text style={styles.watchlistItemValue}>{item.value}</Text>
      <Text style={[styles.watchlistItemChange, item.type === 'increase' ? styles.positiveChange : styles.negativeChange]}>
        {item.change}
      </Text>
    </View>
  );

  return (
    <ImageBackground source={bg} style={styles.container}>
      <FlatList
        data={watchlistData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={() => (
          <>
            {renderHeader()}
          </>
        )}
        ListFooterComponent={() => (
          <>
            <GoalContainer navigation={navigation} />
            <HabitContainer navigation={navigation} />
          </>
        )}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111317',
    paddingBottom: 88,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 25,
    paddingTop: 35,
  },
  avatar: { width: 45, height: 45, borderRadius: 8, marginRight: 10 },
  greeting: { color: theme.primaryColor, fontSize: 14, fontFamily: 'Outfit-Regular' },
  username: { color: theme.textColor, fontSize: 12, fontFamily: 'Outfit-Medium' },
  balanceSection: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginHorizontal: 20,
    padding: 20,
    marginBottom: 20,
  },
  balanceAmount: {
    fontSize: 44,
    fontFamily: "Outfit-Thin-BETA",
    color: 'white',
    marginBottom: 10,
  },
  sectionContainer: {
    // marginBottom: 10,
    paddingVertical: 10,

  },
  graybg: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  sectionHeader: {
    marginHorizontal: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    color: '#EFEFEF',
  },
  watchlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderRadius: 12,
    paddingVertical: 10,
    // borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 25,
  },
  watchlistImage: {
    width: 44,
    height: 44,
    borderRadius: 50,
    marginRight: 15,
    backgroundColor: '#555',
  },
  watchlistTextContent: {
    flex: 1,
  },
  watchlistItemName: {
    fontSize: 13,
    fontFamily: "Barlow-Thin",
    color: '#E0E0E0',
  },
  watchlistItemValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: "Barlow-Bold",
  },
  watchlistItemChange: {
    fontSize: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 7,
    fontFamily: "Barlow-Bold",
  },
  watchlistItemShort: {
    fontSize: 12,
    marginTop: 5,
    color: '#B8B7B9',
    fontFamily: "Barlow-Bold",
  },
  positiveChange: {
    color: '#66BB6A',
    backgroundColor: "rgba(17, 171, 60, 0.15)"
  },
  negativeChange: {
    color: '#FF6347',
    backgroundColor: "rgba(255, 78, 54, 0.15)"
  },
});

export default AccountabilityScreen;
