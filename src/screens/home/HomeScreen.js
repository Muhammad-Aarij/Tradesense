import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import theme from '../../../themes/theme';
import { userAvatar, card1, card2, graphIcon } from '../../../assets/images';

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image source={userAvatar} style={styles.avatar} />
        <View>
          <Text style={styles.greeting}>Good Evening! 😊</Text>
          <Text style={styles.username}>Alwin Smith</Text>
        </View>
      </View>

      {/* Mindfulness Section with Play Button */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mindfulness & Motivation</Text>
        <View style={styles.card}>
          <Image source={card1} style={styles.cardImage} />
          <TouchableOpacity style={styles.playButton}>
            <Text style={styles.playButtonText}>▶ Guided Meditation for Traders</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Accountability & Daily Goal Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accountability</Text>
        <View style={styles.goalProgress}>
          <Text style={styles.weekdays}>S M T W T F S</Text>
          <Text style={styles.weekDots}>● ● ● ● ○ ○ ○</Text>
        </View>
      </View>

      {/* Trading Journal with Graph */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trading Journal</Text>
        <Image source={graphIcon} style={styles.graphImage} />
      </View>

      {/* Affirmations with Overlay */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personalized Affirmations</Text>
        <View style={styles.card}>
          <Image source={card2} style={styles.cardImage} />
          <Text style={styles.overlayText}>I execute trades with discipline and confidence.</Text>
        </View>
      </View>

      {/* Pillars Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pillars</Text>
        <Text style={styles.pillars}>📘 Psychology   🎓 Education   ❤️ Wellbeing   🏋️ Health</Text>
      </View>

      {/* Daily Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Breakdown</Text>
        <View style={styles.graphPlaceholder}><Text style={{ color: '#aaa' }}>Graph for Jan 05, 2025</Text></View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.darkBlue, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  greeting: { color: '#fff', fontSize: 18, fontFamily: 'Inter-SemiBold' },
  username: { color: '#70C2E8', fontSize: 14, fontFamily: 'Inter-Medium' },
  section: { marginBottom: 20 },
  sectionTitle: { color: '#fff', fontSize: 16, fontFamily: 'Inter-Medium', marginBottom: 5 },
  card: { position: 'relative', alignItems: 'center' },
  cardImage: { width: '100%', height: 120, resizeMode: 'cover', borderRadius: 12 },
  playButton: { position: 'absolute', bottom: 10, backgroundColor: '#1a1a1a', padding: 8, borderRadius: 8 },
  playButtonText: { color: '#70C2E8', fontSize: 14 },
  overlayText: { position: 'absolute', bottom: 10, left: 10, color: '#fff', fontSize: 16, fontWeight: 'bold' },
  goalProgress: { flexDirection: 'column', alignItems: 'center' },
  weekdays: { color: '#fff', fontSize: 14, fontFamily: 'Inter-Medium' },
  weekDots: { color: '#70C2E8', fontSize: 18 },
  pillars: { color: '#fff', fontSize: 14, marginTop: 5 },
  graphImage: { width: '100%', height: 120, resizeMode: 'contain' },
  graphPlaceholder: { height: 100, backgroundColor: '#1a1a1a', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }
});

export default HomeScreen;
