import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Image, ImageBackground, Dimensions } from 'react-native';
import TopMenuScroll from '../TopMenuScroll';
import { afirm, audio, bg, calm, circleTop, meditation, mobile, success, video, video1, video2, video3, videoY } from '../../../assets/images';
import AudioCard from '../AudioCard';
import VideoCard from '../VideoCard';
import Header from '../../../components/Header';
import theme from '../../../themes/theme';
import { useResources } from '../../../functions/PillarsFunctions';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
const { height, width } = Dimensions.get('window');

// const mockAudios = [
//     { id: 'a1', title: 'The Power of Mindfulness', duration: '5 min', isLiked: false },
//     { id: 'a2', title: 'Daily Gratitude Practice', duration: '8 min', isLiked: true },
//     { id: 'a3', title: 'Focus and Productivity', duration: '6 min', isLiked: false },
// ];

// const mockVideos = [
//     { id: 'v1', title: "Psychology", descr: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', image: video1 },
//     { id: 'v2', title: "Meditation", descr: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', image: video2 },
//     { id: 'v3', title: "Fitness", descr: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', image: video3 },
// ];


const PsychologyCategoryScreen = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const { name, categories } = route.params;
    const [selectedTopCategory, setSelectedTopCategory] = useState(() => categories?.[0] || '');

    useEffect(() => {
        if (categories?.length > 0) {
            setSelectedTopCategory(categories[0]);
        }
    }, [categories]);

    const {
        data: audios = [],
        isLoading: isLoadingAudios,
    } = useResources({
        name,
        category: selectedTopCategory,
        type: 'audio',
    });

    const {
        data: videos = [],
        isLoading: isLoadingVideos,
    } = useResources({
        name,
        category: selectedTopCategory,
        type: 'video',
    });


    useEffect(() => {
        dispatch(startLoading());
        const timeout = setTimeout(() => {
            if (!isLoadingAudios && !isLoadingVideos) {
                dispatch(stopLoading());
            }
        }, 1000);
        return () => clearTimeout(timeout);
    }, [isLoadingAudios, isLoadingVideos]);


    return (
        <ImageBackground source={bg} style={styles.container}>
            <ScrollView style={styles.contentScroll}>
                <View style={{ paddingHorizontal: 25, position: "absolute", zIndex: 100 }}>
                    <Header title={""} />
                </View>
                <Image source={circleTop} style={styles.topImg} />
                <Text style={styles.title}>{name}</Text>
                {/* Top Menu Scroll */}
                {categories?.length > 0 && (
                    <TopMenuScroll
                        items={categories.map((cat) => ({ id: cat, name: cat }))}
                        selectedItem={selectedTopCategory}
                        onItemSelected={setSelectedTopCategory}
                    />
                )}
                <View style={{ paddingLeft: 25, }}>

                    <View style={{ ...styles.sectionContainer, paddingRight: 25 }}>
                        <TouchableOpacity
                            style={{
                                marginTop: 25,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                            onPress={() =>
                                navigation.navigate("PillarScreen", {
                                    audios: audios,
                                    name: name,
                                    ContentOption: selectedTopCategory,
                                    contentType: "audio",
                                    category: categories,

                                })
                            }
                        >
                            <Text style={{ ...styles.sectionTitle, }}>Audios | Meditation & Calm</Text>
                            <Text style={{ ...styles.sectionTitle, color: theme.primaryColor, fontFamily: "Inter-Medium", fontSize: 11, }}>View All</Text>
                        </TouchableOpacity>
                        <View style={styles.category}>
                            {audios.slice(0, 3).map((audio, index) => (
                                <AudioCard
                                    key={audio.id}
                                    episodeNumber={`${index + 1}`}
                                    title={audio.title}
                                    audio={audio.url}
                                    isLiked={audio.isLiked}
                                    onPress={() => navigation.navigate('TrackPlayer', {
                                        AudioTitle: audio.title,
                                        AudioDescr: audio.description,
                                        Thumbnail: audio.thumbnail,
                                        AudioUrl: audio.url,
                                    })}
                                />
                            ))}
                        </View>
                    </View>

                    <View style={styles.sectionContainer}>
                        <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between", paddingRight: 25, }}
                            onPress={() =>
                                navigation.navigate("PillarScreen", {
                                    audios: videos,
                                    ContentOption: selectedTopCategory,
                                    contentType: "video",
                                    category: categories,
                                    name: name,
                                })}>
                            <Text style={styles.sectionTitle}>Guided Meditation | Illustration Videos</Text>
                            <Text style={{ ...styles.sectionTitle, color: theme.primaryColor, fontFamily: "Inter-Medium", fontSize: 11, }}>View All</Text>
                        </TouchableOpacity>
                        <View style={styles.category}>
                            <FlatList
                                horizontal
                                data={videos.slice(0, 3)}
                                keyExtractor={(item) => item.id}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalCardList}
                                renderItem={({ item }) => (
                                    <VideoCard
                                        style={{ marginRight: 10 }}
                                        title={item.title}
                                        duration={item.duration}
                                        imageSource={item.thumbnail}
                                        decription={item.description}
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

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#08131F',
        padding: 0, paddingTop: 0, paddingBottom: height * 0.1,
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
        // paddingBottom: 8, // pb-2
        // gap:10
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

export default PsychologyCategoryScreen;
