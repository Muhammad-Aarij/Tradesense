import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Video from 'react-native-video';
import trader365Logo from '../assets/trader365Logo.mp4';
import theme from '../themes/theme';
import lightLogo from '../assets/trader365LogoLight.mp4'
import { ThemeContext } from '../context/ThemeProvider';

export default function Loader() {
  const [loadingText, setLoadingText] = useState('Loading');
  const { theme, isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setLoadingText(prev => {
        const dots = (prev.match(/\./g) || []).length;
        return dots < 3 ? prev + '.' : 'Loading';
      });
    }, 500);

    return () => clearInterval(dotInterval);
  }, []);

  return (
    <>
      {
        isDarkMode ? < View style={[StyleSheet.absoluteFillObject, styles.container, { backgroundColor: "black" }]}>
          <View style={{ width: 80, height: 80, justifyContent: 'center', alignItems: 'center', borderColor: theme.primaryColor, borderWidth: 1, borderRadius: 10 }}>
            <Video
              source={trader365Logo}
              style={{ width: 72, height: 72, borderRadius: 15, overflow: "hidden" }}
              resizeMode="contain"
              repeat={true}
              muted={true}
              rate={2.3}
            />
          </View>
          {/* <Text style={styles.modalText}>{loadingText}</Text> */}
        </View >
          :
          <View style={[StyleSheet.absoluteFillObject, styles.container, { backgroundColor: "white" }]}>
            <View style={{ width: 80, height: 80, justifyContent: 'center', alignItems: 'center', borderColor: theme.primaryColor, borderWidth: 1, borderRadius: 10 }}>
              <Video
                source={lightLogo}
                style={{ width: 72, height: 72, borderRadius: 15, overflow: "hidden" }}
                resizeMode="contain"
                repeat={true}
                muted={true}
                rate={2.3}
              />
            </View>
            {/* <Text style={styles.modalText}>{loadingText}</Text> */}
          </View>
      }
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
    fontSize: 16,
    width: 110,
  },
});