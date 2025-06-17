import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { deleteHabit, useHabitByUser, updateHabit } from '../../functions/habbitFunctions';
import { back } from '../../assets/images';
import theme from '../../themes/theme';
import HabitCard from '../../components/HabbitCard';

export default function HabitContainer({ navigation }) {
    const userId = useSelector(state => state.auth.userId);
    const { data: habitsData = [] } = useHabitByUser(userId);

    const [activeGoalFilter, setActiveGoalFilter] = useState("");
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
    const [localHabits, setLocalHabits] = useState([]);


    const filterOptions = ['All', 'Weekly', 'Monthly'];

    const handleEdit = (habit, type) => {
        console.log(`Editing ${type}:`, habit);
        navigation.navigate('AddHabit', { habit });
    };

    const handleDelete = async (id, type) => {
        console.log(`Deleting ${type} with ID:`, id);

        const result = await deleteHabit(id);

        if (result.error) {
            console.warn(`Failed to delete ${type}:`, result.error);
        } else {
            console.log(`Successfully deleted ${type} with ID:`, result);
            console.log(`${type} deleted successfully`);
        }
    };

    const filteredHabits = habitsData.filter(habit => {
        const frequency = habit.frequency || '';
        return selectedFilter === 'All' || frequency === selectedFilter;
    });


    return (
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <View style={styles.headerTop}>
                    <Text style={styles.sectionTitle}>Habit Tracking</Text>
                    <TouchableOpacity
                        style={styles.addSmallButton}
                        onPress={() => navigation.navigate('AddHabit')}
                    >
                        <Text style={styles.addSmallButtonText}>+ Add Habit</Text>
                    </TouchableOpacity>
                </View>

                {<View style={styles.sectionActions}>
                    <View style={styles.filtersRow}>
                        {['Daily', 'Weekly', 'Monthly'].map(filter => (
                            <TouchableOpacity
                                key={filter}
                                style={[
                                    styles.smallFilterTab,
                                    activeGoalFilter === filter && styles.activeSmallFilterTab,
                                ]}
                                onPress={() => setActiveGoalFilter(filter)}
                            >
                                <Text
                                    style={[
                                        styles.smallFilterTabText,
                                        activeGoalFilter === filter &&
                                        styles.activeSmallFilterTabText,
                                    ]}
                                >
                                    {filter}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={{ position: 'relative' }}>
                        <TouchableOpacity
                            style={styles.dropdownContainer}
                            onPress={() => setFilterDropdownVisible(!filterDropdownVisible)}
                        >
                            <Text style={styles.dailyBreakdownFilter}>{selectedFilter}</Text>
                            <Image
                                source={back}
                                style={{
                                    ...styles.dropdownArrow,
                                    transform: [
                                        { rotate: filterDropdownVisible ? '90deg' : '-90deg' },
                                    ],
                                }}
                            />
                        </TouchableOpacity>

                        {filterDropdownVisible && (
                            <View style={styles.dropdownOptions}>
                                {filterOptions.map(option => (
                                    <TouchableOpacity
                                        key={option}
                                        style={styles.optionItem}
                                        onPress={() => {
                                            setSelectedFilter(option);
                                            setFilterDropdownVisible(false);
                                        }}
                                    >
                                        <Text style={styles.optionText}>{option}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </View>}
            </View>

            <FlatList
                data={filteredHabits}
                keyExtractor={item => item._id.toString()}
                renderItem={({ item }) => (
                    <HabitCard
                        habit={item}
                        onEdit={id => handleEdit(item._id, 'Habit')}
                        onDelete={id => handleDelete(item._id, 'Habit')}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 30 }}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        flex: 1,
        // backgroundColor: '#000',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    sectionHeader: {
        marginBottom: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 22,
        color: '#fff',
        fontFamily: 'Inter-SemiBold',
    },
    addSmallButton: {
        backgroundColor: theme.primaryColor,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
    },
    addSmallButtonText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Inter-Medium',
    },
    sectionActions: {

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filtersRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    smallFilterTab: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#222',
        marginRight: 8,
    },
    activeSmallFilterTab: {
        backgroundColor: theme.primaryColor,
    },
    smallFilterTabText: {
        color: '#aaa',
        fontSize: 13,
        fontFamily: 'Inter-Medium',
    },
    activeSmallFilterTabText: {
        color: '#fff',
    },
    dropdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1c1c1c',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        marginLeft: 10,
    },
    dropdownArrow: {
        width: 12,
        height: 12,
        marginLeft: 6,
        tintColor: '#fff',
    },
    dailyBreakdownFilter: {
        color: '#fff',
        fontSize: 13,
        fontFamily: 'Inter-Regular',
    },
    dropdownOptions: {
        position: 'absolute',
        top: 38,
        backgroundColor: '#1c1c1c',
        width: 100,
        borderRadius: 10,
        paddingVertical: 4,
        zIndex: 999,
    },
    optionItem: {
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    optionText: {
        color: '#fff',
        fontSize: 13,
        fontFamily: 'Inter-Regular',
    },
});
