import React, { useState,useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import { deleteGoal, useGoalsByUser } from '../../functions/Goal';
import GoalCard from '../../components/GoalCard';
import { back } from '../../assets/images';
import theme from '../../themes/theme';
import { startLoading, stopLoading } from '../../redux/slice/loaderSlice';
import { useQueryClient } from '@tanstack/react-query';

export default function GoalContainer({ navigation }) {

    const userId = useSelector(state => state.auth.userId);
    const { data: goalsData = [], isLoading } = useGoalsByUser(userId);
    const queryClient = useQueryClient();
    const [activeGoalFilter, setActiveGoalFilter] = useState("");
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
    const [localGoals, setLocalGoals] = useState([]);
    const dispatch=useDispatch();

    const filterOptions = ['All', 'Weekly', 'Monthly'];

    useEffect(() => {
        dispatch(startLoading());
        const timeout = setTimeout(() => {
            if (!isLoading) dispatch(stopLoading());
        }, 2000);
        return () => clearTimeout(timeout);
    }, [isLoading]);

    const handleEdit = (goal, type) => {
        navigation.navigate('AddGoal', { goal });
    };

    const handleDelete = async (id, type) => {
        console.log(`Deleting ${type} with ID:`, id);

        const result = await deleteGoal(id);

        if (result.error) {
            console.warn(`Failed to delete ${type}:`, result.error);
        } else {
            console.log(`${type} deleted successfully`);
            queryClient.invalidateQueries(['goals', userId]); // ✅ invalidate the goals query
        }
    };
    const filteredGoals = goalsData.filter(goal => {
        const frequency = goal.frequency || '';
        return selectedFilter === 'All' || frequency === selectedFilter;
    });


    return (
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <View style={styles.headerTop}>
                    <Text style={styles.sectionTitle}>Goal Tracking</Text>
                    <TouchableOpacity
                        style={styles.addSmallButton}
                        onPress={() => navigation.navigate('AddGoal')}
                    >
                        <Text style={styles.addSmallButtonText}>+ Add Goal</Text>
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
                data={filteredGoals}
                keyExtractor={item => item._id.toString()}
                renderItem={({ item }) => (
                    <GoalCard
                        goal={item}
                        onEdit={id => handleEdit(id)}
                        onDelete={id => handleDelete(id, 'Goal')}
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
        fontSize: 17,
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
