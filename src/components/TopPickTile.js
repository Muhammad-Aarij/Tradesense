import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageBackground } from 'react-native';
import { lockicon, audioicon } from '../assets/images'; // Update path as needed
import theme from '../themes/theme';

const TopPickTile = ({ imageSource, title, description, locked, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <ImageBackground source={imageSource} style={styles.imageBackground} imageStyle={styles.imageStyle}>
                {/* Bottom inset shadow */}
                <View style={styles.shadowOverlay} />

                {/* Bottom-aligned content */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginRight: 5, alignItems: "center" }}>
                    <View style={styles.bottomContent}>
                        <Text style={{
                            paddingHorizontal: 10, paddingVertical: 2, fontSize: 9, fontFamily: "Inter-Medium", color: "white", backgroundColor: 'rgba(0, 0, 0, 0.44)', borderRadius: 10,
                        }}>15 min</Text>
                        <Text style={styles.title} numberOfLines={1}>{title}</Text>
                        <Text style={styles.description} numberOfLines={2}>{description}</Text>
                    </View>
                    {locked && (
                        <View style={styles.lock}>
                            <Image source={lockicon} style={styles.lockIcon} />
                        </View>
                    )}
                </View>

                {/* Audio Icon Overlay */}
                <View style={styles.overlayIcon}>
                    <Text style={{
                        paddingHorizontal: 8, paddingVertical: 1, fontSize: 9, fontFamily: "Inter-Medium", color: 'rgba(255, 255, 255, 0.64)', borderRadius: 10,
                    }}>Audio</Text>
                </View>

                {/* Lock Icon (only if locked) */}
            </ImageBackground>
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
        backgroundColor: 'rgba(0, 0, 0, 0.27)',
    },
    bottomContent: {
        // borderWidth: 2,
        width: "70%",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        // position: 'absolute',
        bottom: 8,
        left: 8,
        right: 8,
    },
    title: {
        fontFamily: "Inter-Medium",
        fontSize: 10,
        fontWeight: '600',
        color: '#fff',
    },
    description: {
        fontFamily: "Inter-Regular",
        fontSize: 9,
        color: '#fff',
        // marginTop: 2,
    },
    overlayIcon: {
        position: 'absolute',
        top: 6,
        right: 6,
        borderWidth: 0.8,
        borderColor: 'rgba(255, 255, 255, 0.34)',
        borderRadius: 20,
        // padding: 4,
    },
    audioIcon: {
        width: 14,
        height: 14,
        tintColor: '#000',
    },
    lock: {
        // position: 'absolute',
        top: 8,
        left: 8,
        padding: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.34)',
        borderWidth: 0.9,
        marginRight: 12, borderRadius: 4,
    },


    lockIcon: {
        width: 18,
        height: 18,
        resizeMode: 'contain',
    }


});

export default TopPickTile;
