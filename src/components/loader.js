import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Easing,
  ImageSourcePropType,
} from 'react-native';
import spinner from '../assets/Time.png';

export default function Loader() {
  const [loadingText, setLoadingText] = useState('Loading');
  const rotation = useRef(new Animated.Value(0)).current;
  const angleRef = useRef(0); // 0 → 90 → 180 → 270 → 0

  // Step-wise rotation every 0.5s
  useEffect(() => {
    const interval = setInterval(() => {
      angleRef.current = (angleRef.current + 90) % 360;
      Animated.timing(rotation, {
        toValue: angleRef.current,
        duration: 200, // quick rotation
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Dot animation
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setLoadingText(prev => {
        const dots = (prev.match(/\./g) || []).length;
        return dots < 3 ? prev + '.' : 'Loading';
      });
    }, 500);

    return () => clearInterval(dotInterval);
  }, []);

  // Map angle (0-360) to string rotation
  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 90, 180, 270, 360],
    outputRange: ['0deg', '90deg', '180deg', '270deg', '360deg'],
  });

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <View style={styles.modalView}>
        <Animated.Image
          source={spinner }
          style={[
            {
              width: 100,
              height: 110,
              resizeMode: 'contain',
              transform: [{ rotate: rotateInterpolate }],
            },
          ]}
        />
        <Text style={styles.modalText}>{loadingText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
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
  modalView: {
    alignItems: 'center',
  },
});
