import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import { noThumbnail } from '../assets/images';

const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '';
  const words = name.trim().split(' ');
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

const OptimizedImage = ({
  uri,
  style,
  containerStyle,
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
  secureImage = true,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const secureUri = useMemo(() => {
    if (!uri) return null;
    return secureImage && uri.startsWith('http://')
      ? uri.replace('http://', 'https://')
      : uri;
  }, [uri, secureImage]);

  const initials = useMemo(() => getInitials(username), [username]);

  const isUriValid = typeof secureUri === 'string' && secureUri.trim() !== '';

  const handleLoad = useCallback(() => {
    console.log('Image loaded');
    setIsLoading(false);
    setHasError(false);
    setImageLoaded(true);
    if (onLoad) onLoad();
  }, [onLoad]);


  const handleError = useCallback((error) => {
    setIsLoading(false);
    setHasError(true);
    setImageLoaded(false);
    if (onError) onError(error);
  }, [onError]);

  // Reset states when URI changes
  React.useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setImageLoaded(false);
  }, [secureUri]);

  // For avatars, prioritize initials over fallback image
  const shouldShowFallback = !isUriValid || (hasError && !isAvatar);
  const shouldShowInitials = isAvatar && showInitials && initials && (!imageLoaded || hasError || !isUriValid);
  const shouldShowLoading = isLoading && showLoadingIndicator && !shouldShowInitials;

  return (
    <View style={[style, { borderRadius }, containerStyle]}>
      {/* Only show FastImage if we have a valid URI and it's not an avatar with error */}
      {isUriValid && !shouldShowInitials && (
        <FastImage
          source={{ uri: secureUri }}
          style={[StyleSheet.absoluteFillObject, { borderRadius }]}
          resizeMode={resizeMode}
          onLoad={handleLoad}
          onLoadEnd={() => setIsLoading(false)}

          onError={handleError}
          {...props}
        />
      )}

      {/* Show fallback image only for non-avatar images or when no initials are available */}
      {shouldShowFallback && !shouldShowInitials && (
        <FastImage
          source={fallbackSource}
          style={[StyleSheet.absoluteFillObject, { borderRadius }]}
          resizeMode={resizeMode}
          onLoad={handleLoad}
          onLoadEnd={() => setIsLoading(false)}

          onError={handleError}
          {...props}
        />
      )}

      {/* Initials Fallback - Priority for avatars */}
      {shouldShowInitials && (
        <View style={[styles.initialsContainer, { borderRadius }, initialsStyle]}>
          <Text style={[styles.initialsText, initialsStyle.text]}>
            {initials}
          </Text>
        </View>
      )}

      {/* Loading Indicator */}
      {shouldShowLoading && (
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
    backgroundColor: 'rgba(29, 172, 255, 0.15)',
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
