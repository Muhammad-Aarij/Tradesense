import React, { createContext, useEffect, useState } from "react";
import { Appearance } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import theme from "../themes/theme";
import { bg, whiteBg } from "../assets/images";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = Appearance.getColorScheme(); // dark | light
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [goalImages, setGoalImages] = useState(true);
  const [areaImages, setAreaImages] = useState(true);
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);

  const STORAGE_KEY = "appThemeMode";

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem(STORAGE_KEY, newMode ? 'dark' : 'light');
  };

  const loadStoredTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setIsDarkMode(saved === 'dark');
      }
    } catch (err) {
      console.warn("Failed to load stored theme:", err);
    }
  };

  useEffect(() => {
    const initTheme = async () => {
      await loadStoredTheme(); // This will override system if user selected
      try {
        const response = await axios.get(`https://trade-sense-app-backend.onrender.com/api/config`);
        const config = response?.data;

        // Theme from backend is optional, fallback to local
        setGoalImages(config?.goalImages ?? true);
        setAreaImages(false);

        setIsConfigLoaded(true);
      } catch (err) {
        console.error("Failed to fetch theme config:", err);
        setIsConfigLoaded(true);
      }
    };

    initTheme();
  }, []);

  const currentTheme = {
    ...theme,
    mode: isDarkMode ? "dark" : "light",
    textColor: isDarkMode ? "#FFFFFF" : "#000000",
    bg: isDarkMode ? bg : whiteBg,
    bw: isDarkMode ? "#FFFFFF" : "#000000",
    tabBg: isDarkMode ? "rgba(11, 16, 22, 0.9)" : "#FFFFFF",
    subTextColor: isDarkMode ? "#C4C7C9" : "#5a5a5a",
    borderColor: isDarkMode ? "#272e36" : "#d4d4d4",
    transparentBg: isDarkMode ? "rgba(255, 255, 255, 0.06)" : "#e3e3e3",
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        theme: currentTheme,
        goalImages,
        areaImages,
      }}
    >
      {isConfigLoaded ? children : null}
    </ThemeContext.Provider>
  );
};
