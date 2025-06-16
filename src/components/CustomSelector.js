import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import theme from '../themes/theme'; // make sure to import your theme
import { back } from '../assets/images'; // adjust the path to your icon

const CustomDropdown = ({ label, options, selectedValue, onValueChange }) => {
    const [visible, setVisible] = useState(false);

    return (
        <View style={{ position: 'relative' }}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TouchableOpacity
                style={styles.dropdownContainer}
                onPress={() => setVisible(!visible)}
            >
                <Text style={styles.selectedText}>{selectedValue || 'Select an option'}</Text>
                <Image
                    source={back}
                    style={{
                        ...styles.dropdownArrow,
                        transform: [{ rotate: visible ? '90deg' : '-90deg' }],
                    }}
                />
            </TouchableOpacity>

            {visible && (
                <View style={styles.dropdownOptions}>
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={styles.optionItem}
                            onPress={() => {
                                onValueChange(option);      // ✅ select
                                setVisible(false);          // ✅ close
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

const styles = StyleSheet.create({
    label: {
        fontFamily: "Inter-Medium",
        fontSize: 13,
        color: "#fff",
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
        marginBottom:12,
    },
    selectedText: {
        color: '#fff',
        fontSize: 13,
        fontFamily: 'Inter-Regular',
    },
    dropdownOptions: {
        position: 'absolute',
        top: 73,
        left: 0,
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.86)',
        borderRadius: 8,
        paddingVertical: 10,
        zIndex: 10,
    },
    optionItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    optionText: {
        color: theme.darkBlue,
        fontSize: 12,
        fontFamily: 'Inter-Regular',
    },
    dropdownArrow: {
        width: 10,
        height: 10,
        resizeMode: 'contain',
        tintColor: '#CCCCCC',
    },
});

export default CustomDropdown;
