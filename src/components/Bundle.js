import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { lockicon, audioicon } from '../assets/images'; // Adjust path as needed

const Bundle = ({ imageSource, title, description, locked, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.thumbnailWrapper}>
        <Image source={imageSource} style={styles.thumbnail} />

        {/* Top Left - Audio Label */}
        <View style={styles.audioLabel}>
          <Text style={styles.audioLabelText}>Meditation</Text>
        </View>

        {/* Bottom Left - Time */}
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>15 min</Text>
        </View>

        {/* Optional Lock Icon */}
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

const styles = StyleSheet.create({
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
    backgroundColor:'rgba(84, 175, 211, 0.8)',
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
    width: 10,
    height: 10,
    tintColor: '#fff',
  },
  content: {
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  description: {
    fontSize: 9,
    color: '#aaa',
    marginTop: 2,
  },
});

export default Bundle;
