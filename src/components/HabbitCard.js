import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Image } from 'react-native';
import { calendar, deletewhite, editwhite } from '../assets/images';
import theme from '../themes/theme';

const HabitCard = ({ habit, onEdit, onDelete }) => {
  const [isEnabled, setIsEnabled] = useState(habit.isActive);

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    // You would typically update the habit's active status in your data store here
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.habitTitle}>{habit.title}</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => onEdit(habit.id)} style={styles.iconButton}>
            <Image source={editwhite} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(habit.id)} style={styles.iconButton}>
            <Image source={deletewhite} style={styles.icon} />
          </TouchableOpacity>
          <Switch
            trackColor={{ false: '#929292', true: '#929292' }} // Grey for false, green for true
            thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View>
      <Text style={styles.habitDescription}>{habit.description}</Text>
      <View style={styles.progressSection}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10, }}>
          <View style={{ flexDirection: "row", gap: 7, }}>
            <Image source={calendar} style={styles.icon} />
            <Text style={{ ...styles.habitDescription, marginBottom: 0 }}>5 Mar 2025 / 25 Mar 2025</Text>
          </View>

          <View style={{ flexDirection: "row", }}>
            <Text style={styles.footerIcon}>🔥</Text>
            <Text style={styles.streakText}>{habit.streak}</Text>
          </View>
          <Text style={styles.goalProgressText}>{habit.progress}%</Text>
        </View>

        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${habit.progress}%` }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1.3, borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    // marginHorizontal: 20, // To match screen padding
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  habitTitle: {
    fontSize: 15,
    fontFamily: "Outfit-Regular",
    color: '#FFFFFF',
    flex: 1,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 7,
    marginRight: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 0.9, borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
  },
  icon: {
    width: 15, height: 15,
    resizeMode: 'contain',
    color: '#A0A0A0', // Grey icons
  },
  habitDescription: {
    fontSize: 12,
    color: '#B0B0B0', // Lighter grey for description
    marginBottom: 15,
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  streakText: {
    fontSize: 12,
    color: '#FFD700', // Gold color for streak number
    fontWeight: 'bold',
    marginRight: 8,
  },
  progressSection: {
    width: "100%",
    flexDirection: 'column',
    marginTop: 5,

  },
  goalProgressText: {
    fontSize: 13,
    fontFamily: "Outfit-Medium",
    color: '#FFFFFF',
    marginRight: 10,
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#404040', // Darker background for the bar
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.primaryColor, // Green for progress fill
    borderRadius: 3,
  },
});

export default HabitCard;
