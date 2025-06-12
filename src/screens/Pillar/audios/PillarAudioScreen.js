import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Image, ImageBackground, Dimensions } from 'react-native';
import TopMenuScroll from '../TopMenuScroll';
import { audio2, bg, graphical, pause, text, video1, video2, video3, videoIcon, wave, } from '../../../assets/images';
import AudioCard from '../AudioCard';
import VideoCard from '../VideoCard';
import Header from '../../../components/Header';
import theme from '../../../themes/theme';
import TextCard from '../TextCard';
const { height, width } = Dimensions.get('window');

const TopCategories = [
    { id: 'Audios', name: 'Audios', icon: audio2 },
    { id: 'Videos', name: 'Videos', icon: videoIcon },
    { id: 'Graphical', name: 'Graphical', icon: graphical },
    { id: 'Text', name: 'Text', icon: text },
];
const mockAudios = [
    { id: 'a1', title: 'The Power of Mindfulness', duration: '5 min', isLiked: false },
    { id: 'a2', title: 'Daily Gratitude Practice', duration: '8 min', isLiked: true },
    { id: 'a3', title: 'Focus and Productivity', duration: '6 min', isLiked: false },
];
const TextEpisodes = [
    { id: 'a1', title: 'Episode 1',descr: 'Lorem Ipsum is simply dummy text of the printing and type setting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.',  },
    { id: 'a2', title: 'Episode 2',descr: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',  },
    { id: 'a3', title: 'Episode 3',descr: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',  },
];
const mockVideos = [
    { id: 'v1', title: "Psychology", descr: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', image: video1 },
    { id: 'v2', title: "Meditation", descr: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', image: video2 },
    { id: 'v3', title: "Fitness", descr: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', image: video3 },
    { id: 'v1', title: "Psychology", descr: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', image: video1 },
    { id: 'v2', title: "Meditation", descr: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', image: video2 },
    { id: 'v3', title: "Fitness", descr: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', image: video3 },
    { id: 'v1', title: "Psychology", descr: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', image: video1 },
    { id: 'v2', title: "Meditation", descr: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', image: video2 },
    { id: 'v3', title: "Fitness", descr: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', image: video3 },
];




const PillarAudioScreen = () => {

    const [selectedTopCategory, setSelectedTopCategory] = useState(TopCategories[0].id);

    const handleNavigation = (screenName) => {
        console.log(`Navigating to: ${screenName}`);
    };

    return (
        <ImageBackground source={bg} style={styles.container}>
            <ScrollView style={styles.contentScroll}>
                <View style={{ paddingHorizontal: 25 }}>
                    <Header title={"Psychology"} />
                </View>
                {/* Top Menu Scroll */}
                <TopMenuScroll
                    items={TopCategories}
                    selectedItem={selectedTopCategory}
                    onItemSelected={setSelectedTopCategory}
                />
                <View style={{ paddingLeft: 25, marginTop: 25, }}>
                    <View style={{ ...styles.sectionContainer, paddingRight: 25 }}>
                        {selectedTopCategory == "Audios" &&
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
                        }
                        {selectedTopCategory == "Videos" &&
                            <View style={styles.category}>
                                <FlatList
                                    data={mockVideos}
                                    keyExtractor={(item) => item.id}
                                    numColumns={2}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={styles.videoGridList}
                                    columnWrapperStyle={styles.columnWrapper}
                                    renderItem={({ item }) => (
                                        <View style={styles.videoCardWrapper}>
                                            <VideoCard
                                                title={item.title}
                                                duration={item.duration}
                                                imageSource={item.image}
                                                decription={item.descr}
                                                onPress={() => {
                                                    console.log(`Play video: ${item.title}`);
                                                }}
                                            />
                                        </View>
                                    )}
                                />
                            </View>
                        }
                        {selectedTopCategory == "Graphical" &&
                            <View style={styles.category}>
                                <FlatList
                                    data={mockVideos}
                                    keyExtractor={(item) => item.id}
                                    numColumns={2}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={styles.videoGridList}
                                    columnWrapperStyle={styles.columnWrapper}
                                    renderItem={({ item }) => (
                                        <View style={styles.videoCardWrapper}>
                                            <VideoCard
                                                title={item.title}
                                                duration={item.duration}
                                                imageSource={item.image}
                                                decription={item.descr}
                                                onPress={() => {
                                                    console.log(`Play video: ${item.title}`);
                                                }}
                                            />
                                        </View>
                                    )}
                                />
                            </View>
                        }
                        {selectedTopCategory == "Text" &&
                            <View style={styles.category}>
                                <FlatList
                                    data={TextEpisodes}
                                    keyExtractor={(item) => item.id}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={styles.videoGridList}
                                    renderItem={({ item }) => (
                                        <View style={styles.videoCardWrapper}>
                                            <TextCard
                                                title={item.title}
                                                decription={item.descr}
                                                onPress={() => {
                                                    console.log(`Play video: ${item.title}`);
                                                }}
                                            />
                                        </View>
                                    )}
                                />
                            </View>
                        }
                    </View>
                </View>
            </ScrollView>
            {/* Mini Player */}
            {selectedTopCategory == "Audios" &&
                <View style={styles.miniPlayer}>
                    <Image source={wave} style={styles.miniPlayerImage} />
                    <View style={styles.miniPlayerTextContent}>
                        <Text style={styles.miniPlayerTitle}>Episode 1</Text>
                        <Text style={styles.miniPlayerCourse}>Daily Calm</Text>
                    </View>
                    <TouchableOpacity style={styles.miniPlayerPlayPauseButton}>
                        <Image source={pause} style={{ width: 20, height: 20, resizeMode: "contain" }} />
                    </TouchableOpacity>
                </View>}
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
        flexDirection: "row",
        // flexWrap:"nowrap",
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
        borderRadius: 5,
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

export default PillarAudioScreen;
