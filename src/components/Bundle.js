import React, { useContext, memo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { lockicon } from '../assets/images';
import { ThemeContext } from '../context/ThemeProvider';
import OptimizedImage from './OptimizedImage';

const Bundle = ({ imageSource, title, description, locked, onPress, type }) => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.thumbnailWrapper}>
        <OptimizedImage 
          uri={imageSource?.uri || imageSource} 
          style={styles.thumbnail} 
          borderRadius={15}
          showLoadingIndicator={true}
          loadingIndicatorColor="rgba(255, 255, 255, 0.7)"
        />

        {/* Top Left - Type Label */}
        <View style={styles.audioLabel}>
          <Text style={styles.audioLabelText}>{type?.toUpperCase() || 'CONTENT'}</Text>
        </View>

        {/* Bottom Left - Time */}
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>15 min</Text>
        </View>

        {/* Lock Icon */}
        {locked && (
          <View style={styles.lock}>
            <Image source={lockicon} style={styles.lockIcon} />
          </View>
        )}
      </View>

      {/* Text Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (theme) => StyleSheet.create({
  card: {
    width: 160,
    marginRight: 12,
    overflow: 'hidden',
  },
  thumbnailWrapper: {
    position: 'relative',
  },
  thumbnail: {
    borderRadius: 15,
    width: 160,
    height: 140,
    resizeMode: 'cover',
  },
  audioLabel: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(84, 175, 211, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  audioLabelText: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Inter-Medium',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(114, 178, 216, 0.55)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  durationText: {
    fontSize: 9,
    color: '#fff',
    fontFamily: 'Inter-Medium',
  },
  lock: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ffffff33',
    padding: 4,
    borderRadius: 6,
  },
  lockIcon: {
    width: 15,
    height: 15,
    resizeMode:"contain",
    tintColor: '#fff',
  },
  content: {
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.textColor,
  },
  description: {
    fontSize: 9,
    color: theme.subTextColor || '#aaa',
    marginTop: 2,
  },
});

export default memo(Bundle);
