import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Video from 'react-native-video';
import trader365Logo from '../assets/trader365Logo.mp4';

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
      <View style={styles.modalView}>
        <Video
          source={trader365Logo}
          style={{ width: 100, height: 100 }}
          resizeMode="contain"
          repeat={true}
          muted={true}
          rate={1}
        />
        {/* <Text style={styles.modalText}>{loadingText}</Text> */}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({ container: { justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 10, }, modalText: { textAlign: 'center', fontWeight: 'bold', color: 'black', marginTop: 10, fontSize: 16, width: 110, }, modalView: { alignItems: 'center', width: 100, height: 100, backgroundColor: 'black', borderRadius: 100, }, });