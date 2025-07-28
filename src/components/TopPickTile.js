import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageBackground } from 'react-native';
import { lockicon, audioicon, audio2, videoIcon, audioNew, videoNew } from '../assets/images'; // Update path as needed
import theme from '../themes/theme';
import { useNavigation } from '@react-navigation/native';
import OptimizedImage from './OptimizedImage';

const TopPickTile = ({ imageSource, title, description, locked, onPress, url, type, duration, pillar }) => {
    const navigation = useNavigation();
    const handlePress = () => {
        if (type === 'audio') {
            navigation.navigate('TrackPlayer', {
                AudioTitle: title,
                AudioDescr: description,
                Thumbnail: imageSource,
                AudioUrl: url,
                shouldFetchTrack: true,
            });
        } else if (type === 'video') {
            navigation.navigate('VideoPlayer', {
                VideoTitle: title,
                VideoDescr: description,
                Thumbnail: imageSource,
                VideoUrl: url,
            });
        }
    };
    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
            <View style={styles.imageBackground}>
                <OptimizedImage
                    uri={imageSource}
                    style={StyleSheet.absoluteFillObject}
                    borderRadius={10}
                    showLoadingIndicator={true}
                    loadingIndicatorColor="rgba(255, 255, 255, 0.7)"
                />
                {/* Shadow Overlay - This should be *below* the content you want visible */}
                <View style={styles.shadowOverlay} />

                {/* Bottom-aligned content - This entire View needs to be above the overlay */}
                <View style={{
                    marginBottom: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    paddingHorizontal: 10,
                    paddingBottom: 5,
                    zIndex: 2, // Ensure this content is above the overlay (zIndex: 1)
                }}>
                    <View style={styles.bottomContent}>
                        <View style={{ flexDirection: "row", backgroundColor: 'rgba(199, 199, 199, 0.38)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginBottom: 5, alignItems: "center", }}>
                            <Image
                                source={type === 'audio' ? audioNew : videoNew}
                                style={{ width: 10, height: 10, resizeMode: "contain", marginRight: 5, tintColor: "white" }}
                            />
                            <Text style={{
                                fontSize: 9, fontFamily: "Outfit-Medium", color: "white",
                            }}>{duration} min | {pillar}</Text>
                        </View>
                        <Text style={styles.title} numberOfLines={1}>{title}</Text>
                        <Text style={styles.description} numberOfLines={2}>{description}</Text>
                    </View>
                    {locked && ( // Only render lockWrapper if locked is true
                        <View style={styles.lockWrapper}>
                            <Image source={lockicon} style={styles.lockIcon} />
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity >
    );
};

const styles = StyleSheet.create({
    card: {
        width: 180,
        height: 160,
        // marginRight: 8,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 0.6,
        borderColor: 'rgba(255,255,255,0.2)' // Add a default border color to see it
    },
    imageBackground: {
        flex: 1,
        backgroundColor: '#1B1B1B',
        justifyContent: 'flex-end',
        position: 'relative',
    },
    imageStyle: {
        resizeMode: 'cover',
    },
    shadowOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        // zIndex: 1, // Removed this zIndex, or set to 1 if content is zIndex 2
        borderRadius: 10,
    },
    bottomContent: {
        width: "75%",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        // Positioned by parent View's flex properties
        // zIndex: 100, // No longer needed here if parent has zIndex
    },
    title: {
        fontFamily: "Outfit-Medium",
        fontSize: 10,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 5,
        // zIndex: 100, // Redundant if parent is correctly zIndexed
    },
    description: {
        fontFamily: "Outfit-Regular",
        fontSize: 9,
        color: '#fff',
    },
    // Removed unused overlayIcon styles and commented out block
    lockWrapper: {
        borderWidth: 0.7,
        borderRadius: 2,
        padding: 5,
        borderColor: theme.borderColor || 'rgba(255,255,255,0.5)', // Added a fallback for theme.borderColor
        backgroundColor: 'rgba(0,0,0,0.5)', // Added background to lock wrapper for better visibility
    },
    lockIcon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },
});

export default memo(TopPickTile);