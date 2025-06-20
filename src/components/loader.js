import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image } from 'react-native';
import spinner from '../assets/Spinner.gif'
import FastImage from 'react-native-fast-image';


export default function Loader() {
  const [loadingText, setLoadingText] = useState('Loading');

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText(prevText => {
        const dotCount = (prevText.match(/\./g) || []).length;
        return dotCount < 3 ? prevText + '.' : 'Loading';
      });
    }, 500); // Adjust the interval time as needed

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <View style={styles.modalView}>
        <FastImage style={{ opacity: 0.7, width: 170, height: 190 }} source={spinner} />
        <Text style={styles.modalText}>{loadingText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.2)',
    // backgroundColor:"red",
    zIndex: 10,
  },
  modalText: {
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: "bold",
    color: "black",
    marginBottom: "8%",
    width: 110, // Set a fixed width for the text container
    // borderWidth:2,
    // borderColor: "#33cc66",
  },

  modalView: {
    margin: 80,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

})