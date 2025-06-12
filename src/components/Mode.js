import React, { useContext } from "react";
import { Image, View, TouchableOpacity } from "react-native";
import { ThemeContext } from "../context/ThemeProvider";
import { dark, light } from "../assets/images"; // Assuming light mode has `light` image

const Mode = () => {
    const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);

    return (
        <TouchableOpacity 
            style={styles.container} 
            onPress={toggleTheme} // Toggle theme on click
        >
            <Image source={isDarkMode ? dark : light} style={styles.icon} />
        </TouchableOpacity>
    );
};

const styles = {
    container: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        position: "absolute",
        padding: 10,
        borderRadius: 110,
        bottom: 100,
        right: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        width: 30,
        height: 30,
        resizeMode: "contain",
    },
};

export default Mode;
