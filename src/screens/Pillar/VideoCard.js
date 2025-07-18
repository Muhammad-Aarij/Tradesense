import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { video1 } from '../../assets/images';
import { ThemeContext } from '../../context/ThemeProvider';
import theme from '../../themes/theme';

const { width } = Dimensions.get('window');
const cardWidth = (width - 20 * 3 ) / 2; // (Screen width - 2*padding - 1*spacing) / 2

const VideoCard = ({ title, decription, imageSource, onPress, style }) => {

  const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
  const styles = getStyles(theme);

  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress}>
      <View style={styles.imageWrapper}>
        <Image source={imageSource ? { uri: imageSource } : video1} style={styles.thumbnail} />
      </View>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <Text style={styles.descr} numberOfLines={2}>{decription}</Text>
    </TouchableOpacity>
  );
};

const getStyles = (theme) => StyleSheet.create({
    card: {
      width: cardWidth, // Responsive width
      borderWidth: 0.7,
      borderColor: theme.borderColor,
      backgroundColor: theme.transparentBg,
      borderRadius: 12,
      // marginRight: 10,
      overflow: 'hidden',
      // marginBottom: 5,
    },
    imageWrapper: {
      width: 'auto',
      height: cardWidth * 0.5625, // 16:9 aspect ratio for video thumbnail
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden', // Ensure corners are respected
    },
    thumbnail: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject, // Covers the entire imageWrapper
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)', // Slight overlay
    },
    playButton: {
      backgroundColor: 'rgba(0,0,0,0.7)',
      borderRadius: 30,
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    playIcon: {
      width: 25,
      height: 25,
      resizeMode: 'contain',
      tintColor: '#FFFFFF',
    },
    durationBadge: {
      position: 'absolute',
      bottom: 8,
      right: 8,
      backgroundColor: 'rgba(0,0,0,0.7)',
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    durationText: {
      color: theme.textColor,
      fontSize: 10,
      fontFamily: "Inter-Regular",
    },
    title: {
      color: theme.textColor,
      fontSize: 12,
      fontFamily: "Inter-Regular",
      paddingHorizontal: 10,
      paddingTop: 8, // Adjust spacing
    },
    descr: {
      color: "rgb(161, 161, 161)",
      fontSize: 12,
      fontFamily: "Inter-Light-BETA",
      paddingHorizontal: 10,
      paddingBottom: 8, // Adjust spacing
    },
});

export default VideoCard;
