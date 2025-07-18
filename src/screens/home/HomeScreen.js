import React, { useContext, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ImageBackground,
  SafeAreaView, Dimensions,
  Pressable
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  userDefault, bell, graph, circle, back,
  bellWhite, audioNew, videoNew
} from '../../assets/images';
import { ThemeContext } from '../../context/ThemeProvider';
import { useAllPillars } from '../../functions/PillarsFunctions';
import { startLoading, stopLoading } from '../../redux/slice/loaderSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useHome } from '../../functions/homeApi';
import moment from 'moment';
import DailyBreakdownChart from '../../components/DailyBreakdownChart';
import OptimizedImage from '../../components/OptimizedImage';

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { theme, isDarkMode } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { data: pillars, isLoading } = useAllPillars();
  const profilePic = useSelector(state => state.auth.userObject?.profilePic);
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
              <Image
                source={profilePic ? { uri: `http://13.61.22.84/${profilePic}` } : userDefault}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.username}>{name}</Text>
                <Text style={styles.greeting}>{getTimeBasedGreeting()}</Text>
              </View>
            </View>
            <Pressable onPress={() => navigation.navigate("Notifications")}>
              <Image source={isDarkMode ? bell : bellWhite} style={styles.bell} />
            </Pressable>
          </View>

          <View style={{ flexDirection: "row", width: "100%", gap: 10 }}>
            <View style={{ flexDirection: "column", width: "47%" }}>
              <LinearGradient start={{ x: 0, y: 0.95 }} end={{ x: 1, y: 1 }}
                colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                style={styles.linearGradient}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Mindfulness & Motivation</Text>

                  {homeData.audio?.thumbnail && (
                    <View style={styles.cardImage}>
                      <View style={styles.imageBackground}>
                        <OptimizedImage
                          uri={homeData.audio.thumbnail}
                          style={{ ...StyleSheet.absoluteFillObject, borderRadius: 10 }}
                          borderRadius={10}
                          showLoadingIndicator
                          loadingIndicatorColor="rgba(255, 255, 255, 0.7)"
                        />
                        <View style={styles.topRightTag}>
                          <Image source={audioNew} style={styles.tagIcon} />
                          <Text style={styles.tagText}>Audio</Text>
                        </View>
                        {/* {homeData.audio.duration && (
                          <View style={styles.bottomLeftDuration}>
                            <Text style={styles.durationText}>{homeData.audio.duration}</Text>
                          </View>
                        )} */}
                        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => navigation.navigate('TrackPlayer', {
                          AudioTitle: homeData.audio.title,
                          AudioDescr: homeData.audio.description,
                          Thumbnail: homeData.audio.thumbnail,
                          AudioUrl: homeData.audio.url,
                          shouldFetchTrack: false,
                        })} />
                      </View>
                    </View>
                  )}
                  <Text style={styles.playButtonText}>{homeData.audio.title}</Text>
                </View>
              </LinearGradient>

              <LinearGradient start={{ x: 0, y: 0.95 }} end={{ x: 1, y: 1 }}
                colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                style={styles.linearGradient}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Personalized Affirmations</Text>
                  {homeData.video?.thumbnail && (
                    <TouchableOpacity onPress={() => {
                      const video = homeData.video;
                      navigation.navigate('VideoPlayer', {
                        VideoTitle: video.title,
                        VideoDescr: video.description,
                        Thumbnail: video.thumbnail,
                        VideoUrl: video.url,
                      });
                    }}>
                      <View style={styles.imageBackground}>
                        <Image source={{ uri: homeData.video?.thumbnail }} style={styles.cardImage} />
                        <View style={styles.topRightTag}>
                          <Image source={videoNew} style={styles.tagIcon} />
                          <Text style={styles.tagText}>Video</Text>
                        </View>
                        {homeData.video.duration && (
                          <View style={styles.bottomLeftDuration}>
                            <Text style={styles.durationText}>{homeData.video.duration}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.playButtonText}>{homeData.video.title}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </LinearGradient>
            </View>

            <View style={{ flexDirection: "column", width: "50%" }}>
              <TouchableOpacity onPress={() => navigation.navigate("Accountability")}>
                <LinearGradient start={{ x: 0, y: 0.95 }} end={{ x: 1, y: 1 }}
                  colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                  style={styles.linearGradient}>
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
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <Text style={[styles.playButtonText, { marginTop: 0 }]}>Daily Goal Progress</Text>
                      <Image source={back} style={{ width: 10, height: 10, resizeMode: "contain", transform: [{ rotate: '180deg' }] }} />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("Accountability", { screen: "Accountability" })}>
                <LinearGradient start={{ x: 0, y: 0.95 }} end={{ x: 1, y: 1 }}
                  colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                  style={styles.linearGradient}>
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Trading Journal</Text>
                    <Image source={graph} style={[styles.cardImage, {
                      height: 67,
                      resizeMode: "contain",
                      borderBottomWidth: 2,
                      borderColor: theme.borderColor
                    }]} />
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                      <Text style={[styles.playButtonText, { marginTop: 0 }]}>Track Your Trades</Text>
                      <Image source={back} style={{ width: 10, height: 10, resizeMode: "contain", transform: [{ rotate: '180deg' }] }} />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <LinearGradient start={{ x: 0, y: 0.95 }} end={{ x: 1, y: 1 }}
                colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                style={styles.linearGradient}>
                <View style={{ ...styles.section, flexDirection: "row", alignItems: "center" }}>
                  <Image source={circle} style={{ width: 10, height: 10, marginRight: 10, resizeMode: "contain" }} />
                  <Text style={styles.sectionTitle2}>
                    {homeData?.quotation || "I execute trades with discipline and confidence."}
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </View>

          <DailyBreakdownChart />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container1: { flex: 1, alignItems: 'center', paddingTop: 0, paddingBottom: height * 0.1 },
  container: { flex: 1, padding: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    marginBottom: 20,
  },
  avatar: { width: 45, height: 45, borderRadius: 98, marginRight: 10 },
  bell: { width: 35, height: 35, resizeMode: "contain", alignSelf: 'center' },
  greeting: { color: theme.primaryColor, fontSize: 12, fontFamily: 'Inter-Regular' },
  username: { color: theme.textColor, fontSize: 12, fontFamily: 'Inter-Medium' },
  section: {
    marginBottom: 10,
    width: "100%",
    borderRadius: 10,
    padding: 12,
    flex: 1
  },
  sectionTitle: {
    color: theme.textColor,
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    marginBottom: 5,
  },
  sectionTitle2: {
marginRight:10,
    color: theme.subTextColor,
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    // flex: 1,
    flexWrap: "wrap"
  },
  cardImage: {
    width: '100%',
    height: 90,
    borderRadius: 5,
    resizeMode: 'cover'
  },
  playButtonText: {
    color: theme.subTextColor,
    fontSize: 12,
    marginTop: 10,
    fontFamily: 'Inter-Regular',
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    marginVertical: 10,
  },
  weekdays: { color: theme.textColor, fontSize: 12, textAlign: "center", fontFamily: 'Inter-Regular' },
  weekDots: { color: '#70C2E8', fontSize: 16 },
  linearGradient: {
    marginBottom: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: theme.borderColor,
    borderRadius: 10,
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  topRightTag: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 12,
    zIndex: 1,
  },
  tagText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  tagIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  bottomLeftDuration: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  durationText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  },
});

export default HomeScreen;
