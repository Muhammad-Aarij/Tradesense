import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Image, ImageBackground, Dimensions } from 'react-native';
import TopMenuScroll from '../TopMenuScroll';
import AudioCard from '../AudioCard';
import VideoCard from '../VideoCard';
import Header from '../../../components/Header';
import theme from '../../../themes/theme';
import { useResources, useAllPillars } from '../../../functions/PillarsFunctions';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { bg, circleTop, pillar } from '../../../assets/images';

const { height, width } = Dimensions.get('window');

const PsychologyCategoryScreen = ({ navigation, route }) => {
    const dispatch = useDispatch();

    const { data: allPillars = [], isLoading: isLoadingPillars } = useAllPillars();

    const [pillarName, setPillarName] = useState(route.params?.name || '');
    const [categories, setCategories] = useState(route.params?.categories || []);
    const [selectedTopCategory, setSelectedTopCategory] = useState(route.params?.categories?.[0] || '');

    // Fallback: Load first pillar if no route data
    useEffect(() => {
        if ((!pillarName || categories.length === 0) && allPillars.length > 0) {
            const firstPillar = allPillars[0];
            setPillarName(firstPillar.name);
            setCategories(firstPillar.categories);
            setSelectedTopCategory(firstPillar.categories?.[0] || '');
        }
    }, [allPillars]);

    const {
        data: audios = [],
        isLoading: isLoadingAudios,
    } = useResources({
        name: pillarName,
        category: selectedTopCategory,
        type: 'audio',
    });

    const {
        data: videos = [],
        isLoading: isLoadingVideos,
    } = useResources({
        name: pillarName,
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
                <Text style={styles.title}>{pillarName}</Text>
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
                                    onPress={() =>
                                        navigation.navigate('TrackPlayer', {
                                            AudioTitle: audio.title,
                                            AudioDescr: audio.description,
                                            Thumbnail: audio.thumbnail,
                                            AudioUrl: audio.url,
                                            shouldFetchTrack: false, // ✅ force reset and play new track
                                        })
                                    }
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

                                        onPress={() => navigation.navigate('VideoPlayer', {
                                            VideoTitle: item.title,
                                            VideoDescr: item.description,
                                            Thumbnail: item.thumbnail,
                                            VideoUrl: item.url,
                                        })}
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
        padding: 0, paddingTop: 0, paddingBottom: 90,
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
