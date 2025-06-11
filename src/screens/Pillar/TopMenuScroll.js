import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import theme from '../../themes/theme';

const TopMenuScroll = ({ items, selectedItem, onItemSelected }) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
        >
            {items.map((item) => (
                <TouchableOpacity
                    key={item.id}
                    style={[
                        styles.menuItem,
                        selectedItem === item.id && styles.selectedMenuItem,
                    ]}
                    onPress={() => onItemSelected(item.id)}
                >
                    <Image style={{ width: 20, height: 20, resizeMode: "contain", marginRight: 10, }} source={item.icon}></Image>
                    <Text
                        style={[
                            styles.menuItemText,
                            selectedItem === item.id && styles.selectedMenuItemText,
                        ]}
                    >
                        {item.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        paddingHorizontal: 16,
        paddingVertical: 5,
        alignItems: 'center',
        height: "auto",
    },
    menuItem: {
        // borderWidth:3,
        // borderColor:"white", // Center items vertically in the scroll view
        flexDirection: "row",
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 1,
        borderColor: '#2e2e2e', // Slight border for unselected items
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginRight: 10,
    },
    selectedMenuItem: {
        backgroundColor: theme.primaryColor,
        borderColor: theme.primaryColor,
    },
    menuItemText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: "Inter-Regular", // Ensure font is loaded
    },
    selectedMenuItemText: {
    },
});

export default TopMenuScroll;
