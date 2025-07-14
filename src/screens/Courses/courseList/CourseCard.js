import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { play } from '../../../assets/images';
import { ThemeContext } from '../../../context/ThemeProvider';

const { width } = Dimensions.get('window');
const cardWidth = (width - 20 * 2 - 5) / 2;

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
    profileImage,
    profileName,
    price,
    onPress
}) => {
    const { theme, isDarkMode } = useContext(ThemeContext);

    return (
        <TouchableOpacity style={[styles.card, { borderColor: theme.borderColor, }]} onPress={onPress}>
            <View style={styles.imageWrapper}>
                <Image source={imageSource} style={styles.cardImage} />
                <View style={styles.timeOverlay}>
                    <Image source={play} style={{ width: 10, height: 10, resizeMode: "contain" }} />
                    <Text style={styles.timeText}>{duration}</Text>
                </View>
            </View>
            <View style={styles.content}>
                <Text style={[styles.title, { color: theme.textColor }]} numberOfLines={2}>{title}</Text>
                <Text style={[styles.description, { color: theme.subTextColor }]} numberOfLines={2}>{description}</Text>
                <StarRating rating={rating} theme={theme} />
                <View style={styles.footer}>
                    <View style={styles.profileInfo}>
                        <Image source={profileImage} style={styles.profileImage} />
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
        height: cardWidth * 0.7,
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
        fontSize: 12,
        fontFamily: "Inter-Medium",
        marginBottom: 4,
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
        fontFamily: "Inter-Light-BETA",
        fontSize: 11,
        lineHeight: 16,
        flex: 1,
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
        fontSize: 10,
        fontFamily: "Inter-Medium",
    },
    price: {
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: "Inter-SemiBold",
    },
});

export default CourseCard;
