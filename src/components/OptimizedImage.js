import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import { noThumbnail } from '../assets/images';

const OptimizedImage = ({
  uri,
  style,
  fallbackSource = noThumbnail,
  showLoadingIndicator = true,
  loadingIndicatorColor = '#6B6B6B',
  borderRadius = 0,
  resizeMode = FastImage.resizeMode.cover,
  onLoad,
  onError,
  isAvatar = false,
  username = '',
  showInitials = true,
  initialsStyle = {},
  secureImage = true, // ✅ NEW PROP
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    if (onLoad) onLoad();
  };

  const handleError = (error) => {
    setIsLoading(false);
    setHasError(true);
    if (onError) onError(error);
  };

  // ✅ Apply HTTPS only if secureImage is true
  const secureUri = secureImage && uri?.startsWith('http://')
    ? uri.replace('http://', 'https://')
    : uri;

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(username);

  return (
    <View style={[style, { borderRadius }]}>
      <FastImage
        source={hasError ? fallbackSource : { uri: secureUri }}
        style={[StyleSheet.absoluteFillObject, { borderRadius }]}
        resizeMode={resizeMode}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />

      {/* Initials fallback */}
      {isAvatar && showInitials && (isLoading || hasError) && initials && (
        <View style={[styles.initialsContainer, { borderRadius }, initialsStyle]}>
          <Text style={[styles.initialsText, initialsStyle.text]}>
            {initials}
          </Text>
        </View>
      )}

      {/* Loading indicator */}
      {isLoading && showLoadingIndicator && !(isAvatar && showInitials && initials) && (
        <View style={[styles.loadingContainer, { borderRadius }]}>
          <ActivityIndicator size="small" color={loadingIndicatorColor} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  initialsContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(29, 172, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(29, 172, 255, 0.3)',
  },
  initialsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1DACFF',
    fontFamily: 'Outfit-Bold',
  },
});

export default OptimizedImage;
