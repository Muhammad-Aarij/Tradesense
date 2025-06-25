import React, { useContext, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ImageBackground, Pressable, SafeAreaView, FlatList, Dimensions
} from 'react-native';
import {
  user, video, graph, bg, bell,
  book, scholar, care, circle, wave, back
} from '../../assets/images';
import { ThemeContext } from '../../context/ThemeProvider';
import { useAllPillars } from '../../functions/PillarsFunctions';
import { startLoading, stopLoading } from '../../redux/slice/loaderSlice';
import { useDispatch } from 'react-redux';
import DailyBreakdownChart from '../../components/DailyBreakdownChart';

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { data: pillars, isLoading, error } = useAllPillars();
  const [selectedFilter, setSelectedFilter] = useState('Daily');
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const filterOptions = ['Daily', 'Monthly', 'Yearly'];


  useEffect(() => {
    dispatch(startLoading());
    const timeout = setTimeout(() => {
      if (!isLoading) dispatch(stopLoading());
    }, 2000);
    return () => clearTimeout(timeout);
  }, [isLoading]);



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
          <View style={{ flexDirection: "row", width: "100%", gap: 10 }}>

            {/* Left Column */}
            <View style={{ flexDirection: "column", width: "47%", height: "100%" }}>
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
                <Text style={{ ...styles.playButtonText, textAlign: "center" }}>Daily Goal Progress</Text>
              </View>

              {/* Trading Journal */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Trading Journal</Text>
                <View style={styles.card}>
                  <Image source={graph} style={styles.cardImage} />
                  <Text style={{ ...styles.playButtonText, textAlign: "center" }}>Track Your Trades</Text>
                </View>
              </View>

              {/* Affirmation Quote */}
              <View style={{ ...styles.section, flexDirection: "row" }}>
                <Text style={styles.sectionTitle2}>
                  <Image source={circle} style={{ width: 25, height: 15, resizeMode: "contain" }} />
                  I execute trades with discipline and confidence.
                </Text>
              </View>
            </View>
          </View>

          {/* Pillars Section */}
          {/* <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pillars</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {pillars?.map((item) => (
                <Pressable
                  key={item._id}
                  style={styles.pillars}
                  onPress={() => navigation.navigate('Pillars', {
                    screen: 'PsychologyCategoryScreen',
                    params: {
                      name: item.name,
                      categories: item.categories,
                    },
                  })}
                >
                  <Image source={{ uri: item.image }} style={styles.pillarIcon} />
                  <Text style={styles.smallhd}>{item.name}</Text>
                </Pressable>
              ))}
            </View>
          </View> */}
          <View style={styles.dailyBreakdownContainer}>
            <View style={styles.dailyBreakdownHeader}>
              <View>
                <Text style={styles.dailyBreakdownTitle}>Daily Breakdown</Text>
                <Text style={styles.dailyBreakdownDate}>January 18, 2020</Text>
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

                {/* Dropdown options */}
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
              {/* <DailyBreakdownChart /> */}
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </ImageBackground >
  );
};

const getStyles = (theme) => StyleSheet.create({
  container1: { flex: 1, alignItems: 'center', paddingTop: 20, },
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
    fontSize: 16,
    fontFamily: 'Inter-Light-BETA',
    marginBottom: 5,
  },
  sectionTitle2: {
    color: "#C4C7C9",
    fontSize: 14.5,
    fontFamily: 'Inter-Light-BETA',
    marginBottom: 1,
  },
  card: {},
  cardImage: { width: '100%', height: 50, resizeMode: 'contain' },
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

});

export default HomeScreen;
