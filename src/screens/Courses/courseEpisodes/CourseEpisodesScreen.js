import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { bg, heart, heartOutline, mountain, pause, play, user, wave } from '../../../assets/images';
import theme from '../../../themes/theme';
import Header from '../../../components/Header';
// import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Reusing PlayIcon from previous components

const courseEpisodes = [
    { id: 'ep1', title: 'Episode 1', duration: '5 min' },
    { id: 'ep2', title: 'Episode 2', duration: '5 min' },
    { id: 'ep3', title: 'Episode 3', duration: '5 min' },
    { id: 'ep4', title: 'Episode 4', duration: '5 min' },
    { id: 'ep5', title: 'Episode 5', duration: '5 min' },
    { id: 'ep6', title: 'Episode 6', duration: '5 min' },
];

const CourseEpisodesScreen = () => {
    //   const navigation = useNavigation();
    //   const route = useRoute();
    //   const { courseId, courseTitle, courseImage } = route.params || {
    //     courseId: 'default',
    //     courseTitle: 'Daily Calm',
    //     courseImage: 'https://placehold.co/800x400/524855/FFF?text=Default+Course',
    //   };
    const { courseId, courseTitle, courseImage } = {
        courseId: 'default',
        courseTitle: 'Daily Calm',
        courseImage: 'https://placehold.co/800x400/524855/FFF?text=Default+Course',
    };

    const [currentEpisode, setCurrentEpisode] = React.useState(courseEpisodes[0].id); // State to track current playing episode

    return (
        <ImageBackground source={bg} style={styles.container}>
            {/* Header */}
            <Header title={courseTitle} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Course Banner / Currently Playing */}
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

                {/* Course Details */}
                <View style={styles.courseDetails}>
                    <Text style={styles.courseDescription}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                    </Text>
                </View>
                <View style={{ width: "100%", marginBottom: 20, borderTopWidth: 1, borderColor: "rgba(119, 119, 119, 0.23)" }} />


                {/* Episodes List */}
                <View style={styles.episodesList}>
                    {courseEpisodes.map((episode, index) => (
                        <View key={episode.id} style={styles.episodeItem}>
                            <View style={styles.episodeNumberContainer}>
                                <Text style={styles.episodeNumber}>{index + 1}</Text>
                            </View>
                            <View style={styles.episodeInfo}>
                                <Text style={styles.episodeTitle}>{episode.title}</Text>
                                <Text style={styles.episodeDuration}>{episode.duration}</Text>
                            </View>
                            <TouchableOpacity style={styles.heartButton}>
                                {/* Conditionally render filled heart for Episode 2 as per image */}
                                <Image source={episode.id === 'ep2' ? heart : heartOutline} style={{ width: 20, height: 20, resizeMode: "contain" }} />
                            </TouchableOpacity>
                        </View> 
                    ))}
                </View>
            </ScrollView>

            {/* Mini Player */}
            <View style={styles.miniPlayer}>
                <Image source={wave} style={styles.miniPlayerImage} />
                <View style={styles.miniPlayerTextContent}>
                    <Text style={styles.miniPlayerTitle}>Episode 1</Text> {/* Assuming first episode is playing */}
                    <Text style={styles.miniPlayerCourse}>{courseTitle}</Text>
                </View>
                <TouchableOpacity style={styles.miniPlayerPlayPauseButton}>
                    <Image source={pause} style={{ width: 20, height: 20, resizeMode: "contain" }} />
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        paddingVertical: 0,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    mainImageContainer: {
        width: '100%',
        height: width * 0.55, // Responsive height based on width
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
    courseDetails: {
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    courseDescription: {
        color: '#FFFFFF',
        fontSize: 13,
        lineHeight: 20,
        fontFamily: "Inter-Light-BETA"
    },
    episodesList: {
        paddingHorizontal: 9,
        marginBottom: 60,
    },
    episodeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    episodeNumberContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 24,
    },
    episodeNumber: {
        color: '#FFF',
        fontSize: 19.4,
        fontFamily: "Inter-SemiBold"
    },
    episodeInfo: {
        flex: 1,
    },
    episodeTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: "Inter-Regular"
    },
    episodeDuration: {
        color: '#AAAAAA',
        fontSize: 12,
        fontFamily: "Inter-Light-BETA"
    },

    miniPlayer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        paddingVertical: 15,
        paddingHorizontal: 25,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    miniPlayerImage: {
        width: 40,
        height: 40,
        borderRadius: 8,
        marginRight: 10,
    },
    miniPlayerTextContent: {
        flex: 1,
    },
    miniPlayerTitle: {
        color: '#FFFFFF',
        fontSize: 13,
        fontFamily: "Inter-Medium"
    },
    miniPlayerCourse: {
        color: '#AAAAAA',
        fontSize: 11,
        fontFamily: "Inter-Light-BETA"

    },
    miniPlayerPlayPauseButton: {
        padding: 5,
    },
});

export default CourseEpisodesScreen;
