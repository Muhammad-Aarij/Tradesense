import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Image, ImageBackground, Dimensions } from 'react-native';
import TopMenuScroll from '../TopMenuScroll';
import { afirm, audio, bg, calm, circleTop, meditation, mobile, success, video, video1, video2, video3, videoY } from '../../../assets/images';
import AudioCard from '../AudioCard';
import VideoCard from '../VideoCard';
import Header from '../../../components/Header';
import theme from '../../../themes/theme';
const { height, width } = Dimensions.get('window');

const TopCategories = [
    { id: 'Audios', name: 'Meditation', icon: meditation },
    { id: 'Videos', name: 'Calm', icon: calm },
    { id: 'Graphical', name: 'Affirmation', icon: afirm },
    { id: 'Text', name: 'Success', icon: success },
];
const mockAudios = [
    { id: 'a1', title: 'The Power of Mindfulness', duration: '5 min', isLiked: false },
    { id: 'a2', title: 'Daily Gratitude Practice', duration: '8 min', isLiked: true },
    { id: 'a3', title: 'Focus and Productivity', duration: '6 min', isLiked: false },
];


const PillarAudioScreen = () => {
    // State for top category selection, defaulting to the first item's ID
    const [selectedTopCategory, setSelectedTopCategory] = useState(TopCategories[0].id);
    // State for content category selection, defaulting to 'audios'
    const [selectedContentCategory, setSelectedContentCategory] = useState('audios');

    // Simple mock for navigation in React Native, in a real app, use React Navigation
    const handleNavigation = (screenName) => {
        console.log(`Navigating to: ${screenName}`);
        // Here you would typically use navigation.navigate(screenName) from @react-navigation/native
    };

    return (
        <ImageBackground source={bg} style={styles.container}>
            <ScrollView style={styles.contentScroll}>
                <View style={{ paddingHorizontal: 25, position: "absolute", zIndex: 100 }}>
                    <Header title={""} />
                </View>
                <Image source={circleTop} style={styles.topImg} />
                <Text style={styles.title}>Psychology</Text>
                {/* Top Menu Scroll */}
                <TopMenuScroll
                    items={TopCategories}
                    selectedItem={selectedTopCategory}
                    onItemSelected={setSelectedTopCategory}
                />
                <View style={{ paddingLeft: 25, }}>

                    <View style={{ ...styles.sectionContainer, paddingRight: 25 }}>
                        <Text style={{ ...styles.sectionTitle, marginTop: 25, }}>Audios | Meditation & Calm</Text>
                        <View style={styles.category}>
                            {mockAudios.map((audio) => (
                                <AudioCard
                                    key={audio.id}
                                    episodeNumber={audio.id.replace('a', '')}
                                    title={audio.title}
                                    duration={audio.duration}
                                    isLiked={audio.isLiked}
                                    onPress={() => {
                                        console.log(`Play audio: ${audio.title}`);
                                        // handleNavigation('AudioPlayer'); // Example of intended navigation
                                    }}
                                />
                            ))}
                        </View>
                    </View>


                </View>
            </ScrollView>
        </ImageBackground >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#08131F',
        padding: 0, paddingVertical: 0
    },
    title: {
        fontSize: 23,
        color: '#EFEFEF',
        fontFamily: 'Inter-SemiBold',
        textAlign: 'center',
        position: "relative",
        top: -30,
    },
    topImg: {
        width: "100%",
        height: height / 3,
    },
    contentScroll: {
        width: "100%",
        paddingBottom: 30, // pb-20 (approx 80px for bottom nav space)
    },
    contentCategoryTitle: {
        color: 'white',
        fontSize: 17, // text-lg
        fontFamily: "Inter-Light-BETA",
        marginTop: 15, // mt-5 (approx 20px)
        marginBottom: 16, // mb-4
    },
    category: {
        // backgroundColor: 'rgba(255, 255, 255, 0.06)',
        // borderWidth: 0.9, borderColor: theme.borderColor,
        // borderRadius: 8,
        // padding: 10,
        marginBottom: 20,
        gap: 10,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 13, // text-lg
        fontFamily: "Inter-Light-BETA",
        marginBottom: 16, // mb-4
    },
    horizontalCardList: {
        paddingBottom: 8, // pb-2
    },
    bottomNavBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#1C2B3A', // bg-[#1C2B3A]
        borderTopLeftRadius: 12, // rounded-t-xl
        borderTopRightRadius: 12, // rounded-t-xl
        paddingVertical: 8, // py-2
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // Android shadow
    },
    navButton: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 4, // p-1 (approx 4px)
    },
    navIcon: {
        width: 24, // w-6
        height: 24, // h-6
        resizeMode: 'contain',
        marginBottom: 4, // mb-1
        tintColor: 'white', // text-white (for icons)
    },
    navText: {
        color: 'white',
        fontSize: 10, // text-xs
    },
});

export default PillarAudioScreen;
