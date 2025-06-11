import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { bg, mountain, play, user, wave } from '../../../assets/images';
import Header from '../../../components/Header';
import theme from '../../../themes/theme';
// import { useNavigation, useRoute } from '@react-navigation/native'; // Import hooks for navigation
const { width } = Dimensions.get('window');

// Inline SVG for Play icon (as used in previous Card component)
// If you encounter errors with SVG, ensure you have 'react-native-svg' installed
// and linked: npm install react-native-svg && cd ios && pod install

const audios = [
    { id: 'a1', title: 'Audio 1', duration: '5 min', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
    { id: 'a2', title: 'Audio 2', duration: '5 min', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
    { id: 'a3', title: 'Audio 3', duration: '5 min', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
    { id: 'a4', title: 'Audio 4', duration: '5 min', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
];

const CourseDetailScreen = () => {
    //   const navigation = useNavigation();
    //   const route = useRoute();
    // You can get course details passed from the previous screen like this:
    //   const { courseId, courseTitle } = route.params || { courseId: 'default', courseTitle: 'Daily Calm' };
    const { courseId, courseTitle } = { courseId: 'default', courseTitle: 'Daily Calm' };

    return (
        <ImageBackground source={bg} style={styles.container}>
            {/* Header */}
            <Header title={courseTitle} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Course Main Image Section */}
                <View style={styles.mainImageContainer}>
                    <Image
                        source={mountain}
                        style={styles.mainCourseImage}
                    />
                    <View style={styles.imgOverlay} />
                    <View style={styles.imageOverlay}>
                        <View style={styles.overlayTop}>
                            <View style={styles.timeBadge}>
                                <Image source={play} style={{ width: 10, height: 10, resizeMode: "contain" }} />
                                <Text style={styles.timeBadgeText}>15min</Text>
                            </View>
                            <View style={styles.instructorInfo}>
                                <Image source={user} style={styles.instructorImage} />
                                <View style={{ flexDirection: "column" }}>
                                    <Text style={styles.instructorName}>Alwin</Text>
                                    <Text style={styles.instructorSubtitle}>Mentally Relax</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Course Info Section */}
                <View style={styles.courseInfoSection}>
                    <Text style={styles.courseDescription}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                    </Text>
                </View>
                <View style={{ width: "100%", marginBottom: 20, borderTopWidth: 1, borderColor: "rgba(119, 119, 119, 0.23)" }} />

                {/* Audios Section */}
                <View style={styles.audiosSection}>
                    {audios.map((audio, index) => (
                        <View key={audio.id} style={styles.audioItem}>
                            <View style={styles.audioLeft}>
                                <Text style={styles.audioTitle}>{audio.title}</Text>
                            </View>
                            <Text style={styles.audioDuration}>{audio.duration}</Text>
                            <Text style={styles.audioDescription}>{audio.description}</Text>
                        </View>
                    ))}
                </View>

                {/* Buy Now Button */}
                <TouchableOpacity
                    style={styles.buyNowButton}
                    onPress={() => navigation.navigate('Plans')} // Navigate to the Plans screen
                >
                    <Text style={styles.buyNowButtonText}>Buy Now</Text>
                </TouchableOpacity>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        paddingVertical: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 50, // Adjust for status bar
        paddingBottom: 10,
        backgroundColor: '#08131F', // Dark header background
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    rightHeaderPlaceholder: {
        width: 24, // Match back button width for centering headerTitle
    },
    scrollContent: {
        paddingBottom: 20, // Space at the bottom for scrollable content
    },
    mainImageContainer: {
        width: '100%',
        height: width * 0.55, // Responsive height based on width
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
    },
    mainCourseImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        position: "relative",
    },
    imgOverlay: {
        zIndex: 10,
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: 'rgba(31, 30, 30, 0.7)',

    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 15,
        justifyContent: 'space-between',
    },
    overlayTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    timeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(119, 119, 119, 0.66)',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        zIndex: 100,

    },
    timeBadgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        marginLeft: 5,
    },
    instructorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        zIndex: 10,

    },
    instructorImage: {
        width: 40,
        height: 40,
        borderRadius: 100,
        marginRight: 5,
    },
    instructorName: {
        color: theme.primaryColor,
        fontSize: 13,
        fontFamily: 'Inter-SemiBold',
    },
    instructorSubtitle: {
        color: "white",
        fontSize: 11,
        fontFamily: 'Inter-Light-BETA',
    },
    courseInfoSection: {
        marginBottom: 20,
    },
    courseTitle: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    heartIconContainer: {
        position: 'absolute',
        right: 16,
        top: 0,
        padding: 5,
    },
    courseDescription: {
        color: '#FFFFFF',
        fontSize: 13,
        lineHeight: 20,
        fontFamily: "Inter-Light-BETA"
    },
    audiosSection: {
        paddingVertical: 10,
        gap: 10
    },
    audioItem: {
        padding: 14,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 1.5, borderColor: theme.borderColor,
        borderRadius: 10, marginBottom: 8,

    },
    audioLeft: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    audioTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Inter-Medium',
    },
    audioDuration: {
        color: '#AAAAAA',
        fontFamily: 'Inter-Light-BETA',
        fontSize: 12,
        marginBottom: 5,
    },
    audioDescription: {
        color: '#FFFFFF',
        fontFamily: 'Inter-Light-BETA',
        fontSize: 13,
        lineHeight: 18,
    },

    buyNowButton: {
        backgroundColor: theme.primaryColor, width: '100%',
        padding: 15, borderRadius: 14, marginTop: 20, alignItems: 'center'
    },
    buyNowButtonText: {
        color: '#fff', fontSize: 17, fontWeight: '600', fontFamily: "Inter-SemiBold",
    },
});

export default CourseDetailScreen;
