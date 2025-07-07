import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ToastAndroid } from 'react-native';
import { copy, course, mountain, play, user, send } from '../../../assets/images';
import theme from '../../../themes/theme';
import { addToFavorites } from '../../../functions/handleCourses';
import Clipboard from '@react-native-clipboard/clipboard';
import Share from 'react-native-share';

const { width } = Dimensions.get('window'); // Get screen width for responsive design

const StarRating = ({ rating }) => {
    const displayRating = rating ? rating : 1; // fallback to 1 if rating is falsy

    const stars = [];
    for (let i = 0; i < 5; i++) {
        stars.push(
            <Text key={i} style={displayRating > i ? styles.filledStar : styles.emptyStar}>
                ★
            </Text>
        );
    }
    return <View style={styles.starContainer}>{stars}</View>;
};



{ console.log(course.title) }
const PurchasedCourseCard = ({ course, onPress, showplaybtn = true, showUrl = true }) => (
    < TouchableOpacity
        style={{
            ...styles.card,
            height: course.type === "Affiliate" ? 170 : 140
        }}
        onPress={onPress}
    >
        <View style={styles.imageWrapper}>
            {/* Use course.image for dynamic image source */}
            <Image source={{ uri: course.thumbnail }} style={styles.cardImage} />
            <View style={styles.imgOverlay} />

            {/* {course.type != "Affiliate" && false &&
                } */}
            <View style={styles.timeOverlay}>
                <Image source={play} style={styles.playIcon} />
                <Text style={styles.timeText}>{course.duration}</Text>
            </View>

        </View>
        <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={1}>{course.title || "Untitled Course"}</Text>
            <Text style={styles.cardDescription} numberOfLines={course.type == "Affiliate" ? 2 : 2}>
                {course.description}
            </Text>
            <StarRating rating={course.rating} />
            <View style={styles.instructorInfo}>
                <View style={{ flexDirection: "row" }}>
                    <Image source={user} style={styles.instructorImage} />
                    <View style={{ flexDirection: "column" }}>
                        <Text style={styles.instructorName}>{course.instructorName || "Instructor"}</Text>
                        {/* <Text style={styles.instructorSubtitle}>{course.instructorExperienceLevel}</Text> */}
                    </View>
                </View>
                <Text style={styles.price}>{course.price}</Text>
            </View>

            {showUrl && (
                <View style={styles.urlcontainer}>
                    <Text style={styles.url} numberOfLines={1} ellipsizeMode="tail">
                        {course.url}
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: "flex-end", }}>
                        {/* Copy Button */}
                        <TouchableOpacity
                            onPress={() => {
                                Clipboard.setString(course.url);
                                ToastAndroid.show('Link copied!', ToastAndroid.SHORT);
                            }}>
                            <Image style={{ width: 13, height: 13, resizeMode: "contain", marginRight: 5 }} source={copy} />
                        </TouchableOpacity>

                        {/* Share Button */}
                        <TouchableOpacity
                            onPress={async () => {
                                try {
                                    await Share.open({
                                        title: 'Share Course',
                                        message: `Check out this course: ${course.url}`,
                                    });

                                } catch (error) {
                                    if (error.message !== 'User did not share') {
                                        console.log('Share error:', error);
                                    }
                                }
                            }}
                        >
                            <Image style={{ width: 12, height: 12, resizeMode: "contain", marginRight: 5, }} source={send} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    </TouchableOpacity >
);

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 0.9, borderColor: theme.borderColor,
        borderRadius: 12,
        marginBottom: 15,
        height: 150,
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
        resizeMode: 'contain',
        position: "relative",
    },

    imgOverlay: {
        zIndex: 10,
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: 'rgba(31, 30, 30, 0.4)',

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
        fontSize: 10,
        marginLeft: 4,
        fontFamily: "Inter-Regular" // Ensure this font is loaded or remove for default
    },
    cardContent: {
        flex: 1,
        padding: 12,
        paddingLeft: 10,
        justifyContent: 'space-between',
    },
    cardTitle: {
        color: '#FFFFFF',
        fontSize: 12,
        fontFamily: "Inter-Regular",
        marginBottom: 2,
    },
    starContainer: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    filledStar: {
        color: 'yellow', // Gold color for filled stars
        fontSize: 14,
    },
    emptyStar: {
        color: '#BBBBBB', // Lighter color for empty stars
        fontSize: 14,
    },
    cardDescription: {
        flex: 1,
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
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        borderRadius: 20,
        paddingVertical: 5,
        zIndex: 10,
        // marginBottom: 5,
    },
    price: {
        color: "#FFF",
        fontSize: 13,
        fontFamily: 'Inter-SemiBold',
    },
    instructorImage: {
        width: 25,
        height: 25,
        borderRadius: 100,
        marginRight: 5,
    },
    instructorName: {
        // maxWidth:"80%",
        color: theme.primaryColor,
        fontSize: 10,
        fontFamily: 'Inter-SemiBold',
    },
    instructorSubtitle: {
        color: "white",
        fontSize: 9,
        fontFamily: 'Inter-Light-BETA',
    },

    urlcontainer: {
        borderWidth: 1, borderColor: theme.borderColor,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 5,
        paddingHorizontal: 8,
    },

    url: {
        color: "white",
        fontSize: 9,
        fontFamily: 'Inter-Light-BETA',
        // maxWidth: "85%",
    }
});

export default PurchasedCourseCard;
