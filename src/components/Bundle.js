import React, { useContext, memo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { audioNew, lockicon, videoNew } from '../assets/images';
import { ThemeContext } from '../context/ThemeProvider';
import OptimizedImage from './OptimizedImage';

const Bundle = ({ imageSource, title, description, locked, onPress, type, duration }) => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.thumbnailWrapper}>
        <OptimizedImage
          uri={imageSource?.uri || imageSource}
          style={styles.thumbnail}
          borderRadius={10}
          showLoadingIndicator={true}
          loadingIndicatorColor="rgba(255, 255, 255, 0.7)"
        />
        <View style={styles.shadowOverlay} />


        {/* Top Left - Type Label */}
        <View style={styles.overlayIcon}>
          <Image
            source={type === 'audio' ? audioNew : videoNew}
            style={{ width: 15, height: 15, resizeMode: "contain" }}
          />
          <Text style={{
            fontSize: 9,
            fontFamily: "Inter-Medium",
            color: 'rgba(255, 255, 255, 0.64)',
            borderRadius: 10,
          }}>
            {type === 'audio' ? 'Audio' : 'Video'}
          </Text>
        </View>

        {/* Bottom Left - Time */}
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{duration} </Text>
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
  shadowOverlay: {
    position: 'absolute',
    bottom: 0,
    height: "100%",
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 10,
  },
  thumbnail: {
    borderRadius: 10,
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
    textTransform: "capitalize",
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
    resizeMode: "contain",
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
  overlayIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    position: 'absolute',
    justifyContent: "center",
    top: 6,
    paddingVertical: 3,
    paddingHorizontal: 7,
    right: 6,
    borderWidth: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    // padding: 4,
  },
  audioIcon: {
    width: 14,
    height: 14,
    tintColor: '#000',
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

export default memo(Bundle);
