
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';

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
            {/* Edit icon placeholder */}
            <Text style={styles.icon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(habit.id)} style={styles.iconButton}>
            {/* Delete icon placeholder */}
            <Text style={styles.icon}>🗑️</Text>
          </TouchableOpacity>
          <Switch
            trackColor={{ false: '#767577', true: '#4CAF50' }} // Grey for false, green for true
            thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View>
      <Text style={styles.habitDescription}>{habit.description}</Text>
      <View style={styles.footerRow}>
        <View style={styles.dateInfo}>
          {/* Calendar icon placeholder */}
          <Text style={styles.footerIcon}>🗓️</Text>
          <Text style={styles.dateText}>{habit.dateRange}</Text>
        </View>
        <View style={styles.progressInfo}>
          {/* Flame icon placeholder */}
          <Text style={styles.footerIcon}>🔥</Text>
          <Text style={styles.streakText}>{habit.streak}</Text>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${habit.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{habit.progress}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#2A2A2A', // Slightly lighter dark for card background
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000', // Subtle shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E0E0E0', // Light grey text
    flex: 1, // Allow title to take available space
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 5,
    marginHorizontal: 2,
  },
  icon: {
    fontSize: 20,
    color: '#A0A0A0', // Grey icons
  },
  habitDescription: {
    fontSize: 13,
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
  footerIcon: {
    fontSize: 16,
    color: '#A0A0A0', // Grey icons
    marginRight: 5,
  },
  dateText: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 12,
    color: '#FFD700', // Gold color for streak number
    fontWeight: 'bold',
    marginRight: 8,
  },
  progressBarBackground: {
    height: 6,
    width: 60, // Fixed width for the progress bar
    backgroundColor: '#404040', // Darker background for the bar
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#66BB6A', // Green for progress fill
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#B0B0B0',
  },
});

export default HabitCard;

```javascript
// src/screens/HabitTrackingScreen.js
// This screen displays the main Habit Tracking interface,
// including header, filter tabs, and a list of habit cards.

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import HabitCard from '../components/HabitCard'; // Assuming the path to your HabitCard component

const HabitTrackingScreen = () => {
  const [activeFilter, setActiveFilter] = useState('Daily');
  const [searchText, setSearchText] = useState(''); // If there was a search bar
  const [selectedSortOption, setSelectedSortOption] = useState('All'); // For the 'All' dropdown

  // Dummy data for habits
  const habits = [
    {
      id: 'h1',
      title: 'Morning Walk',
      description: 'Lorem ipsum is simply dummy text of the printing and Typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      dateRange: '5 Mar 2025 / 25 Mar 2025',
      streak: 5,
      progress: 85,
      isActive: true,
      type: 'Daily',
    },
    {
      id: 'h2',
      title: 'Read 30 mins',
      description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      dateRange: 'Weekly Goal',
      streak: 3,
      progress: 50,
      isActive: true,
      type: 'Weekly',
    },
    {
      id: 'h3',
      title: 'Meditate',
      description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      dateRange: 'Daily Routine',
      streak: 10,
      progress: 95,
      isActive: false,
      type: 'Daily',
    },
    {
      id: 'h4',
      title: 'Monthly Review',
      description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      dateRange: 'April 2025',
      streak: 1,
      progress: 20,
      isActive: true,
      type: 'Monthly',
    },
  ];

  // Filter habits based on activeFilter and selectedSortOption
  const filteredHabits = habits.filter(habit => {
    const matchesFilter = activeFilter === 'All' || habit.type === activeFilter;
    // Add logic for 'All' dropdown if it filters by something other than habit type
    return matchesFilter;
  });


  const handleAddHabit = () => {
    console.log('Add Habit button pressed!');
    // Navigation to an Add Habit screen would go here
  };

  const handleEditHabit = (id) => {
    console.log('Edit habit with ID:', id);
    // Navigation to an Edit Habit screen with habit ID
  };

  const handleDeleteHabit = (id) => {
    console.log('Delete habit with ID:', id);
    // Logic to confirm and delete habit
  };


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Habit Tracking</Text>
        <TouchableOpacity style={styles.addHabitButton} onPress={handleAddHabit}>
          <Text style={styles.addHabitButtonText}>+ Add Habit</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <View style={styles.filterTabs}>
          {['Daily', 'Weekly', 'Monthly'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                activeFilter === filter && styles.activeFilterTab,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === filter && styles.activeFilterTabText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 'All' Dropdown - represented as a touchable for now */}
        <TouchableOpacity style={styles.allDropdown} onPress={() => console.log('All dropdown pressed')}>
          <Text style={styles.allDropdownText}>{selectedSortOption}</Text>
          <Text style={styles.dropdownArrow}>V</Text> {/* Dropdown arrow */}
        </TouchableOpacity>
      </View>

      {/* Habits List */}
      <ScrollView style={styles.habitsList} showsVerticalScrollIndicator={false}>
        {filteredHabits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onEdit={handleEditHabit}
            onDelete={handleDeleteHabit}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E', // Dark background
    paddingTop: 20, // Space from the top edge
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E0E0E0', // Light grey text
  },
  addHabitButton: {
    backgroundColor: '#007AFF', // Blue color for the button
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  addHabitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#2A2A2A', // Darker background for the tabs container
    borderRadius: 10,
    padding: 3,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  activeFilterTab: {
    backgroundColor: '#007AFF', // Blue for active tab
  },
  filterTabText: {
    color: '#A0A0A0', // Grey text for inactive tabs
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: '#FFFFFF', // White text for active tab
  },
  allDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A', // Darker background for the dropdown
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  allDropdownText: {
    color: '#A0A0A0',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 5,
  },
  dropdownArrow: {
    color: '#A0A0A0',
    fontSize: 12,
  },
  habitsList: {
    flex: 1,
    // Horizontal padding handled by HabitCard itself
  },
});

export default StockAnalyticsScreen;

