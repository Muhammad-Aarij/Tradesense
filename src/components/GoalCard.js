import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { bell, calendar, deletewhite, editwhite } from '../assets/images';
import theme from '../themes/theme';

const GoalCard = ({ goal, onEdit, onDelete }) => {
    const formatDate = (isoDate) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }); // e.g. "26 Jun 2025"
    };

    return (
        <View style={styles.cardContainer}>
            <View style={styles.headerRow}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => onEdit(goal)} style={styles.iconButton}>
                        <Image source={editwhite} style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDelete(goal._id)} style={styles.iconButton}>
                        <Image source={deletewhite} style={styles.icon} />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.goalDescription}>{goal.description}</Text>
            <View style={styles.progressSection}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                    <View style={{ flexDirection: "row", gap: 7, }}>
                        <Image source={calendar} style={styles.icon} />
                        <Text style={styles.goalDescription}>{formatDate(goal.updatedAt)} / {formatDate(goal.targetDate)}</Text>
                    </View>
                    <Text style={styles.goalProgressText}>{goal.progress ?? 0}%</Text>
                </View>
                <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${goal.progress || 0}%` }]} />
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
    goalTitle: {
        fontSize: 15,
        fontFamily: "Inter-Regular",
        color: '#FFFFFF',
        flex: 1,
    },
    iconContainer: {
        flexDirection: 'row',
    },
    iconButton: {
        padding: 7,
        marginLeft: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9, borderColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 8,
    },
    icon: {
        width: 15, height: 15,
        resizeMode: 'contain',
        color: '#A0A0A0', // Grey icons
    },
    goalDescription: {
        fontSize: 12,
        color: '#B0B0B0', // Lighter grey for description
        marginBottom: 5,
        lineHeight: 20,
    },
    progressSection: {
        width: "100%",
        flexDirection: 'column',
        marginTop: 10,
    },
    goalProgressText: {
        fontSize: 13,
        fontFamily: "Inter-Medium",
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

export default GoalCard;