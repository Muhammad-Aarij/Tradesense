import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { mountain, play, user } from '../../../assets/images';
import theme from '../../../themes/theme';

const { width } = Dimensions.get('window'); // Get screen width for responsive design

// Re-defining StarRating locally for self-containation
const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        stars.push(
            <Text key={i} style={rating > i ? styles.filledStar : styles.emptyStar}>
                ★
            </Text>
        );
    }
    return <View style={styles.starContainer}>{stars}</View>;
};

// Assuming 'play' image is a static asset. If you prefer SVG, ensure react-native-svg is installed.
// Example placeholder for 'play' and 'mountain' if not available via actual assets.
// In your actual project, ensure these paths are correct:
// import { mountain, play } from '../../../assets/images';

const PurchasedCourseCard = ({ course, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={() => onPress(course)}>
        <View style={styles.imageWrapper}>
            {/* Use course.image for dynamic image source */}
            <Image source={mountain} style={styles.cardImage} />
            <View style={styles.imgOverlay} />
            <View style={styles.timeOverlay}>
                {/* Using the imported 'play' image asset */}
                <Image source={play} style={styles.playIcon} />
                <Text style={styles.timeText}>{course.time}</Text>
            </View>
        </View>
        <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{course.title}</Text>
            <Text style={styles.cardDescription} numberOfLines={3}>
                {course.description}
            </Text>
            <StarRating rating={course.rating} />
            <View style={styles.instructorInfo}>
                <Image source={user} style={styles.instructorImage} />
                <View style={{ flexDirection: "column" }}>
                    <Text style={styles.instructorName}>Alwin</Text>
                    <Text style={styles.instructorSubtitle}>Mentally Relax</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9, borderColor: theme.borderColor,
        borderRadius: 12,
        marginBottom: 15,
        height:150,
        overflow: 'hidden',

    },
    imageWrapper: {
        width: width * 0.38,
        // flex: 1, // Makes it fill available height
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },

    cardImage: {
        width: '100%',
        height: '100%', // Ensures it takes full height
        resizeMode: 'cover',
        position: "relative",
    },

    imgOverlay: {
        zIndex: 10,
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: 'rgba(31, 30, 30, 0.5)',

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
        zIndex: 100,
    },
    playIcon: {
        width: 10, // Adjusted based on previous SVG size, feel free to change
        height: 10,
        resizeMode: "contain",
        tintColor: "#FFFFFF", // Assuming the image is a solid icon that can be tinted
    },
    timeText: {
        color: '#FFFFFF',
        fontSize: 9,
        marginLeft: 4,
        fontFamily: "Inter-Regular" // Ensure this font is loaded or remove for default
    },
    cardContent: {
        flex: 1,
        padding: 12,
        paddingLeft: 20,
        justifyContent: 'space-between',
    },
    cardTitle: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: "Inter-Medium",
        marginBottom: 2,
    },
    starContainer: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    filledStar: {
        color: '#FFD700', // Gold color for filled stars
        fontSize: 14,
    },
    emptyStar: {
        color: '#BBBBBB', // Lighter color for empty stars
        fontSize: 14,
    },
    cardDescription: {
        fontFamily: "Inter-Light-BETA",
        color: '#AAAAAA',
        fontSize: 10,
        lineHeight: 14,
        marginBottom: 3,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end', // Aligns instructor info to the right
        alignItems: 'center',
    },
    // cardFooterLeft was removed as its content is now in timeOverlay
    cardFooterRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },


    instructorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        paddingVertical: 5,
        zIndex: 10,

    },
    instructorImage: {
        width: 25,
        height: 25,
        borderRadius: 100,
        marginRight: 5,
    },
    instructorName: {
        color: theme.primaryColor,
        fontSize: 11,
        fontFamily: 'Inter-SemiBold',
    },
    instructorSubtitle: {
        color: "white",
        fontSize: 9,
        fontFamily: 'Inter-Light-BETA',
    },
});

export default PurchasedCourseCard;
