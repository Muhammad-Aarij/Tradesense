import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';

const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

const ProfileImage = ({
    uri,
    name,
    size = 44,
    borderRadius = 22,
    style,
    textStyle,
    loadingIndicatorColor = 'transparent',
    backgroundColor = 'rgba(29, 172, 255, 0.15)',
    borderColor = 'rgba(29, 172, 255, 0.3)',
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const initials = useMemo(() => getInitials(name), [name]);

    const showInitials = !imageLoaded || hasError;

    const secureUri = useMemo(() => {
        if (!uri) return null;
        return uri.startsWith('http://') ? uri.replace('http://', 'https://') : uri;
    }, [uri]);

    return (
        <View
            style={[
                {
                    width: size,
                    height: size,
                    borderRadius,
                    overflow: 'hidden',
                    backgroundColor,
                    borderWidth: 1,
                    borderColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                style,
            ]}
        >
            {showInitials && initials && (
                <Text
                    style={[
                        {
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: '#1DACFF',
                            fontFamily: 'Outfit-Bold',
                        },
                        textStyle,
                    ]}
                >
                    {initials}
                </Text>
            )}

            {secureUri && (
                <FastImage
                    source={{
                        uri: `http://13.61.22.84/${uri}`
                    }}
                    style={StyleSheet.absoluteFillObject}
                    resizeMode={FastImage.resizeMode.cover}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setHasError(true)}
                />
            )}

            {!imageLoaded && !hasError && (
                <View style={StyleSheet.absoluteFillObject}>
                    <ActivityIndicator
                        size="small"
                        color={loadingIndicatorColor}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    />
                </View>
            )}
        </View>
    );
};

export default ProfileImage;
