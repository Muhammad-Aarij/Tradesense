import React, { useContext, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ImageBackground, Pressable, SafeAreaView, FlatList, Dimensions
} from 'react-native';
import {
  user, video, graph, bg, bell,
  book, userDefault, care, circle, wave, back
} from '../../assets/images';
import { ThemeContext } from '../../context/ThemeProvider';
import { useAllPillars } from '../../functions/PillarsFunctions';
import { startLoading, stopLoading } from '../../redux/slice/loaderSlice';
import { useDispatch, useSelector } from 'react-redux';
import TopBreakdownChart from '../../components/TopBreakdownChart';
import { useHome } from '../../functions/homeApi';
import moment from 'moment';
const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { data: pillars, isLoading, error } = useAllPillars();
  const [selectedFilter, setSelectedFilter] = useState('Daily');
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const filterOptions = ['Daily', 'Monthly', 'Yearly'];

  const userId = useSelector(state => state.auth.userObject?._id);
  const name = useSelector(state => state.auth.userObject?.name);
  const { data: homeData } = useHome(userId);
  const logs = homeData?.logs || [];

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning! ☀️';
    if (hour < 17) return 'Good Afternoon! 🌤️';
    return 'Good Evening! 🌙';
  };

  const isDayCompleted = (dayIndex) => {
    const today = moment();
    const startOfWeek = today.clone().startOf('week');
    const dayDate = startOfWeek.clone().add(dayIndex, 'days').format('YYYY-MM-DD');
    return logs.some(log => moment(log.date).format('YYYY-MM-DD') === dayDate);
  };

  useEffect(() => {
    dispatch(startLoading());
    const timeout = setTimeout(() => {
      if (!isLoading) dispatch(stopLoading());
    }, 2000);
    return () => clearTimeout(timeout);
  }, [isLoading]);

  if (!homeData) return null;

  return (
    <ImageBackground source={theme.bg} style={styles.container1}>
      <SafeAreaView>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
          <View style={styles.header}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={userDefault} style={styles.avatar} />
              <View>
                <Text style={styles.username}>{name}</Text>
                <Text style={styles.greeting}>{getTimeBasedGreeting()}</Text>
              </View>
            </View>
            <Image source={bell} style={{ width: 45, height: 45, resizeMode: "contain", alignSelf: 'center' }} />
          </View>

          <View style={{ flexDirection: "row", width: "100%", gap: 10 }}>
            <View style={{ flexDirection: "column", width: "47%", height: "100%" }}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mindfulness & Motivation</Text>
                {homeData.audio?.thumbnail && (
                  <TouchableOpacity
                    onPress={() => {
                      const audio = homeData?.audio;
                      if (audio) {
                        navigation.navigate('TrackPlayer', {
                          AudioTitle: audio.title,
                          AudioDescr: audio.description,
                          Thumbnail: audio.thumbnail,
                          AudioUrl: audio.url,
                          shouldFetchTrack: false,
                        });
                      }
                    }}
                    style={styles.card}
                  >
                    <Image source={{ uri: homeData?.audio?.thumbnail }} style={{ ...styles.cardImage, resizeMode: "cover" }} />
                    <Text style={styles.playButtonText}>{homeData?.audio?.title}</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={{ ...styles.section, flex: 1 }}>
                <Text style={styles.sectionTitle}>Personalized Affirmations</Text>
                {homeData.video?.thumbnail && (
                  <TouchableOpacity
                    onPress={() => {
                      const video = homeData?.video;
                      if (video) {
                        navigation.navigate('VideoPlayer', {
                          VideoTitle: video.title,
                          VideoDescr: video.description,
                          Thumbnail: video.thumbnail,
                          VideoUrl: video.url,
                        });
                      }
                    }}
                    style={{ flex: 1 }} // Allow TouchableOpacity to fill height
                  >
                    <Image
                      source={{ uri: homeData?.video?.thumbnail }}
                      style={{
                        flex: 1, // Fill height of parent
                        width: "100%",
                        resizeMode: "cover",
                        borderRadius: 5,
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>

            </View>

            <View style={{ flexDirection: "column", width: "50%" }}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Accountability</Text>
                <View style={styles.goalProgress}>
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <View key={index} style={styles.dayContainer}>
                      <Text style={styles.weekdays}>{day}</Text>
                      <Text style={{
                        ...styles.weekDots,
                        color: isDayCompleted(index) ? '#70C2E8' : '#AAA'
                      }}>●</Text>
                    </View>
                  ))}
                </View>
                <Text style={{ ...styles.playButtonText, textAlign: "center" }}>Daily Goal Progress</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Trading Journal</Text>
                <View style={styles.card}>
                  <Image source={graph} style={styles.cardImage} />
                  <Text style={{ ...styles.playButtonText, textAlign: "center" }}>Track Your Trades</Text>
                </View>
              </View>

              <View style={{ ...styles.section, flexDirection: "row" }}>
                <Text style={styles.sectionTitle2}>
                  <Image source={circle} style={{ width: 20, height: 15, resizeMode: "contain",marginRight:5, }} />
                  {homeData?.quotation || "I execute trades with discipline and confidence."}</Text>
              </View>
            </View>
          </View>

          <View style={styles.dailyBreakdownContainer}>
            <View style={styles.dailyBreakdownHeader}>
              <View>
                <Text style={styles.dailyBreakdownTitle}>Daily Breakdown</Text>
                <Text style={styles.dailyBreakdownDate}>{moment().format('MMMM D, YYYY')}</Text>
              </View>
              <View style={{ position: "relative" }}>
                <TouchableOpacity
                  style={styles.dropdownContainer}
                  onPress={() => setFilterDropdownVisible(!filterDropdownVisible)}
                >
                  <Text style={styles.dailyBreakdownFilter}>{selectedFilter}</Text>
                  <Image
                    source={back}
                    style={{
                      ...styles.dropdownArrow,
                      transform: [{ rotate: filterDropdownVisible ? '90deg' : '-90deg' }]
                    }}
                  />
                </TouchableOpacity>

                {filterDropdownVisible && (
                  <View style={styles.dropdownOptions}>
                    {filterOptions.map((option) => (
                      <TouchableOpacity key={option} style={styles.optionItem} onPress={() => {
                        setSelectedFilter(option);
                        setFilterDropdownVisible(false);
                      }}>
                        <Text style={styles.optionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
            <TopBreakdownChart />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};



const getStyles = (theme) => StyleSheet.create({
  container1: { flex: 1, alignItems: 'center', paddingTop: 20, paddingBottom: height * 0.1, },
  container: { flex: 1, padding: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    marginBottom: 20,
  },
  avatar: { width: 45, height: 45, borderRadius: 8, marginRight: 10 },
  greeting: { color: theme.primaryColor, fontSize: 14, fontFamily: 'Inter-Regular' },
  username: { color: theme.textColor, fontSize: 12, fontFamily: 'Inter-Medium' },
  section: {
    marginBottom: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: theme.borderColor,
    borderRadius: 10,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  sectionTitle: {
    color: "#C4C7C9",
    fontSize: 13,
    fontFamily: 'Inter-Light-BETA',
    marginBottom: 5,
  },
  sectionTitle2: {
    flexDirection:"row",
    gap:5,
    color: "#C4C7C9",
    fontSize: 12,
    fontFamily: 'Inter-Light-BETA',
    marginBottom: 1,
  },
  card: {},
  cardImage: { width: '100%', height: 90, resizeMode: 'contain',borderRadius:5, },
  playButtonText: {
    // textAlign: "center",
    color: "#B3B9BC",
    fontSize: 13,
    marginTop: 10,
    fontFamily: 'Inter-Light-BETA',
  },
  smallhd: {
    color: theme.textColor,
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    marginTop: 5,
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%",
    justifyContent: "space-between",
  },
  weekdays: { color: '#fff', fontSize: 14, fontFamily: 'Inter-Regular' },
  weekDots: { color: '#70C2E8', fontSize: 18 },
  pillars: {
    flexDirection: "row",
    width: (width - 72 - 10) / 2,
    borderWidth: 1,
    borderColor: theme.borderColor,
    borderRadius: 10,
    padding: 8,
    paddingHorizontal: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 8,
  },
  pillarIcon: { width: 25, height: 25, resizeMode: "contain", marginRight: 9 },
  graphImage: { width: '100%', height: 120, resizeMode: 'contain' },
  graphPlaceholder: {
    height: 100,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dailyBreakdownContainer: {
    backgroundColor: '#1C2B3A',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 0.9, borderColor: theme.borderColor,
    borderRadius: 8,
  },
  dailyBreakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    marginBottom: 20,
  },
  dailyBreakdownTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
  },
  dailyBreakdownDate: {
    color: '#AAAAAA',
    fontSize: 12,
    fontFamily: "Inter-Light-BETA",
  },
  dailyBreakdownFilter: {
    // backgroundColor: 'rgba(255, 255, 255, 0.06)',
    // borderWidth: 0.9, borderColor: theme.borderColor,
    borderRadius: 8,
    // paddingVertical: 7,
    paddingHorizontal: 8,
    color: '#FFF',
    fontSize: 12,
    fontFamily: "Inter-Medium",
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end', // Bars should start from bottom
    height: 100, // Fixed height for chart area
    marginBottom: 20,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 0.9,
    borderColor: theme.borderColor,
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },

  dropdownOptions: {
    position: "absolute",
    top: 35,
    left: 0,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.86)",
    borderRadius: 8,
    paddingVertical: 10,
    zIndex: 10,
  },

  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },

  optionText: {
    color: theme.darkBlue,
    fontSize: 12,
    fontFamily: "Inter-Regular",
  },

  dropdownArrow: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
    tintColor: '#CCCCCC',
    transform: [{ rotate: '90deg' }], // Adjust for dropdown arrow
  },

});

export default HomeScreen;
