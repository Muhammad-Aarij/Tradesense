import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { video2, lockicon } from '../assets/images';
import theme from '../themes/theme';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.45;

const RecommendationTile = ({ title, description, isCenter, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageWrapper}>
        <Image source={video2} style={styles.thumbnail} />
      </View>
      <View style={styles.content}>
        <View>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.descr} numberOfLines={2}>
            {description}
          </Text>
        </View>
        {isCenter && (
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
    height: 160,
    borderWidth: 0.7,
    borderRadius: 12,
    borderColor: theme.borderColor,
    backgroundColor: theme.transparentBg,
    overflow: 'hidden',
    // marginRight: 8,
  },
  imageWrapper: {
    width: '100%',
    height: cardWidth * 0.5625,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
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
    paddingRight: 18,
    width: '100%',
  },
  title: {
    color: theme.textColor,
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  descr: {
    color: 'rgb(161, 161, 161)',
    fontSize: 9,
    fontFamily: 'Inter-Light-BETA',
    paddingHorizontal: 10,
    paddingBottom: 4,
  },
  lockWrapper: {
    borderWidth: 0.7,
    borderRadius: 2,
    padding: 3,
    borderColor: theme.borderColor,
  },
  lockIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
});

export default RecommendationTile;
