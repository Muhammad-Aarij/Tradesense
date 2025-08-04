import React, { useContext, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { play, userBlue } from '../../../assets/images';
import { ThemeContext } from '../../../context/ThemeProvider';
import { API_URL } from "@env";
import ProfileImage from '../../../components/ProfileImage';

const { width } = Dimensions.get('window');
const cardWidth = (width - 20 * 2 - 15) / 2;

const StarRating = ({ rating, theme }) => {
    const stars = [];
    for (let i = 0; i < Math.floor(rating); i++) {
        stars.push(
            <Text key={`filled-${i}`} style={[styles.filledStar, { color: "#FFAE42" }]}>★</Text>
        );
    }
    for (let i = Math.floor(rating); i < 5; i++) {
        stars.push(
            <Text key={`empty-${i}`} style={[styles.emptyStar, { color: theme.subTextColor }]}>★</Text>
        );
    }
    return <View style={styles.starContainer}>{stars}</View>;
};

const CourseCard = ({
    imageSource,
    duration,
    title,
    rating,
    description,
    instructorImage,
    profileName,
    price,
    onPress
}) => {
    const { theme, isDarkMode } = useContext(ThemeContext);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    return (
        <TouchableOpacity style={[styles.card, { borderColor: theme.borderColor, }]} onPress={onPress}>
            <View style={styles.imageWrapper}>
                <Image 
                    source={imageError ? userBlue : imageSource} 
                    style={styles.cardImage}
                    onLoadStart={() => setImageLoading(true)}
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                        setImageLoading(false);
                        setImageError(true);
                    }}
                />
                
                {/* Loading Overlay */}
                {imageLoading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="small" color={theme.primaryColor} />
                    </View>
                )}
                
                <View style={styles.timeOverlay}>
                    <Image source={play} style={{ width: 10, height: 10, resizeMode: "contain" }} />
                    <Text style={styles.timeText}>{duration}</Text>
                </View>
            </View>
            <View style={styles.content}>
                <Text style={[styles.title, { color: theme.textColor }]} numberOfLines={1}>{title}</Text>
                <Text style={[styles.description, { color: theme.subTextColor }]} numberOfLines={2}>{description}</Text>
                {/* <StarRating rating={rating} theme={theme} /> */}
                <View style={{ flex: 1,marginBottom:10, }} />
                <View style={styles.footer}>
                    <View style={styles.profileInfo}>
                        <ProfileImage
                            uri={instructorImage}
                            name={profileName}
                            size={20}
                            borderRadius={10}
                            style={styles.profileImage}
                        />
                        <View>
                            <Text style={[styles.profileName, { color: theme.primaryColor }]}>{profileName}</Text>
                        </View>
                    </View>
                    <Text style={[styles.price, { color: theme.textColor }]}>{price}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderWidth: 0.9,
        borderRadius: 8,
        width: cardWidth,
        overflow: 'hidden',
        marginBottom: 10,
    },
    imageWrapper: {
        width: '100%',
        height: cardWidth * 1.2,
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    timeOverlay: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        color: '#FFFFFF',
        fontSize: 9,
        marginLeft: 4,
        fontFamily: "Outfit-Regular"
    },
    content: {
        flex: 1,
        padding: 10,
        flexDirection: 'column',
    },
    title: {
        fontSize: 11,
        fontFamily: "Outfit-Medium",
        marginBottom: 4,
        // height: 32, // ✅ fixed height for description (2 lines max)
    },
    starContainer: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    filledStar: {
        fontSize: 16,
    },
    emptyStar: {
        fontSize: 16,
    },
    description: {

        flex: 1, // this expands to fill remaining vertical space
        fontFamily: "Outfit-Light-BETA",
        fontSize: 10,
        lineHeight: 13,
        marginTop:5,
        marginBottom: 3,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 3,
    },
    profileInfo: {
        marginRight: 5,
        width: "70%",
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 20,
        height: 20,
        borderRadius: 15,
        marginRight: 5,
        backgroundColor: '#666',
    },
    profileName: {
        fontSize: 8,
        fontFamily: "Outfit-Medium",
    },
    price: {
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: "Outfit-SemiBold",
    },
});

export default CourseCard;
