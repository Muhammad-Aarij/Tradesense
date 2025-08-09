import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Image, ImageBackground, Dimensions } from 'react-native';
import TopMenuScroll from '../TopMenuScroll';
import { afirm, audio, bg, calm, meditation, mobile, success, video, video1, video2, video3, videoY } from '../../../assets/images';
import AudioCard from '../AudioCard';
import VideoCard from '../VideoCard';
import Header from '../../../components/Header';
import { ThemeContext } from '../../../context/ThemeProvider';


const { height, width } = Dimensions.get('window');
const TopCategories = [
    { id: 'meditation', name: 'Meditation', icon: meditation },
    { id: 'calm', name: 'Calm', icon: calm },
    { id: 'affirmation', name: 'Affirmation', icon: afirm },
    { id: 'success', name: 'Success', icon: success },
];

const contentCategories = [
    { id: 'audios', name: 'Audios', icon: audio },
    { id: 'videos', name: 'Videos', icon: videoY },
    { id: 'illustrationVideos', name: 'Illustration Videos', icon: mobile },
];

const mockAudios = [
    { id: 'a1', title: 'The Power of Mindfulness', duration: '5 min', isLiked: false },
    { id: 'a2', title: 'Daily Gratitude Practice', duration: '8 min', isLiked: true },
    { id: 'a3', title: 'Focus and Productivity', duration: '6 min', isLiked: false },
];

const mockVideos = [
    { id: 'v1', title: "Psychology", descr: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', image: video1 },
    { id: 'v2', title: "Meditation", descr: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', image: video2 },
    { id: 'v3', title: "Fitness", descr: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', image: video3 },
];


const PillarsCategoryScreen = () => {

    const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const [selectedTopCategory, setSelectedTopCategory] = useState(TopCategories[0].id);
    const [selectedContentCategory, setSelectedContentCategory] = useState('audios');

    const handleNavigation = (screenName) => {
        console.log(`Navigating to: ${screenName}`);
        // Here you would typically use navigation.navigate(screenName) from @react-navigation/native
    };

    return (
        <ImageBackground source={theme.bg} style={styles.container}>
            <ScrollView style={styles.contentScroll}>
                <View style={{ paddingHorizontal: 25, }}>
                    <Header title={"Education"} />
                </View>

                {/* Top Menu Scroll */}
                <TopMenuScroll
                    items={TopCategories}
                    selectedItem={selectedTopCategory}
                    onItemSelected={setSelectedTopCategory}
                />
                <View style={{ paddingHorizontal: 25, paddingBottom: 100 }}>


                    {/* Scrollable Content Area */}
                    {/* Content Category Section */}
                    <Text style={styles.contentCategoryTitle}>Content Category</Text>
                    <View style={styles.category}>
                        <FlatList
                            horizontal
                            data={contentCategories}
                            keyExtractor={(item) => item.id}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.contentCategoryList}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.contentCategoryButton,
                                        {
                                            backgroundColor:
                                                item.id === 'audios'
                                                    ? '#FFA90A' // yellow-400
                                                    : item.id === 'videos'
                                                        ? '#FF5F00' // red-500
                                                        : item.id === 'illustrationVideos'
                                                            ? '#63A3D9' // blue-500
                                                            : '#FF6347', // fallback
                                        },
                                    ]}
                                    onPress={() => setSelectedContentCategory(item.id)}
                                >
                                    <Text style={styles.contentCategoryButtonText}>{item.name}</Text>
                                    <Image source={item.icon} style={styles.contentCategoryIcon} />
                                </TouchableOpacity>
                            )}
                        />
                    </View>

                    {/* Dynamic Content based on selectedContentCategory */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Audios</Text>
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

                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Videos</Text>
                        <View style={styles.category}>
                            <FlatList
                                horizontal
                                data={mockVideos}
                                keyExtractor={(item) => item.id}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalCardList}
                                renderItem={({ item }) => (
                                    <VideoCard
                                        title={item.title}
                                        duration={item.duration}
                                        imageSource={item.image}
                                        decription={item.descr}
                                        onPress={() => {
                                            console.log(`Play video: ${item.title}`);
                                            // handleNavigation('VideoPlayer'); // Example of intended navigation
                                        }}
                                    />
                                )}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground >
    );
};

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#08131F',
        padding: 0, paddingTop: 25, paddingBottom: height * 0.1,
    },
    contentScroll: {
        // marginTop: 10,
        width: "100%",
        // paddingHorizontal: 25,
        paddingBottom: 100, // pb-20 (approx 80px for bottom nav space)
    },
    contentCategoryTitle: {
        color: theme.textColor,
        fontSize: 17, // text-lg
        fontFamily: "Outfit-Light-BETA",
        marginTop: 15, // mt-5 (approx 20px)
        marginBottom: 16, // mb-4
    },
    category: {
        backgroundColor: theme.transparentBg,
        borderWidth: 0.9, borderColor: theme.borderColor,
        borderRadius: 8,
        marginBottom: 20,
        padding: 10,
        gap: 10,
    },
    contentCategoryList: {

        flexDirection: "col",
        gap: 12,
        width: "100%",
    },
    contentCategoryButton: {
        width: "100%",
        height: 60,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        paddingHorizontal: 16,
        borderRadius: 10, // rounded-xl
    },
    contentCategoryButtonActive: {
        color: theme.textColor,
    },
    contentCategoryIcon: {
        maxWidth: 60, // w-5
        height: "100%", // h-5
        resizeMode: 'contain',
        marginRight: 8, // mr-2
    },
    contentCategoryButtonText: {
        fontFamily: "Outfit-Regular",
        color: theme.textColor,
        fontSize: 16, // text-sm
    },
    sectionContainer: {
    },
    sectionTitle: {
        color: theme.textColor,
        fontSize: 17, // text-lg
        fontFamily: "Outfit-Light-BETA",
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
        color: theme.textColor,
    },
    navText: {
        color: theme.textColor,
        fontSize: 10, // text-xs
    },
});

export default PillarsCategoryScreen;
