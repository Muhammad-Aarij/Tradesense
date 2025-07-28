import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { back } from '../assets/images'; // adjust the path to your icon
import { ThemeContext } from '../context/ThemeProvider';

const CustomDropdown = ({
    label,
    options,
    selectedValue,
    onValueChange,
    dropdownId,
    activeDropdown,
    setActiveDropdown
}) => {
    const isVisible = activeDropdown === dropdownId;
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    return (
        <View style={{ position: 'relative' }}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TouchableOpacity
                style={styles.dropdownContainer}
                onPress={() => {
                    setActiveDropdown(isVisible ? null : dropdownId); // toggle
                }}
            >
                <Text style={styles.selectedText}>{selectedValue || 'Select an option'}</Text>
                <Image
                    source={back}
                    style={{
                        ...styles.dropdownArrow,
                        tintColor: theme.subTextColor,
                        transform: [{ rotate: isVisible ? '90deg' : '-90deg' }],
                    }}
                />
            </TouchableOpacity>

            {isVisible && (
                <View style={[styles.dropdownOptions, { backgroundColor: theme.primaryColor }]}>
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={styles.optionItem}
                            onPress={() => {
                                onValueChange(option);
                                setActiveDropdown(null); // close after select
                            }}
                        >
                            <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};


const getStyles = (theme) => StyleSheet.create({
    label: {
        fontFamily: "Outfit-Medium",
        fontSize: 12,
        color: theme.textColor,
        marginBottom: 5,
    },
    dropdownContainer: {
        flexDirection: 'row',
        height: 55,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9,
        borderColor: theme.borderColor,
        borderRadius: 8,
        paddingVertical: 7,
        paddingHorizontal: 12,
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    selectedText: {
        color: theme.subTextColor,
        fontSize: 13,
        fontFamily: 'Outfit-Regular',
    },
    dropdownOptions: {
        position: 'absolute',
        top: 85,
        left: 0,
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.86)',
        borderRadius: 8,
        paddingVertical: 10,
        zIndex: 10,
    },
    optionItem: {
        backgroundColor: theme.primayColor,
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    optionText: {
        color: theme.textColor,
        fontSize: 12,
        fontFamily: 'Outfit-Regular',
    },
    dropdownArrow: {
        width: 10,
        height: 10,
        resizeMode: 'contain',
        tintColor: '#CCCCCC',
    },
});

export default CustomDropdown;
