import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import theme from '../../themes/theme';
import { user, video, graph, bg, bell, book, scholar, care, circle, wave } from '../../assets/images';

const HomeScreen = () => {
  return (
    <ImageBackground source={bg} style={styles.container1}>

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
          {/* Ensuring the bell stays aligned */}
          <Image source={bell} style={{ width: 45, height: 45, resizeMode: "contain", alignSelf: 'center' }} />
        </View>



        <View style={{ flexDirection: "row", width: "100%", gap: 15, }}>

          <View style={{ flexDirection: "column", width: "45%", height: "100%", }}>
            {/* Mindfulness Section with Play Button */}
            <View style={{ ...styles.section, }}>
              <Text style={styles.sectionTitle}>Mindfulness & Motivation</Text>
              <View style={styles.card}>
                <Image source={video} style={{ ...styles.cardImage, resizeMode: "cover" }} />
                <Text style={styles.playButtonText}>Guided Meditation for Traders</Text>
              </View>
            </View>
            {/* Affirmations with Overlay */}
            <View style={{ ...styles.section, flex: 1, }}>
              <Text style={styles.sectionTitle}>Personalized Affirmations</Text>
              <View style={styles.card}>
                <Image source={wave} style={{ height: "80%", width: "100%", resizeMode: "cover" }} />
                <TouchableOpacity style={styles.playButton}>
                </TouchableOpacity>
              </View>
            </View>
          </View>



          <View style={{ flexDirection: "column", width: "50%" }}>
            {/* Accountability & Daily Goal Progress */}
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

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trading Journal</Text>
              <View style={styles.card}>
                <Image source={graph} style={styles.cardImage} />
                <Text style={styles.smallhd}>Track Your Trades</Text>
              </View>
            </View>
            {/* Trading Journal with Graph */}
            <View style={{ ...styles.section, flexDirection: "row" }}>
              <Text style={styles.sectionTitle}>
                <Image source={circle} style={{ width: 25, height: 15, resizeMode: "contain" }} />
                I execute trades with discipline and confidence.</Text>
            </View>
          </View>

        </View>


        {/* Pillars Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pillars</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={styles.pillars}>
              <Image source={book} style={{ width: 25, height: 25, resizeMode: "contain", marginRight: 9 }} />
              <Text style={styles.smallhd}>
                Psychology
              </Text>
            </View>
            <View style={styles.pillars}>
              <Image source={scholar} style={{ width: 25, height: 25, resizeMode: "contain", marginRight: 9 }} />
              <Text style={styles.smallhd}>
                Education
              </Text>
            </View>
          </View>


          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={styles.pillars}>
              <Image source={care} style={{ width: 25, height: 25, resizeMode: "contain", marginRight: 9 }} />
              <Text style={styles.smallhd}>
                Wellbeing
              </Text>
            </View>
            <View style={styles.pillars}>
              <Image source={book} style={{ width: 25, height: 25, resizeMode: "contain", marginRight: 9 }} />
              <Text style={styles.smallhd}>
                Health
              </Text>
            </View>
          </View>
        </View>

        {/* Daily Breakdown */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Breakdown</Text>
          <View style={styles.graphPlaceholder}><Text style={{ color: '#aaa' }}>Graph for Jan 05, 2025</Text></View>
        </View> */}
      </ScrollView>
    </ImageBackground >
  );
};

const styles = StyleSheet.create({
  container1: { flex: 1, alignItems: 'center', backgroundColor: theme.darkBlue },
  container: { flex: 1, padding: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    marginBottom: 20,
    // borderWidth: 1,
    // borderColor: "white",

  },
  avatar: { width: 45, height: 45, borderRadius: 8, marginRight: 10 },
  greeting: { color: theme.primaryColor, fontSize: 14, fontFamily: 'Inter-Regular' },
  username: { color: 'white', fontSize: 12, fontFamily: 'Inter-Medium' },
  section: {
    marginBottom: 15, width: "100%",
    borderWidth: 1, borderColor: theme.borderColor,
    borderRadius: 10, padding: 13, backgroundColor: '#0d151e',
  },
  sectionTitle: { color: 'rgba(196, 199, 201, 0.6)', fontSize: 16.5, fontFamily: 'Inter-Medium', marginBottom: 5 },
  card: {},
  cardImage: { width: '100%', height: 50, resizeMode: 'contain', },
  playButtonText: { color: 'rgba(196, 199, 201, 0.6)', fontSize: 15, marginTop: 10, fontFamily: 'Inter-Light-BETA', },
  smallhd: { color: 'rgba(196, 199, 201, 0.6)', fontSize: 14, fontFamily: 'Inter-Regular', marginTop: 5 },
  goalProgress: { flexDirection: 'row', alignItems: 'center',width:"100%",justifyContent:"space-between" },
  weekdays: { color: '#fff', fontSize: 14, fontFamily: 'Inter-Medium' },
  weekDots: { color: '#70C2E8', fontSize: 18 },
  pillars: {
    flexDirection: "row", width: "48%",
    borderWidth: 1, borderColor: theme.borderColor,
    borderRadius: 10, padding: 8, paddingHorizontal: 12, backgroundColor: '#0d151e', marginBottom: 8,
  },
  graphImage: { width: '100%', height: 120, resizeMode: 'contain' },
  graphPlaceholder: { height: 100, backgroundColor: '#1a1a1a', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }
});

export default HomeScreen;
