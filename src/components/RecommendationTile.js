import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { video2, lockicon, audio2, videoIcon } from '../assets/images';
import theme from '../themes/theme';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');
const cardWidth = width * 0.42;

const RecommendationTile = ({ title, description, type, onPress, lock, thumbnail, url }) => {
  const navigation = useNavigation();
  const handlePress = () => {
    if (type === 'audio') {
      navigation.navigate('TrackPlayer', {
        AudioTitle: title,
        AudioDescr: description,
        Thumbnail: thumbnail,
        AudioUrl: url,
        shouldFetchTrack: false,
      });
    } else if (type === 'video') {
      navigation.navigate('VideoPlayer', {
        VideoTitle: title,
        VideoDescr: description,
        Thumbnail: thumbnail,
        VideoUrl: url,
      });
    }
  };
  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
        <View style={styles.shadowOverlay} />
        <View style={styles.overlayIcon}>
          <Image
            source={type === 'audio' ? audio2 : videoIcon} // 👈 switch icon based on type
            style={{ width: 15, height: 15, resizeMode: "contain" }}
          />
          <Text style={{
            fontSize: 9,
            fontFamily: "Inter-Medium",
            color: 'rgba(255, 255, 255, 0.64)',
            borderRadius: 10,
          }}>
            {type}
          </Text>
        </View>

      </View>
      <View style={styles.content}>
        <View style={{ width: "80%" }}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.descr} numberOfLines={2}>
            {description}
          </Text>
        </View>
        {lock && (
          <View style={styles.lockWrapper}>
            <Image source={lockicon} style={styles.lockIcon} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    height: 168,
    borderWidth: 0.9,
    borderRadius: 12,
    borderColor: theme.borderColor,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
    // marginRight: 8,
  },
  shadowOverlay: {
    position: 'absolute',
    bottom: 0,
    height: "100%",
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.36)',
  },
  imageWrapper: {
    borderRadius: 12,
    width: '100%',
    height: cardWidth * 0.65,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  overlayIcon: {
    flexDirection: "row",
    gap: 5,
    position: 'absolute',
    justifyContent: "center",
    bottom: 6,
    paddingVertical: 3,
    paddingHorizontal: 5,
    left: 6,
    borderWidth: 0,
    backgroundColor: 'rgba(70, 70, 70, 0.66)',
    borderRadius: 20,
    // padding: 4,
  },
  audioIcon: {
    width: 14,
    height: 14,
    tintColor: '#000',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
    width: '100%',
  },
  title: {
    color: theme.textColor,
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  descr: {
    color: 'rgb(214, 214, 214)',
    fontSize: 10,
    fontFamily: 'Inter-Light-BETA',
    paddingHorizontal: 8,
    paddingBottom: 6,
  },
  lockWrapper: {
    borderWidth: 0.7,
    borderRadius: 2,
    padding: 5,
    borderColor: theme.borderColor,
  },
  lockIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
});

export default RecommendationTile;
