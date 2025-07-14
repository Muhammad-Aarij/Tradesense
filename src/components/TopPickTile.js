import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageBackground } from 'react-native';
import { lockicon, audioicon, audio2, videoIcon, audioNew, videoNew } from '../assets/images'; // Update path as needed
import theme from '../themes/theme';
import { useNavigation } from '@react-navigation/native';
import OptimizedImage from './OptimizedImage';

const TopPickTile = ({ imageSource, title, description, locked, onPress, url, type }) => {
    const navigation = useNavigation();
    const handlePress = () => {
        if (type === 'audio') {
            navigation.navigate('TrackPlayer', {
                AudioTitle: title,
                AudioDescr: description,
                Thumbnail: imageSource,
                AudioUrl: url,
                shouldFetchTrack: false,
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
                {/* Bottom inset shadow */}
                <View style={styles.shadowOverlay} />

                {/* Bottom-aligned content */}
                <View style={{
                    flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", paddingHorizontal: 10, backgroundColor: 'rgba(0, 0, 0, 0.4)', paddingTop: 10,
                }}>
                    <View style={styles.bottomContent}>
                        <Text style={{
                            paddingHorizontal: 10, paddingVertical: 2, fontSize: 9, fontFamily: "Inter-Medium", color: "white", backgroundColor: 'rgba(0, 0, 0, 0.44)', borderRadius: 10,marginBottom: 5
                        }}>15 min</Text>
                        <Text style={styles.title} numberOfLines={1}>{title}</Text>
                        <Text style={styles.description} numberOfLines={2}>{description}</Text>
                    </View>
                    {/* {locked && ( */}
                    <View style={styles.lockWrapper}>
                        <Image source={lockicon} style={styles.lockIcon} />
                    </View>
                    {/* )} */}
                </View>

                {/* Audio Icon Overlay */}
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
                {/* Lock Icon (only if locked) */}
            </View>
        </TouchableOpacity >
    );
};

const styles = StyleSheet.create({
    card: {
        width: 180,
        height: 160,
        marginRight: 8,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#1B1B1B',
        borderWidth: 0.6,
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        position: 'relative',
    },
    imageStyle: {
        resizeMode: 'cover',
    },
    shadowOverlay: {
        position: 'absolute',
        bottom: 0,
        height: "100%",
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    bottomContent: {
        // borderWidth: 2,
        width: "75%",
        // paddingVertical: 10,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        // position: 'absolute',
        // bottom: 8,
        // left: 8,
        // right: 8,
        borderRadius: 10,
    },
    title: {
        fontFamily: "Inter-Medium",
        fontSize: 10,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 5,
    },
    description: {
        fontFamily: "Inter-Regular",
        fontSize: 9,
        color: '#fff',
        // marginTop: 2,
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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

export default memo(TopPickTile);
