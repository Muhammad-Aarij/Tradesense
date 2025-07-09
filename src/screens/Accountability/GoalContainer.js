import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ImageBackground,
    SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { deleteGoal, useGoalsByUser } from '../../functions/Goal';
import GoalCard from '../../components/GoalCard';
import { back, bg } from '../../assets/images';
import { startLoading, stopLoading } from '../../redux/slice/loaderSlice';
import { useQueryClient } from '@tanstack/react-query';
import Header from '../../components/Header';
import { ThemeContext } from '../../context/ThemeProvider';

export default function GoalContainer({ navigation }) {
    const { theme } = useContext(ThemeContext); // Use the theme context
    const userId = useSelector(state => state.auth.userId);
    const { data: goalsData = [], isLoading } = useGoalsByUser(userId);
    const queryClient = useQueryClient();
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
    const dispatch = useDispatch();

    const filterOptions = ['All', 'Weekly', 'Monthly'];

    useEffect(() => {
        dispatch(startLoading());
        const timeout = setTimeout(() => {
            if (!isLoading) {
                dispatch(stopLoading());
            }
        }, 2000);
        return () => {
            clearTimeout(timeout);
            dispatch(stopLoading());
        };
    }, [isLoading]);

    const handleEdit = (goal, type) => {
        navigation.navigate('AddGoal', { goal });
    };

    const handleDelete = async (id, type) => {
        const result = await deleteGoal(id);
        if (result.error) {
            console.warn(`Failed to delete ${type}:`, result.error);
        } else {
            queryClient.invalidateQueries(['goals', userId]);
        }
    };

    const filteredGoals = goalsData.filter(goal => {
        const frequency = goal.frequency || '';
        return selectedFilter === 'All' || frequency === selectedFilter;
    });

    const styles = getStyles(theme); // Generate themed styles

    return (
        <ImageBackground source={theme.bg || bg} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <Header title={"Success Tracker"} style={{ marginBottom: 0, marginLeft: 20 }} />
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionActions}>
                            <TouchableOpacity
                                style={styles.addSmallButton}
                                onPress={() => navigation.navigate('AddGoal')}
                            >
                                <Text style={styles.addSmallButtonText}>+ Add Goal</Text>
                            </TouchableOpacity>

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
                                            tintColor: theme.textColor,
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
                        </View>
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
            </SafeAreaView>
        </ImageBackground>
    );
}

const getStyles = (theme) => StyleSheet.create({
    sectionContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    sectionHeader: {
        marginBottom: 20,
    },
    addSmallButton: {
        backgroundColor: theme.primaryColor,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
    },
    addSmallButtonText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Inter-Medium',
    },
    sectionActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        backgroundColor: theme.transparentBg,
        borderWidth: 0.9,
        borderColor: theme.borderColor,
        borderRadius: 8,
        paddingHorizontal: 13,
        width: 100,
        paddingVertical: 8,
        marginLeft: 10,
    },
    dropdownArrow: {
        width: 10,
        height: 10,
        resizeMode: "contain",
        marginLeft: 6,
        tintColor: '#fff',
    },
    dailyBreakdownFilter: {
        color: theme.textColor,
        fontSize: 12,
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
