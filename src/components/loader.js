import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Video from 'react-native-video';
import trader365Logo from '../assets/trader365Logo.mp4';
import theme from '../themes/theme';

export default function Loader() {
  const [loadingText, setLoadingText] = useState('Loading');

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
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <View style={{ backgroundColor: 'black', width: 80, height: 80, justifyContent: 'center', alignItems: 'center', borderColor: theme.primaryColor, borderWidth: 1, borderRadius: 10 }}>
        <Video
          source={trader365Logo}
          style={{ width: 70, height: 70 }}
          resizeMode="contain"
          repeat={true}
          muted={true}
          rate={2.3}
        />
      </View>
      {/* <Text style={styles.modalText}>{loadingText}</Text> */}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
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