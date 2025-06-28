import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageBackground } from 'react-native';
import { m, play2 } from '../assets/images';

const AudioMediaTile = ({ imageSource, title, title2, duration, locked }) => {
  return (
    <TouchableOpacity style={styles.card}>
      <ImageBackground source={m} style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 25, }}>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>

          <Text style={styles.description} numberOfLines={2}>{title2} . {duration}</Text>
        </View>
        <Image source={play2} style={styles.audioIcon} />
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "auto",
    height: 100,

    marginHorizontal: 25,
    borderRadius: 10,
    backgroundColor: '#1B1B1B',
    overflow: 'hidden',
    borderWidth: 0.6,
    borderColor: '#555',
  },
  thumbnail: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  overlayIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#ffffffcc',
    borderRadius: 20,
    padding: 4,
  },
  audioIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  content: {
    padding: 8,
  },
  title: {
    fontSize: 17,
    fontFamily: 'Inter-Regular',
    color: '#fff',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Light-BETA',
    color: '#fff',
    marginTop: 2,
  },
  lock: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#fff2',
    padding: 3,
    borderRadius: 4,
  },
  lockIcon: {
    width: 10,
    height: 10,
    tintColor: '#fff',
  },
});

export default AudioMediaTile;
