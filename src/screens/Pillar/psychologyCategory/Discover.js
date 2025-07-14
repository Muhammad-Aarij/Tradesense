import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, Image, ImageBackground, Dimensions,
    TouchableOpacity, FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { useTopPicks, useRecommendations, useBundles, useDailyThought } from '../../../functions/DiscoverApis';
import { ThemeContext } from '../../../context/ThemeProvider';
import { bg, discover1, discoverLight, info, video1 } from '../../../assets/images';
import RecommendationTile from '../../../components/RecommendationTile';
import TopPickTile from '../../../components/TopPickTile';
import BundleTileSection from '../../../components/BundleTileSection';
import AudioMediaTile from '../../../components/AudioMediaTile';
import AnimatedInfoBox from '../../../components/AnimatedInfoBox';

const { height } = Dimensions.get('window');

const DiscoverScreen = () => {
    const { theme, isDarkMode } = useContext(ThemeContext);
    const [selectedCard, setSelectedCard] = useState(0);
    const [showRecommendationsInfo, setShowRecommendationsInfo] = useState(false);
    const [showTopPicksInfo, setShowTopPicksInfo] = useState(false);
    const { userObject } = useSelector(state => state.auth);
    const userId = userObject?._id;

    const dispatch = useDispatch();

    const { data: topPicks, isLoading: loadingTop } = useTopPicks(userId);
    const { data: recommendations, isLoading: loadingRec } = useRecommendations(userId);
    const { data: bundles, isLoading: loadingBundles, error: bundlesError } = useBundles(userId);
    const { data: dailyThought, isLoading: loadingThought } = useDailyThought();

    // Preload critical images when component mounts
    useEffect(() => {
        if (recommendations && recommendations.length > 0) {
            // Preload first few recommendation images
            recommendations.slice(0, 3).forEach(item => {
                if (item.thumbnail) {
                    const secureUrl = item.thumbnail.startsWith('http://') ? item.thumbnail.replace('http://', 'https://') : item.thumbnail;
                    Image.prefetch(secureUrl).catch(() => {});
                }
            });
        }
    }, [recommendations]);

    useEffect(() => {
        if (topPicks && topPicks.length > 0) {
            // Preload first few top picks images
            topPicks.slice(0, 3).forEach(item => {
                if (item.thumbnail) {
                    const secureUrl = item.thumbnail.startsWith('http://') ? item.thumbnail.replace('http://', 'https://') : item.thumbnail;
                    Image.prefetch(secureUrl).catch(() => {});
                }
            });
        }
    }, [topPicks]);

    useEffect(() => {
        dispatch(startLoading());
        if (!loadingTop && !loadingRec && !loadingBundles && !loadingThought) {
            dispatch(stopLoading());
        }
    }, [loadingTop, loadingRec, loadingBundles, loadingThought, dispatch]);

    // Memoize styles and image to prevent unnecessary re-renders
    const styles = useMemo(() => getStyles(theme), [theme]);
    const topImage = useMemo(() => !isDarkMode ? discoverLight : discover1, [isDarkMode]);
    
    // Memoize filtered bundles to prevent unnecessary re-computation
    const filteredBundles = useMemo(() => {
        return bundles && Array.isArray(bundles) 
            ? bundles.filter(bundle => bundle.resources && Array.isArray(bundle.resources) && bundle.resources.length > 0)
            : [];
    }, [bundles]);

    // Memoize callbacks to prevent unnecessary re-renders
    const handleCardPress = useCallback((index) => {
        setSelectedCard(index);
    }, []);

    const handleRecommendationsInfo = useCallback(() => {
        setShowRecommendationsInfo(true);
    }, []);

    const handleTopPicksInfo = useCallback(() => {
        setShowTopPicksInfo(true);
    }, []);

    const handleCloseRecommendationsInfo = useCallback(() => {
        setShowRecommendationsInfo(false);
    }, []);

    const handleCloseTopPicksInfo = useCallback(() => {
        setShowTopPicksInfo(false);
    }, []);

    return (
        <ImageBackground source={theme.bg} style={styles.container} resizeMode="cover">
            <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
                {/* Header Image */}
                <View style={{ position: 'relative', height: height / 2.8 }}>
                    <Image source={topImage} style={styles.topImg} />
                    <View style={styles.centeredOverlay}>
                        <Text style={styles.titleB}>Discover</Text>
                    </View>
                </View>

                {/* Recommendations */}
                <View style={styles.section}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <Text style={[styles.sectionTitle, { marginBottom: 0, paddingHorizontal: 0, paddingLeft: 25, }]}>Top Recommendations</Text>
                        <TouchableOpacity onPress={handleRecommendationsInfo}>
                            <Image source={info} style={{ width: 20, height: 20, resizeMode: "contain", marginLeft: 10 }} />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={recommendations || []}
                        renderItem={({ item, index }) => {
                            // Add logging to debug recommendations data
                            console.log('=== Discover Recommendations Debug ===');
                            console.log(`Recommendation ${index}:`, {
                                id: item._id,
                                title: item.title,
                                type: item.type,
                                url: item.url,
                                thumbnail: item.thumbnail,
                                isPremium: item.isPremium
                            });
                            console.log('======================================');
                            
                            return (
                                <RecommendationTile
                                    thumbnail={item.thumbnail}
                                    title={item.title}
                                    type={item.type}
                                    url={item.url}
                                    lock={item.isPremium}
                                    description={item.description}
                                    isCenter={index === selectedCard}
                                    onPress={() => handleCardPress(index)}
                                />
                            );
                        }}
                        keyExtractor={(item) => item._id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ marginLeft: 25 }}
                        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                        initialNumToRender={3}
                        maxToRenderPerBatch={3}
                        windowSize={10}
                        removeClippedSubviews={true}
                        getItemLayout={(data, index) => (
                            { length: 192, offset: 192 * index, index }
                        )}
                    />
                </View>

                {/* Top Picks Section */}
                <View style={styles.section}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <Text style={[styles.sectionTitle, { marginBottom: 0, paddingHorizontal: 0, paddingLeft: 25, }]}>Top Picks for you</Text>
                        <TouchableOpacity onPress={handleTopPicksInfo}>
                            <Image source={info} style={{ width: 20, height: 20, resizeMode: "contain", marginLeft: 10 }} />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={topPicks || []}
                        renderItem={({ item }) => (
                            <TopPickTile
                                type={item.type}
                                title={item.title}
                                description={item.description}
                                imageSource={item.thumbnail}
                                locked={item.isPremium}
                                url={item.url}
                            />
                        )}
                        keyExtractor={(item) => item._id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ marginLeft: 25 }}
                        ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
                        initialNumToRender={3}
                        maxToRenderPerBatch={3}
                        windowSize={10}
                        removeClippedSubviews={true}
                        getItemLayout={(data, index) => (
                            { length: 188, offset: 188 * index, index }
                        )}
                    />
                </View>

                {loadingThought ? (
                    <Text style={{ color: theme.subTextColor, paddingHorizontal: 25 }}>Loading Daily Thought...</Text>
                ) : dailyThought ? (
                    <AudioMediaTile
                        title={dailyThought.title}
                        title2={dailyThought.category?.toUpperCase() || 'DAILY'}
                        duration="3-10 MIN"
                        imageSource={{ uri: dailyThought.thumbnail }}
                        description={dailyThought.description}
                        locked={dailyThought.isPremium}
                        onPress={() => {
                            console.log('Play:', dailyThought.url);
                        }}
                    />
                ) : null}


                {/* Bundles */}
                {filteredBundles.map((bundle) => (
                    <View key={bundle.goal} style={styles.section}>
                        <Text style={styles.sectionTitle}>{bundle.goal}</Text>
                        <FlatList
                            data={bundle.resources}
                            renderItem={({ item }) => (
                                <BundleTileSection
                                    title={item.title}
                                    description={item.description}
                                    imageSource={{ uri: item.thumbnail }}
                                    locked={item.isPremium}
                                    type={item.type}
                                    url={item.url}
                                />
                            )}
                            keyExtractor={(item) => item._id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ marginLeft: 25 }}
                            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                            initialNumToRender={3}
                            maxToRenderPerBatch={3}
                            windowSize={10}
                            removeClippedSubviews={true}
                            getItemLayout={(data, index) => (
                                { length: 172, offset: 172 * index, index }
                            )}
                        />
                    </View>
                ))}

                {/* Animated Info Boxes */}
                <AnimatedInfoBox
                    isVisible={showRecommendationsInfo}
                    onClose={handleCloseRecommendationsInfo}
                    title="Top Recommendations"
                    message="These are personalized recommendations based on your trading goals, experience level, and learning preferences. We analyze your behavior and interests to suggest the most relevant content that will help you grow as a trader."
                    position="center"
                />

                <AnimatedInfoBox
                    isVisible={showTopPicksInfo}
                    onClose={handleCloseTopPicksInfo}
                    title="Top Picks for You"
                    message="Curated content handpicked by our expert team specifically for your trading journey. These picks represent the highest quality resources that align with your current skill level and learning objectives."
                    position="center"
                />
            </ScrollView>
        </ImageBackground>
    );
};

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.bg,
        paddingBottom: 85,
    },
    contentScroll: {
        width: '100%',
    },
    section: {
        marginBottom: 20,
    },

    sectionTitle: {
        color: theme.textColor,
        fontSize: 13,
        fontFamily: "Inter-Medium",
        marginBottom: 12,
        paddingHorizontal: 25,
    },
    topImg: {
        width: '100%',
        height: height / 3,
    },
    centeredOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    titleB: {
        color: theme.textColor + 'B3', // 70% opacity
        fontSize: 30,
        fontFamily: 'Inter-SemiBold',
    },
});

export default DiscoverScreen;
