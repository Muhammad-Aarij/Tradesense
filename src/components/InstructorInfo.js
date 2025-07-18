import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  Modal,
  Image,
  Linking,
} from 'react-native';
import { ThemeContext } from '../context/ThemeProvider';
import {
  facebook,
  instagram,
  linkedin,
  twitter,
  userDefault,
} from '../assets/images';

const { width, height } = Dimensions.get('window');

const getSocialIcon = (platform) => {
  switch (platform) {
    case 'facebook':
      return facebook;
    case 'instagram':
      return instagram;
    case 'linkedin':
      return linkedin;
    case 'twitter':
      return twitter;
    default:
      return linkedin;
  }
};

const InstructorInfo = ({
  isVisible,
  onClose,
  InstructorImage,
  InstructorTag,
  InstructorName,
  message,
  instructorLinks = {},
  position = 'center',
  maxWidth = width * 0.8,
}) => {
  const { theme } = useContext(ThemeContext);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    const animations = isVisible
      ? [
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]
      : [
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 200,
          useNativeDriver: true,
        }),
      ];

    Animated.parallel(animations).start();
  }, [isVisible]);

  const getPositionStyle = () => {
    switch (position) {
      case 'left':
        return { alignSelf: 'flex-start' };
      case 'right':
        return { alignSelf: 'flex-end' };
      case 'center':
      default:
        return { alignSelf: 'center' };
    }
  };

  if (!isVisible) return null;

  return (
    <Modal transparent visible={isVisible} animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <Animated.View
          style={[
            styles.infoBox,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
              backgroundColor: '#080E17',
              borderColor: '#333333',
              maxWidth,
              ...getPositionStyle(),
            },
          ]}
        >
          {/* Instructor details */}
          <View style={styles.content}>
            <View style={styles.artistInfo}>
              <Image
                source={InstructorImage ? { uri: InstructorImage } : userDefault}
                style={styles.artistImage}
              />
              <View>
                <Text style={styles.artistName}>{InstructorName || 'Unknown'}</Text>
                <Text style={styles.artistRole}>{InstructorTag || 'Instructor'}</Text>
              </View>
            </View>

            <Text style={[styles.message, { color: '#CCCCCC' }]}>
              {message}
            </Text>

            <View style={styles.socialLinksRow}>
              {Object.entries(instructorLinks).map(([platform, url]) => {
                console.log('Platform:', platform, 'URL:', url); // 👈 Log platform and link
                return url ? (
                  <TouchableOpacity
                    key={platform}
                    onPress={() => Linking.openURL(url)}
                    style={styles.iconButton}
                  >
                    <Image source={getSocialIcon(platform)} style={styles.socialIcon} />
                  </TouchableOpacity>
                ) : null;
              })}
            </View>

          </View>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  infoBox: {
    borderRadius: 16,
    borderWidth: 1,
    elevation: 12,
    position: 'relative',
    minWidth: 250,
  },
  content: {
    padding: 20,
    paddingBottom: 12,
  },
  artistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  artistImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#666',
  },
  artistName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  artistRole: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  message: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
    marginBottom: 16,
  },
  socialLinksRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  iconButton: {
    padding: 5,
  },
  socialIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
    // tintColor: '#CCCCCC',
  },
  closeButton: {
    alignSelf: 'center',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 8,
    width: 200,
    backgroundColor: '#70C2E8',
    borderWidth: 1,
    marginBottom: 20,
  },
  closeText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    color: '#FFFFFF',
  },
});

export default InstructorInfo;
