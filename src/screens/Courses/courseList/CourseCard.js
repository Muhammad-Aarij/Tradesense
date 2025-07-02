import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { play } from '../../../assets/images';
import theme from '../../../themes/theme';

// Get screen width for responsive card sizing
const { width } = Dimensions.get('window');
const cardWidth = (width - 20 * 2 - 5) / 2;

// Star rating component
const StarRating = ({ rating }) => {
    const stars = [];
    // Render full stars based on the integer part of the rating
    for (let i = 0; i < Math.floor(rating); i++) {
        stars.push(
            <Text key={`filled-${i}`} style={cardStyles.filledStar}>
                ★
            </Text>
        );
    }
    // Render empty stars for the remaining spots up to 5
    for (let i = Math.floor(rating); i < 5; i++) {
        stars.push(
            <Text key={`empty-${i}`} style={cardStyles.emptyStar}>
                ★
            </Text>
        );
    }
    return <View style={cardStyles.starContainer}>{stars}</View>;
};

// Reusable Card Component (now part of this file)
const CourseCard = ({ imageSource, time, title, rating, description, profileImage, profileName, profileRole, price, onPress }) => {
    return (
        <TouchableOpacity style={cardStyles.card} onPress={onPress}>
            <View style={cardStyles.imageWrapper}>
                <Image source={imageSource} style={cardStyles.cardImage} />
                {/* <View style={cardStyles.timeOverlay}> */}
                {/* <Image source={play} style={{ width: 10, height: 10, resizeMode: "contain" }} /> */}
                {/* <Text style={cardStyles.timeText}>{time}</Text> */}
                {/* </View> */}
            </View>
            <View style={cardStyles.content}>
                <Text style={cardStyles.title} numberOfLines={2}>{title}</Text>
                <Text style={cardStyles.description} numberOfLines={2}>{description}</Text>
                <StarRating rating={rating} />
                <View style={cardStyles.footer}>
                    <View style={cardStyles.profileInfo}>
                        <Image source={profileImage} style={cardStyles.profileImage} />
                        <View>
                            <Text style={cardStyles.profileName}>{profileName}</Text>
                            {/* <Text style={cardStyles.profileRole}>{profileRole}</Text> */}
                        </View>
                    </View>
                    <Text style={cardStyles.price}>{price}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};


const cardStyles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 0.9, borderColor: theme.borderColor,
        borderRadius: 8,
        width: cardWidth,
        height: "auto",
        overflow: 'hidden', // Ensures image corners are rounded
        marginBottom: 10, // Space between rows
    },
    imageWrapper: {
        width: '100%',
        height: cardWidth * 0.7, // Aspect ratio for the image, adjust as needed
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
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
        fontFamily: "Inter-Regular"
    },
    content: {
        padding: 10,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 12,
        fontFamily: "Inter-Medium",
        marginBottom: 4,
    },
    starContainer: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    filledStar: {
        color: '#FFD700', // Gold color for filled stars
        fontSize: 16,
    },
    emptyStar: {
        color: '#BBBBBB', // Lighter color for empty stars
        fontSize: 16,
    },
    description: {
        fontFamily: "Inter-Light-BETA",
        color: '#AAAAAA',
        fontSize: 11,
        lineHeight: 16,
        flex: 1,
        marginBottom: 3,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 3, // Add some space from description
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
        backgroundColor: '#666', // Placeholder background
    },
    profileName: {
        color: theme.primaryColor,
        fontSize: 10,
        fontFamily: "Inter-Medium",
    },
    profileRole: {
        color: '#AAAAAA',
        fontSize: 9,
    },
    price: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: "Inter-SemiBold",
    },
});

export default CourseCard;