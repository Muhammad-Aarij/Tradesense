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
    console.log('OptimizedImage error:', error, 'URI:', uri);
    if (onError) onError(error);
  };

  // Ensure HTTPS for iOS App Transport Security
  const secureUri = uri?.startsWith('http://') ? uri.replace('http://', 'https://') : uri;

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
      
      {isLoading && showLoadingIndicator && (
        <View style={[styles.loadingContainer, { borderRadius }]}>
          <ActivityIndicator size="small" color={loadingIndicatorColor} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});

export default OptimizedImage; 