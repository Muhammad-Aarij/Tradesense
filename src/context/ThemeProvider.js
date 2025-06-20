import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import theme from "../themes/theme";
import { bg, whiteBg } from "../assets/images";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [goalImages, setGoalImages] = useState(true);
  const [areaImages, setAreaImages] = useState(true);
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  useEffect(() => {
    const fetchThemeConfig = async () => {
      try {
        const response = await axios.get(`https://trade-sense-app-backend.onrender.com/api/config`);
        const config = response?.data;

        setIsDarkMode(config?.theme?.toLowerCase() !== "light");
        setGoalImages(config?.goalImages ?? true);
        setAreaImages(false);

        console.log("theme configured:");
        setIsConfigLoaded(true);
      } catch (err) {
        console.error("Failed to fetch theme config:", err);
        setIsConfigLoaded(true); // fallback to defaults
      }
    };

    fetchThemeConfig();
  }, []);

  const currentTheme = {
    ...theme,
    textColor: isDarkMode ? "#FFFFFF" : "#000000",
    bg: isDarkMode ? bg : whiteBg,
    borderColor: isDarkMode ? "#272e36" : "#cacaca",
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
