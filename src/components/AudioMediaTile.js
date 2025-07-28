import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { m, play2, lock } from '../assets/images'; // Add a lock icon if needed
import { useNavigation } from '@react-navigation/native';
import OptimizedImage from './OptimizedImage';

const AudioMediaTile = ({
  imageSource,
  title,
  title2,
  duration,
  description,
  url,
  locked = false,
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('TrackPlayer', {
          AudioTitle: title,
          AudioDescr: description,
          Thumbnail: imageSource?.uri || imageSource,
          AudioUrl: url,
          shouldFetchTrack: true,

        })
      }
    >
      <ImageBackground
        source={m}
        style={styles.background}
        imageStyle={{ borderRadius: 10 }}
      >
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {title2} · {duration}
          </Text>
        </View>

        <Image source={play2} style={styles.audioIcon} />


      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 100,
    marginHorizontal: 25,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#1B1B1B',
    marginBottom: 15,
  },
  background: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  content: {
    padding: 8,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Outfit-Regular',
    color: '#fff',
    textTransform: "uppercase",
  },
  description: {
    fontSize: 12,
    fontFamily: 'Outfit-Light-BETA',
    color: '#fff',
    marginTop: 2,
  },
  audioIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  lock: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#00000088',
    padding: 4,
    borderRadius: 4,
  },
  lockIcon: {
    width: 12,
    height: 12,
    tintColor: '#fff',
  },
});

export default AudioMediaTile;
