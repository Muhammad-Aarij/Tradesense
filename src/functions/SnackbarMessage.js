import React, { useEffect, useContext } from 'react';
import Snackbar from 'react-native-snackbar';
import { ThemeContext } from '../context/ThemeProvider';

const SnackbarMessage = ({
  visible,
  message,
  type = 'success',
  duration = Snackbar.LENGTH_SHORT, // Default duration
}) => {
  const { theme, isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    if (visible && message) {
      Snackbar.show({
        text: message,
        duration,
        // fontFamily:"Oufit-Bold",
        backgroundColor:
          type === 'error'
            ? '#F44336'
            : type === 'message'
            ? isDarkMode
              ? '#FFFFFF'
              : theme.darkBlue
            : '#4CAF50',
        textColor:
          type === 'message'
            ? isDarkMode
              ? theme.darkBlue
              : '#FFFFFF'
            : '#FFFFFF',
      });
    } else {
      Snackbar.dismiss();
    }
  }, [visible, message, type, isDarkMode, theme, duration]);

  return null; // Nothing to render
};

export default SnackbarMessage;
