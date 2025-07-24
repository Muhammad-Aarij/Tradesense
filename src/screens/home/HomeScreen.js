import React, { useContext, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  userDefault,
  bell,
  graph,
  back,
  bellWhite,
  audioNew,
  videoNew,
  quot,
} from '../../assets/images';
import { ThemeContext } from '../../context/ThemeProvider';
import { useAllPillars } from '../../functions/PillarsFunctions';
import { startLoading, stopLoading } from '../../redux/slice/loaderSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useHome } from '../../functions/homeApi';
import moment from 'moment';
import DailyBreakdownChart from '../../components/DailyBreakdownChart';
import OptimizedImage from '../../components/OptimizedImage';

const { width, height } = Dimensions.get('window');

const safeText = (v) => (v == null ? '' : String(v));

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { theme, isDarkMode } = useContext(ThemeContext);
  const styles = useMemo(() => getStyles(theme), [theme]);

  const { data: pillars, isLoading } = useAllPillars(); // not used, but kept to match your code
  const profilePic = useSelector((state) => state.auth.userObject?.profilePic);
  const userId = useSelector((state) => state.auth.userObject?._id);
  const name = useSelector((state) => state.auth.userObject?.name);

  const { data: homeData } = useHome(userId);
  const logs = homeData?.logs ?? [];

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
    return logs.some((log) => moment(log.date).format('YYYY-MM-DD') === dayDate);
  };

  const formatDuration = (seconds) => {
    if (!seconds || seconds < 60) return '1 min';
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(seconds / 3600);
    return seconds >= 3600 ? `${hours} hour${hours > 1 ? 's' : ''}` : `${minutes} min`;
  };

  useEffect(() => {
    dispatch(startLoading());
    const timeout = setTimeout(() => {
      if (!isLoading) dispatch(stopLoading());
    }, 2000);
    return () => clearTimeout(timeout);
  }, [isLoading, dispatch]);

  // If you want to avoid rendering anything until homeData arrives, keep this.
  if (!homeData) {
    return (
      <SafeAreaView style={[styles.container1, { justifyContent: 'center' }]}>
        <Text style={{ color: theme.textColor, textAlign: 'center' }}>Loading…</Text>
      </SafeAreaView>
    );
  }

  const audio = homeData?.audio;
  const video = homeData?.video;
  const quotation = safeText(homeData?.quotation || 'I execute trades with discipline and confidence.');

  return (
    <ImageBackground source={theme?.bg} style={styles.container1}>
      <SafeAreaView>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
          {/* Header */}
          <View style={styles.header}>
            {/* Make sure `profilePic` is a string or undefined */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={profilePic ? { uri: `http://13.61.22.84/${profilePic}` } : userDefault}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.username}>{safeText(name)}</Text>
                <Text style={styles.greeting}>{getTimeBasedGreeting()}</Text>
              </View>
            </View>
            <Pressable onPress={() => navigation.navigate('Notifications')}>
              <Image source={isDarkMode ? bell : bellWhite} style={styles.bell} />
            </Pressable>
          </View>

          <View style={{ flexDirection: 'row', width: '100%', gap: 10 }}>
            {/* LEFT COLUMN */}
            <View style={{ flexDirection: 'column', width: '47%' }}>
              {/* Mindfulness & Motivation */}
              <LinearGradient
                start={{ x: 0, y: 0.95 }}
                end={{ x: 1, y: 1 }}
                colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                style={styles.linearGradient}
              >
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Mindfulness & Motivation</Text>

                  {!!audio?.thumbnail && (
                    <View style={styles.cardImage}>
                      <View style={styles.imageBackground}>
                        <OptimizedImage
                          uri={audio.thumbnail}
                          style={{ ...StyleSheet.absoluteFillObject, borderRadius: 10 }}
                          borderRadius={10}
                          showLoadingIndicator
                          loadingIndicatorColor="rgba(255, 255, 255, 0.7)"
                        />
                        <View style={styles.topRightTag}>
                          <Image source={audioNew} style={styles.tagIcon} />
                          <Text style={styles.tagText}>Audio</Text>
                        </View>

                        {/* duration - if you want to show it, ensure it's wrapped in Text */}
                        {!!audio?.duration && (
                          <View style={styles.bottomLeftDuration}>
                            <Text style={styles.durationText}>{formatDuration(audio.duration)}</Text>
                          </View>
                        )}

                        <TouchableOpacity
                          style={StyleSheet.absoluteFill}
                          onPress={() =>
                            navigation.navigate('TrackPlayer', {
                              AudioTitle: safeText(audio?.title),
                              AudioDescr: safeText(audio?.description),
                              Thumbnail: audio?.thumbnail,
                              AudioUrl: audio?.url,
                              shouldFetchTrack: false,
                            })
                          }
                        />
                      </View>
                    </View>
                  )}

                  {!!audio?.title && (
                    <Text style={styles.playButtonText}>{safeText(audio.title)}</Text>
                  )}
                </View>
              </LinearGradient>

              {/* Personalized Affirmations */}
              <LinearGradient
                start={{ x: 0, y: 0.95 }}
                end={{ x: 1, y: 1 }}
                colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                style={styles.linearGradient}
              >
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Personalized Affirmations</Text>
                  {!!video?.thumbnail && (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('VideoPlayer', {
                          VideoTitle: safeText(video?.title),
                          VideoDescr: safeText(video?.description),
                          Thumbnail: video?.thumbnail,
                          VideoUrl: video?.url,
                        });
                      }}
                    >
                      <View style={styles.imageBackground}>
                        <Image source={{ uri: video?.thumbnail }} style={styles.cardImage} />
                        <View style={styles.topRightTag}>
                          <Image source={videoNew} style={styles.tagIcon} />
                          <Text style={styles.tagText}>Video</Text>
                        </View>

                        {!!video?.duration && (
                          <View style={styles.bottomLeftDuration}>
                            <Text style={styles.durationText}>
                              {formatDuration(video.duration)}
                            </Text>
                          </View>
                        )}
                      </View>
                      {!!video?.title && (
                        <Text style={styles.playButtonText}>{safeText(video.title)}</Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </LinearGradient>
            </View>

            {/* RIGHT COLUMN */}
            <View style={{ flexDirection: 'column', width: '50%' }}>
              {/* Quote */}
              <ImageBackground source={quot} style={styles.linearGradient}
              >
                <View style={{ ...styles.section, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.sectionTitle2}>{quotation}</Text>
                </View>
              </ImageBackground>

              {/* Accountability */}
              <TouchableOpacity onPress={() => navigation.navigate('Accountability')}>
                <LinearGradient
                  start={{ x: 0, y: 0.95 }}
                  end={{ x: 1, y: 1 }}
                  colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                  style={styles.linearGradient}
                >
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Accountability</Text>
                    <View style={styles.goalProgress}>
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                        <View key={day + index} style={styles.dayContainer}>
                          <Text style={styles.weekdays}>{day}</Text>
                          <Text
                            style={{
                              ...styles.weekDots,
                              color: isDayCompleted(index) ? '#70C2E8' : '#AAA',
                            }}
                          >
                            ●
                          </Text>
                        </View>
                      ))}
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text style={[styles.playButtonText, { marginTop: 0 }]}>
                        Daily Goal Progress
                      </Text>
                      <Image
                        source={back}
                        style={{
                          width: 10,
                          height: 10,
                          resizeMode: 'contain',
                          transform: [{ rotate: '180deg' }],
                        }}
                      />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Trading Journal */}
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Accountability', {
                    screen: 'AccountabilityDashboard',
                    goJournaling: true,
                  })
                }
              >
                <LinearGradient
                  start={{ x: 0, y: 0.95 }}
                  end={{ x: 1, y: 1 }}
                  colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
                  style={styles.linearGradient}
                >
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Trading Journal</Text>
                    <Image
                      source={graph}
                      style={[
                        styles.cardImage,
                        {
                          height: 67,
                          resizeMode: 'contain',
                          borderBottomWidth: 2,
                          borderColor: theme.borderColor,
                        },
                      ]}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10,
                        borderTopWidth: 0.5,
                        paddingTop: 6,
                        borderColor: '#AAA',
                      }}
                    >
                      <Text style={[styles.playButtonText, { marginTop: 0 }]}>
                        Track Your Trades
                      </Text>
                      <Image
                        source={back}
                        style={{
                          width: 10,
                          height: 10,
                          resizeMode: 'contain',
                          transform: [{ rotate: '180deg' }],
                        }}
                      />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <DailyBreakdownChart />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container1: {
      flex: 1,
      alignItems: 'center',
      paddingTop: 0,
      paddingBottom: height * 0.1,
    },
    container: { flex: 1, padding: 24 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    avatar: { width: 45, height: 45, borderRadius: 98, marginRight: 10 },
    bell: { width: 35, height: 35, resizeMode: 'contain', alignSelf: 'center' },
    greeting: { color: theme.primaryColor, fontSize: 12, fontFamily: 'Inter-Regular' },
    username: { color: theme.textColor, fontSize: 12, fontFamily: 'Inter-Medium' },
    section: {
      width: '100%',
      borderRadius: 10,
      padding: 12,
      flex: 1,
    },
    sectionTitle: {
      color: theme.textColor,
      fontSize: 13,
      fontFamily: 'Inter-Medium',
      marginBottom: 5,
    },
    sectionTitle2: {
      marginRight: 10,
      color: theme.subTextColor,
      fontSize: 13,
      fontFamily: 'Inter-Regular',
      flexWrap: 'wrap',
      flex: 1,
    },
    cardImage: {
      width: '100%',
      height: 90,
      borderRadius: 6,
      resizeMode: 'cover',
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
      justifyContent: 'space-between',
      marginVertical: 10,
    },
    weekdays: {
      color: theme.textColor,
      fontSize: 12,
      textAlign: 'center',
      fontFamily: 'Inter-Regular',
    },
    weekDots: { color: '#70C2E8', fontSize: 16 },
    linearGradient: {
      marginBottom: 10,
      width: '100%',
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 10,
      overflow: 'hidden',
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
    dayContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
  });

export default HomeScreen;
