import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { ThemeContext } from '../context/ThemeProvider';

const SnackbarMessage = ({ visible, message, type = 'success' }) => {
  const { theme, isDarkMode } = useContext(ThemeContext);
  const styles = useMemo(() => getStyles(theme, isDarkMode, type), [theme, isDarkMode, type]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container]}>
      <Text style={styles.text}>{message}</Text>
      {/*  */}
    </Animated.View>
  );
};

const getStyles = (theme, isDarkMode, type) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 30,
      left: 20,
      right: 20,
      padding: 14,
      borderRadius: 10,
      zIndex: 1000,
      backgroundColor:
        type === 'message'
          ? isDarkMode
            ? '#FFFFFF'
            : theme.darkBlue
          : type === 'error'
          ? '#F44336'
          : '#4CAF50',
    },
    text: {
      color:
        type === 'message'
          ? isDarkMode
            ? theme.darkBlue
            : '#FFFFFF'
          : '#FFFFFF',
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      textAlign: 'center',
    },
  });

export default SnackbarMessage;
