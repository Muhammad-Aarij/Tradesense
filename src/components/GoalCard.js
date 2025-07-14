import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { bell, calendar, deletewhite, editwhite } from '../assets/images';
import { ThemeContext } from '../context/ThemeProvider';
import LinearGradient from 'react-native-linear-gradient';

const GoalCard = ({ goal, onEdit, onDelete }) => {
    const { theme } = useContext(ThemeContext); // 💡 Get theme from context
    const styles = getStyles(theme); // 💡 Create themed styles

    const formatDate = (isoDate) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <LinearGradient
            colors={['rgba(126,126,126,0.12)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0.95 }}
            end={{ x: 1, y: 1 }} style={styles.cardContainer}>
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', gap: 7 }}>
                        <Image source={calendar} style={styles.icon} />
                        <Text style={styles.goalDescription}>
                            {formatDate(goal.updatedAt)} / {formatDate(goal.targetDate)}
                        </Text>
                    </View>
                    <Text style={styles.goalProgressText}>{goal.progress ?? 0}%</Text>
                </View>
                <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${goal.progress || 0}%` }]} />
                </View>
            </View>
        </LinearGradient>
    );
};

const getStyles = (theme) => StyleSheet.create({
    cardContainer: {
        // backgroundColor: theme.transparentBg,
        borderWidth: 1.3,
        borderColor: theme.borderColor,
        borderRadius: 8,
        padding: 15,
        marginVertical: 8,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    goalTitle: {
        fontSize: 15,
        fontFamily: 'Inter-Regular',
        color: theme.textColor,
        flex: 1,
    },
    iconContainer: {
        flexDirection: 'row',
    },
    iconButton: {
        padding: 7,
        marginLeft: 5,
        backgroundColor: theme.transparentBg,
        borderWidth: 0.9,
        borderColor: theme.borderColor,
        borderRadius: 8,
    },
    icon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        tintColor: theme.subTextColor, // Apply dynamic icon tint
    },
    goalDescription: {
        fontSize: 12,
        color: theme.subTextColor,
        marginBottom: 5,
        lineHeight: 20,
    },
    progressSection: {
        width: '100%',
        flexDirection: 'column',
        marginTop: 10,
    },
    goalProgressText: {
        fontSize: 13,
        fontFamily: 'Inter-Medium',
        color: theme.textColor,
        marginRight: 10,
    },
    progressBarBackground: {
        flex: 1,
        height: 6,
        backgroundColor: theme.borderColor,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: theme.primaryColor,
        borderRadius: 3,
    },
});

export default GoalCard;
