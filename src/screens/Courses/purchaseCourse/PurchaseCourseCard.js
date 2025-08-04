import React, { useContext } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ToastAndroid,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Share from 'react-native-share';
import { API_URL } from "@env";
import { copy, play, send, user, userBlue, userDefault } from '../../../assets/images';
import { ThemeContext } from '../../../context/ThemeProvider';
import OptimizedImage from '../../../components/OptimizedImage';
import ProfileImage from '../../../components/ProfileImage';

const { width } = Dimensions.get('window');

const StarRating = ({ rating, theme }) => {
    const displayRating = rating || 1;
    const stars = [];
    for (let i = 0; i < 5; i++) {
        stars.push(
            <Text key={i} style={displayRating > i ? [styles.filledStar, { color: theme.starColor || '#FFD700' }] : [styles.emptyStar, { color: theme.textSecondaryColor }]}>
                ★
            </Text>
        );
    }
    return <View style={styles.starContainer}>{stars}</View>;
};


const formatDuration = (seconds) => {
    if (seconds < 60) return '1 min';
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(seconds / 3600);
    return seconds >= 3600 ? `${hours} hour${hours > 1 ? 's' : ''}` : `${minutes} min`;
};
const PurchasedCourseCard = ({ course, onPress, showplaybtn = true, showUrl = true }) => {
    const { theme, isDarkMode } = useContext(ThemeContext);
    console.log("Purchased Course Details", course);
    return (
        <TouchableOpacity
            style={[
                styles.card,
                {
                    // backgroundColor: theme.transparentBg,
                    borderColor: theme.borderColor,
                    height: course.type === 'Affiliate' ? 170 : 140,
                },
            ]}
            onPress={onPress}
        >
            <View style={styles.imageWrapper}>
                <OptimizedImage 
                    uri={course.thumbnail}
                    style={styles.cardImage}
                    fallbackSource={userBlue}
                    resizeMode="cover"
                />
                {isDarkMode && <View style={styles.imgOverlay} />}
                <View style={styles.timeOverlay}>
                    <Image source={play} style={styles.playIcon} />
                    <Text style={styles.timeText}>{formatDuration(course.duration)}</Text>
                </View>
            </View>

            <View style={styles.cardContent}>
                <View style={{}}>
                    <Text style={[styles.cardTitle, { color: theme.textColor }]} numberOfLines={1}>
                        {course.title || 'Untitled Course'}
                    </Text>

                    <Text
                        style={[styles.cardDescription, { color: theme.subTextColor }]}
                        numberOfLines={3}
                    >
                        {course.description}
                    </Text>
                    {showUrl && (
                        <TouchableOpacity
                            onPress={() => {
                                Clipboard.setString(course.url);
                                ToastAndroid.show('Link copied!', ToastAndroid.SHORT);
                            }}
                        >

                            <View
                                style={[
                                    styles.urlcontainer,
                                    { borderColor: theme.borderColor },
                                ]}
                            >
                                <Text style={[styles.url, { color: theme.textColor }]} numberOfLines={1}>
                                    {course.url}
                                </Text>

                                <View style={{ flexDirection: 'row' }}>
                                    {/* <TouchableOpacity
                                    onPress={() => {
                                        Clipboard.setString(course.url);
                                        ToastAndroid.show('Link copied!', ToastAndroid.SHORT);
                                    }}
                                > */}
                                    <Image
                                        style={[styles.icon, { tintColor: theme.textColor, }]}
                                        source={copy}
                                    />
                                    {/* </TouchableOpacity> */}
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}

                    {/* <StarRating rating={course.rating} theme={theme} /> */}
                </View>
                <View style={styles.instructorInfo}>
                    <View style={{ flexDirection: 'row' }}>
                        <ProfileImage 
                            uri={course.instructorImage}
                            name={course.instructorName}
                            size={20}
                            borderRadius={10}
                            style={styles.instructorImage}
                        />
                        <View>
                            <Text style={[styles.instructorName, { color: theme.primaryColor }]}>
                                {course.instructorName || 'Instructor'}
                            </Text>
                        </View>
                    </View>
                    {showUrl &&
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
                            <Image
                                style={[styles.icon]}
                                source={send}
                            />
                        </TouchableOpacity>}
                    {/* <Text style={[styles.price, { color: theme.textColor }]}>{course.price}</Text> */}
                </View>


            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        borderWidth: 0.9,
        borderRadius: 12,
        marginBottom: 15,
        overflow: 'hidden',
    },
    imageWrapper: {
        width: width * 0.32,
        // borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imgOverlay: {
        zIndex: 10,
        width: '100%',
        height: '100%',
        position: 'absolute',
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
        width: 10,
        height: 10,
        resizeMode: 'contain',
        tintColor: '#FFFFFF',
    },
    timeText: {
        color: '#FFFFFF',
        fontSize: 10,
        marginLeft: 4,
        fontFamily: 'Outfit-Regular',
    },
    cardContent: {
        // borderWidth: 2,
        height: "100%",
        flex: 1,
        padding: 12,
        paddingLeft: 10,
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: 12,
        fontFamily: 'Outfit-Regular',
        marginBottom: 2,
    },
    starContainer: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    filledStar: {
        fontSize: 14,
    },
    emptyStar: {
        fontSize: 14,
    },
    cardDescription: {
        fontFamily: 'Outfit-Light-BETA',
        fontSize: 9,
        lineHeight: 12,
        marginVertical: 3,
    },
    instructorInfo: {
        flex: 1,
        // borderWidth:2,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        borderRadius: 20,
        // paddingVertical: 5,
        zIndex: 10,
    },
    price: {
        fontSize: 13,
        fontFamily: 'Outfit-SemiBold',
    },
    instructorImage: {
        width: 20,
        height: 20,
        borderRadius: 100,
        marginRight: 5,
    },
    instructorName: {
        fontSize: 10,
        fontFamily: 'Outfit-SemiBold',
    },
    urlcontainer: {
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        marginTop: 10,
        paddingHorizontal: 8,
    },
    url: {
        fontSize: 9,
        fontFamily: 'Outfit-Light-BETA',
        maxWidth: '75%',
    },
    icon: {

        width: 13,
        height: 13,
        resizeMode: 'contain',
        marginRight: 5,
    },
});

export default PurchasedCourseCard;
