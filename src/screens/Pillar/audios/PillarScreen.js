import React, { useEffect, useState } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView, FlatList, Image,
    ImageBackground, Dimensions, SafeAreaView, StyleSheet
} from 'react-native';
import TopMenuScroll from '../TopMenuScroll';
import { audio2, bg, pause, videoIcon, wave } from '../../../assets/images';
import AudioCard from '../AudioCard';
import VideoCard from '../VideoCard';
import Header from '../../../components/Header';
import theme from '../../../themes/theme';
import TextCard from '../TextCard';
import { useDispatch } from 'react-redux';
import { useResources } from '../../../functions/PillarsFunctions';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';

const { height, width } = Dimensions.get('window');

const TopCategories = [
    { id: 'Audios', name: 'Audios', icon: audio2 },
    { id: 'Videos', name: 'Videos', icon: videoIcon },
];

const TextEpisodes = [
    {
        id: 'a1', title: 'Episode 1',
        descr: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
    },
    {
        id: 'a2', title: 'Episode 2',
        descr: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
    },
];

const PillarScreen = ({ route, navigation }) => {
    const { ContentOption, contentType, category = [], name = '' } = route.params;

    const dispatch = useDispatch();

    const [selectedTopCategory1, setSelectedTopCategory1] = useState("Audios");
    const [selectedTopCategory, setSelectedTopCategory] = useState(category[0] || '');

    // Fetch audios
    const {
        data: audios = [],
        isLoading: isLoadingAudios,
    } = useResources({
        name,
        category: selectedTopCategory,
        type: 'audio',
    });

    // Fetch videos
    const {
        data: videos = [],
        isLoading: isLoadingVideos,
    } = useResources({
        name,
        category: selectedTopCategory,
        type: 'video',
    });

    // Handle loading spinner via Redux
    useEffect(() => {
        dispatch(startLoading());
        const timeout = setTimeout(() => {
            if (!isLoadingAudios && !isLoadingVideos) {
                dispatch(stopLoading());
            }
        }, 1000);
        return () => clearTimeout(timeout);
    }, [isLoadingAudios, isLoadingVideos]);

    useEffect(() => {
        if (contentType === "audio") setSelectedTopCategory1("Audios");
        else if (contentType === "video") setSelectedTopCategory1("Videos");
        else setSelectedTopCategory1("Audios");

        if (category?.length > 0) {
            setSelectedTopCategory(category[0]);
        }
    }, [contentType, category]);

    return (
        <ImageBackground source={bg} style={styles.container}>
            <SafeAreaView>
                <ScrollView style={styles.contentScroll}>
                    <View style={{ paddingHorizontal: 25 }}>
                        <Header title={name} />
                    </View>

                    {category.length > 0 && (
                        <TopMenuScroll
                            items={category.map((cat) => ({ id: cat, name: cat }))}
                            selectedItem={selectedTopCategory}
                            onItemSelected={setSelectedTopCategory}
                        />
                    )}
                    <TopMenuScroll
                        items={TopCategories}
                        selectedItem={selectedTopCategory1}
                        onItemSelected={setSelectedTopCategory1}
                    />

                    <View style={{ paddingLeft: 25, marginTop: 25 }}>
                        <View style={{ ...styles.sectionContainer, paddingRight: 25 }}>
                            {selectedTopCategory1 === "Audios" && (
                                <View style={styles.category}>
                                    {audios.map((audio, index) => (
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
                            )}

                            {selectedTopCategory1 === "Videos" && (
                                <View style={styles.category}>
                                    <FlatList
                                        data={videos}
                                        keyExtractor={(item) => item.id}
                                        numColumns={2}
                                        showsVerticalScrollIndicator={false}
                                        contentContainerStyle={styles.videoGridList}
                                        columnWrapperStyle={styles.columnWrapper}
                                        renderItem={({ item }) => (
                                            <View style={styles.videoCardWrapper}>
                                                <VideoCard
                                                    title={item.title}
                                                    imageSource={item.thumbnail}
                                                    decription={item.description}
                                                    onPress={() => console.log(`Play video: ${item.title}`)}
                                                />
                                            </View>
                                        )}
                                    />
                                </View>
                            )}

                            {selectedTopCategory1 === "Text" && (
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
                                                    onPress={() => console.log(`Read text: ${item.title}`)}
                                                />
                                            </View>
                                        )}
                                    />
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>

                {selectedTopCategory1 && false === "Audios" && (
                    <View style={styles.miniPlayer}>
                        <Image source={wave} style={styles.miniPlayerImage} />
                        <View style={styles.miniPlayerTextContent}>
                            <Text style={styles.miniPlayerTitle}>Episode 1</Text>
                            <Text style={styles.miniPlayerCourse}>Daily Calm</Text>
                        </View>
                        <TouchableOpacity style={styles.miniPlayerPlayPauseButton}>
                            <Image source={pause} style={{ width: 20, height: 20, resizeMode: "contain" }} />
                        </TouchableOpacity>
                    </View>
                )}
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#08131F', padding: 0, paddingTop: 20, },
    contentScroll: { width: "100%", paddingBottom: 30 },
    category: { marginBottom: 20, gap: 10 },
    videoCardWrapper: { flex: 1, marginBottom: 10, marginRight: 10 },
    columnWrapper: { justifyContent: 'space-between' },
    sectionContainer: { flexDirection: 'column' },
    videoGridList: { paddingBottom: 20 },
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
    miniPlayerTextContent: { flex: 1 },
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
    miniPlayerPlayPauseButton: { padding: 5 },
});

export default PillarScreen;
