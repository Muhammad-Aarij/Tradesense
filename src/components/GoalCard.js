import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { bell, calendar, deletewhite, dots, editwhite } from '../assets/images';
import { ThemeContext } from '../context/ThemeProvider';
import LinearGradient from 'react-native-linear-gradient';

const GoalCard = ({ goal, onEdit, onDelete }) => {
    const { theme, isDarkMode } = useContext(ThemeContext); // 💡 Get theme from context
    const styles = getStyles(theme); // 💡 Create themed styles
    const [dropdownVisible, setDropdownVisible] = useState(false);

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
                    <TouchableOpacity
                        onPress={() => setDropdownVisible(!dropdownVisible)}
                    >
                        <Image source={dots} style={styles.icon} />
                    </TouchableOpacity>

                    {dropdownVisible && (
                        <View style={styles.dropdownMenu}>
                            <TouchableOpacity style={styles.iconButton} onPress={() => { onEdit(goal); setDropdownVisible(false); }}>
                                <Image source={editwhite} style={{ ...styles.icon, tintColor: isDarkMode ? "black" : theme.subTextColor }} />
                                <Text style={{ ...styles.dropdownItem, color: isDarkMode ? "black" : theme.subTextColor }}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton} onPress={() => { onDelete(goal._id); setDropdownVisible(false); }}>
                                <Image source={deletewhite} style={{ ...styles.icon, tintColor: isDarkMode ? "black" : theme.subTextColor }} />
                                <Text style={{ ...styles.dropdownItem, color: isDarkMode ? "black" : theme.subTextColor }}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
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
        fontSize: 14,
        fontFamily: 'Outfit-Regular',
        color: theme.textColor,
        flex: 1,
    },
    iconContainer: {
        flexDirection: 'row',
    },
    iconButton: {

        backgroundColor: "white",
        flexDirection: "row",
        alignItems: 'center',
        gap: 10,
        // padding: 7,
        paddingHorizontal: 10,
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
        fontFamily: 'Outfit-Medium',
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
    dropdownMenu: {
        position: 'absolute',
        top: 30,
        right: 0,
        gap: 5,
        backgroundColor: theme.transparentBg,
        borderColor: theme.borderColor,
        borderWidth: 1,
        borderRadius: 8,
        zIndex: 1000,
        paddingVertical: 5,
        paddingHorizontal: 5,
        shadowColor: theme.primaryColor,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },

    dropdownItem: {
        color: theme.subTextColor,
        fontSize: 12,
        fontFamily: 'Outfit-Regular',
        paddingVertical: 6,
    },
    iconContainer: {
        flexDirection: 'row',
        position: 'relative', // required for absolute dropdown inside
    },



});

export default GoalCard;
