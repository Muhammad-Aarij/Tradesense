import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Pressable,
  SafeAreaView
} from 'react-native';
import {
  user, video, graph, bg, bell,
  book, scholar, care, circle, wave
} from '../../assets/images';
import { ThemeContext } from '../../context/ThemeProvider';

const HomeScreen = ({ navigation }) => {
  const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
  const styles = getStyles(theme);

  const navigateTo = (screen, stack) => {
    if (stack) {
      navigation.navigate(stack, { screen });
    } else {
      navigation.navigate(screen);
    }
  }

  return (
    <ImageBackground source={theme.bg} style={styles.container1}>
      <SafeAreaView>

        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>

          {/* Header Section */}
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

          {/* Main Content Row */}
          <View style={{ flexDirection: "row", width: "100%", gap: 15 }}>

            {/* Left Column */}
            <View style={{ flexDirection: "column", width: "45%", height: "100%" }}>
              {/* Mindfulness Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mindfulness & Motivation</Text>
                <View style={styles.card}>
                  <Image source={video} style={{ ...styles.cardImage, resizeMode: "cover" }} />
                  <Text style={styles.playButtonText}>Guided Meditation for Traders</Text>
                </View>
              </View>

              {/* Affirmations */}
              <View style={{ ...styles.section, flex: 1 }}>
                <Text style={styles.sectionTitle}>Personalized Affirmations</Text>
                <View style={styles.card}>
                  <Image source={wave} style={{ height: "80%", width: "100%", resizeMode: "cover" }} />
                  <TouchableOpacity style={styles.playButton} />
                </View>
              </View>
            </View>

            {/* Right Column */}
            <View style={{ flexDirection: "column", width: "50%" }}>
              {/* Accountability */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Accountability</Text>
                <View style={styles.goalProgress}>
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <View key={index} style={styles.dayContainer}>
                      <Text style={styles.weekdays}>{day}</Text>
                      <Text style={styles.weekDots}>{index < 4 ? "●" : "○"}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Trading Journal */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Trading Journal</Text>
                <View style={styles.card}>
                  <Image source={graph} style={styles.cardImage} />
                  <Text style={styles.smallhd}>Track Your Trades</Text>
                </View>
              </View>

              {/* Affirmation Quote */}
              <View style={{ ...styles.section, flexDirection: "row" }}>
                <Text style={styles.sectionTitle}>
                  <Image source={circle} style={{ width: 25, height: 15, resizeMode: "contain" }} />
                  I execute trades with discipline and confidence.
                </Text>
              </View>
            </View>
          </View>

          {/* Pillars Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pillars</Text>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable style={styles.pillars} onPress={() => { navigateTo("PsychologyCategoryScreen", "Pillars") }}>
                <Image source={book} style={styles.pillarIcon} />
                <Text style={styles.smallhd}>Psychology</Text>
              </Pressable>
              <Pressable style={styles.pillars} onPress={() => { navigateTo("PillarsCategoryScreen", "Pillars") }}>
                <Image source={scholar} style={styles.pillarIcon} />
                <Text style={styles.smallhd}>Education</Text>
              </Pressable>
            </View>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <View style={styles.pillars}>
                <Image source={care} style={styles.pillarIcon} />
                <Text style={styles.smallhd}>Wellbeing</Text>
              </View>
              <View style={styles.pillars}>
                <Image source={book} style={styles.pillarIcon} />
                <Text style={styles.smallhd}>Health</Text>
              </View>
            </View>
          </View>

          {/* Optional Daily Breakdown */}
          {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Breakdown</Text>
          <View style={styles.graphPlaceholder}><Text style={{ color: '#aaa' }}>Graph for Jan 05, 2025</Text></View>
        </View> */}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container1: { flex: 1, alignItems: 'center' },
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
    marginBottom: 15,
    width: "100%",
    borderWidth: 1,
    borderColor: theme.borderColor,
    borderRadius: 10,
    padding: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  sectionTitle: {
    color: theme.textColor,
    fontSize: 16.5,
    fontFamily: 'Inter-Light-BETA',
    marginBottom: 5,
  },
  card: {},
  cardImage: { width: '100%', height: 50, resizeMode: 'contain' },
  playButtonText: {
    color: theme.textColor,
    fontSize: 13,
    marginTop: 10,
    fontFamily: 'Inter-Light-BETA',
  },
  smallhd: {
    color: theme.textColor,
    fontSize: 14,
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
    width: "48%",
    borderWidth: 1,
    borderColor: theme.borderColor,
    borderRadius: 10,
    padding: 8,
    paddingHorizontal: 12,
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
});

export default HomeScreen;
