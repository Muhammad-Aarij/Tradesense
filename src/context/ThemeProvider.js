import React, { createContext, useState } from "react";
import theme from "../themes/theme";
import { bg, whiteBg } from "../assets/images";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => setIsDarkMode((prev) => !prev);

    const currentTheme = {
        ...theme,
        textColor: isDarkMode ? "#FFFFFF" : "#000000", // Dynamically update text color
        bg: isDarkMode ? bg : whiteBg,
        borderColor: isDarkMode ? '#272e36' : "#d4d4d4",
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme: currentTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
