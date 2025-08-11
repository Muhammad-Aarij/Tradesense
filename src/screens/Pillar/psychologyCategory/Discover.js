import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, Image, ImageBackground, Dimensions,
    TouchableOpacity, FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { useTopPicks, useRecommendations, useBundles, useDailyThought, useMusic } from '../../../functions/DiscoverApis';
import { ThemeContext } from '../../../context/ThemeProvider';
import { bg, discover1, discoverLight, info, video1, locked, subscription } from '../../../assets/images';
import RecommendationTile from '../../../components/RecommendationTile';
import TopPickTile from '../../../components/TopPickTile';
import BundleTileSection from '../../../components/BundleTileSection';
import AudioMediaTile from '../../../components/AudioMediaTile';
import AnimatedInfoBox from '../../../components/AnimatedInfoBox';
import { API_URL } from "@env";
import { BackHandler, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { checkSubscriptionStatus } from '../../../functions/checkSubscriptionStatus';
import ScrollToTopWrapper from '../../../components/ScrollToTopWrapper';

const { height } = Dimensions.get('window');


const DiscoverScreen = ({ navigation }) => {
    const { theme, isDarkMode } = useContext(ThemeContext);
    const [selectedCard, setSelectedCard] = useState(0);
    const [showRecommendationsInfo, setShowRecommendationsInfo] = useState(false);
    const [showTopPicksInfo, setShowTopPicksInfo] = useState(false);
    const { userObject } = useSelector(state => state.auth);
    const userId = userObject?._id;
    const isPremium = userObject?.isPremium;
    console.log(userId);
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.loader.isLoading); // <-- Add this
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [showBundlesInfo, setShowBundlesInfo] = useState(false);
    const [showMusicInfo, setShowMusicInfo] = useState(false);

    const { data: topPicks, isLoading: loadingTop } = useTopPicks(userId);
    const { data: recommendations, isLoading: loadingRec } = useRecommendations(userId);
    const { data: bundles, isLoading: loadingBundles, error: bundlesError } = useBundles(userId);
    const { data: music, isLoading: loadingMusic, error: MusicError } = useMusic(userId);
    const { data: dailyThought, isLoading: loadingThought } = useDailyThought();

    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        setIsSubscribed(isPremium);
    }, [isPremium])
    // useFocusEffect(
    //     useCallback(() => {
    //         const fetchSubStatus = async () => {
    //             const status = await checkSubscriptionStatus();
    //             console.log('Status of the User Subscription', status);
    //             setIsSubscribed(status);
    //         };

    //         fetchSubStatus();
    //         // setIsSubscribed(isPremium);
    //     }, [isPremium])
    // );


    // console.log("remcomed", recommendations);
    // Preload critical images when component mounts
    useEffect(() => {
        if (recommendations && recommendations.length > 0) {
            // Preload first few recommendation images
            recommendations.slice(0, 3).forEach(item => {
                if (item.thumbnail) {
                    const secureUrl = item.thumbnail.startsWith('http://') ? item.thumbnail.replace('http://', 'https://') : item.thumbnail;
                    Image.prefetch(secureUrl).catch(() => { });
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
                    Image.prefetch(secureUrl).catch(() => { });
                }
            });
        }
    }, [topPicks]);

    useEffect(() => {
        dispatch(startLoading());
        if (!loadingTop && !loadingRec && !loadingBundles && !loadingThought && !loadingMusic) {
            dispatch(stopLoading());
        }
    }, [loadingTop, loadingRec, loadingBundles, loadingThought, loadingMusic, dispatch]);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (isLoading) {
                    dispatch(stopLoading());
                    return true; // prevent default back action
                } else {
                    BackHandler.exitApp(); // exit app
                    return true;
                }
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => {
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            };
        }, [isLoading])
    );


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

    const formatDuration = (seconds) => {
        if (!seconds || seconds < 60) return '1 min';
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(seconds / 3600);
        return seconds >= 3600 ? `${hours} hour${hours > 1 ? 's' : ''}` : `${minutes} min`;
    };


    return (
        <ImageBackground source={theme.bg} style={styles.container} resizeMode="cover">
            <ScrollToTopWrapper>

                <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
                    {showPremiumModal && (
                        <ConfirmationModal
                            title={"Unlock Premium Content"}
                            message={"Subscribe to access all guided sessions, expert talks, and exclusive audio and video experiences."}
                            icon={subscription}
                            buttonText="Subscribe Now"
                            onClose={() => {
                                setShowPremiumModal(false);
                                navigation.navigate("More", {
                                    screen: "AppSubscription",
                                });
                            }}
                            onCrossClose={() => {
                                setShowPremiumModal(false);
                            }}

                        />
                    )}

                    {/* Header Image */}
                    <View style={{ position: 'relative', height: height / 2.8 }}>
                        <Image source={topImage} style={styles.topImg} />
                        <View style={styles.centeredOverlay}>
                            <Text style={styles.titleB}>Discover</Text>
                        </View>
                    </View>

                    {/* Recommendations */}
                    <View style={styles.section}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }} onPress={handleTopPicksInfo} >
                            <Text style={[styles.sectionTitle, { marginBottom: 0, paddingHorizontal: 0, paddingLeft: 25, }]}>Top Recommendations</Text>
                            <TouchableOpacity onPress={handleRecommendationsInfo}>
                                <Image source={info} style={{ width: 20, height: 20, resizeMode: "contain", marginLeft: 10, tintColor: theme.primaryColor }} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                        <FlatList
                            data={recommendations || []}
                            renderItem={({ item, index }) => {
                                return (
                                    <RecommendationTile
                                        thumbnail={item.thumbnail}
                                        title={item.title}
                                        type={item.type}
                                        url={item.url}
                                        lock={item.isPremium && !isSubscribed}
                                        duration={formatDuration(item.duration)}
                                        pillar={item.pillar}
                                        description={item.description}
                                        isCenter={index === selectedCard}
                                        onPremiumPress={() => setShowPremiumModal(true)}
                                        onPress={() => handleCardPress(index)}
                                    />
                                );
                            }}
                            keyExtractor={(item) => item._id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ marginLeft: 25, paddingRight: 55 }} // 👈 Add this
                            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
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
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }} onPress={handleTopPicksInfo} >
                            <Text style={[styles.sectionTitle, { marginBottom: 0, paddingHorizontal: 0, paddingLeft: 25, }]}>Top Picks for you</Text>
                            <TouchableOpacity onPress={handleTopPicksInfo} >
                                <Image source={info} style={{ width: 20, height: 20, resizeMode: "contain", marginLeft: 10, tintColor: theme.primaryColor }} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                        <FlatList
                            data={topPicks || []}
                            renderItem={({ item }) => (
                                <TopPickTile
                                    imageSource={item.thumbnail}
                                    type={item.type}
                                    title={item.title}
                                    pillar={item.pillar}
                                    description={item.description}
                                    locked={item.isPremium && !isSubscribed}
                                    duration={formatDuration(item.duration)}
                                    url={item.url}
                                    onPremiumPress={() => setShowPremiumModal(true)}
                                />
                            )}
                            keyExtractor={(item) => item._id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ marginLeft: 25, paddingRight: 55 }} // 👈 Add this
                            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
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
                            title={"Daily Thoughts"}
                            title2={dailyThought.category?.toUpperCase() || 'DAILY'}
                            duration="3-10 MIN"
                            imageSource={{ uri: dailyThought.thumbnail }}
                            description={dailyThought.description}
                            locked={dailyThought.isPremium}
                            url={dailyThought.url}
                        // onPress={() => {
                        //     console.log('Play:', dailyThought.url);
                        // }}
                        />
                    ) : null}


                    {/* Bundles */}
                    {filteredBundles.map((bundle) => (
                        <View key={bundle.goal} style={styles.section}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }} onPress={handleTopPicksInfo} >
                                <Text style={[styles.sectionTitle, { marginBottom: 0, paddingHorizontal: 0, paddingLeft: 25, }]}>{bundle.goal}</Text>
                                <TouchableOpacity onPress={() => setShowBundlesInfo(true)}>
                                    <Image source={info} style={{ width: 20, height: 20, resizeMode: "contain", marginLeft: 10, tintColor: theme.primaryColor }} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                            {/* <Text style={styles.sectionTitle}>{bundle.goal}</Text> */}
                            <FlatList
                                data={bundle.resources}
                                renderItem={({ item }) => (
                                    <BundleTileSection
                                        title={item.title}
                                        pillar={item.pillar}
                                        description={item.description}
                                        imageSource={{ uri: item.thumbnail }}
                                        locked={item.isPremium && !isSubscribed}
                                        type={item.type}
                                        duration={formatDuration(item.duration)}
                                        url={item.url}
                                        onPremiumPress={() => setShowPremiumModal(true)}
                                    />
                                )}
                                keyExtractor={(item) => item._id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ marginLeft: 25, paddingRight: 55 }}
                                // ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
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
                    {/* Music Section */}
                    {music && Array.isArray(music.music) && music.music.length > 0 && (
                        <View style={styles.section}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }} onPress={handleTopPicksInfo} >
                                <Text style={[styles.sectionTitle, { marginBottom: 0, paddingHorizontal: 0, paddingLeft: 25, }]}>Music for You</Text>
                                <TouchableOpacity onPress={() => setShowMusicInfo(true)}>
                                    <Image source={info} style={{ width: 20, height: 20, resizeMode: "contain", marginLeft: 10, tintColor: theme.primaryColor }} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                            {/* <Text style={styles.sectionTitle}>Music for You</Text> */}
                            <FlatList
                                data={music.music}
                                renderItem={({ item }) => (
                                    <BundleTileSection
                                        title={item.title}
                                        description={item.description}
                                        imageSource={{ uri: `${item.thumbnail}` }}
                                        locked={item.isPremium && !isSubscribed}
                                        pillar={item.pillar}
                                        type="audio"
                                        duration={formatDuration(item.duration)}
                                        url={`${item.url}`}
                                        onPremiumPress={() => setShowPremiumModal(true)}
                                    />
                                )}
                                keyExtractor={(item) => item._id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ marginLeft: 25 }}
                                initialNumToRender={3}
                                maxToRenderPerBatch={3}
                                windowSize={10}
                                removeClippedSubviews={true}
                                getItemLayout={(data, index) => (
                                    { length: 172, offset: 172 * index, index }
                                )}
                            />
                        </View>
                    )}


                    {/* Animated Info Boxes */}
                    <AnimatedInfoBox
                        isVisible={showRecommendationsInfo}
                        onClose={handleCloseRecommendationsInfo}
                        title="Top Recommendations"
                        message="These are personalized recommendations based on your trading goals, experience level, and learning preferences. We analyze your behavior and Outfitests to suggest the most relevant content that will help you grow as a trader."
                        position="center"
                    />

                    <AnimatedInfoBox
                        isVisible={showTopPicksInfo}
                        onClose={handleCloseTopPicksInfo}
                        title="Top Picks for You"
                        message="Curated content handpicked by our expert team specifically for your trading journey. These picks represent the highest quality resources that align with your current skill level and learning objectives."
                        position="center"
                    />
                    <AnimatedInfoBox
                        isVisible={showBundlesInfo}
                        onClose={() => setShowBundlesInfo(false)}
                        title="Bundles"
                        message="Bundles are curated collections of content grouped by specific trading goals. They provide structured learning experiences across different skill levels and topics to help you master key areas efficiently."
                        position="center"
                    />

                    <AnimatedInfoBox
                        isVisible={showMusicInfo}
                        onClose={() => setShowMusicInfo(false)}
                        title="Music for You"
                        message="Enjoy specially selected audio tracks designed to help you focus, relax, or energize your trading day. These tracks align with your mood and trading rhythm."
                        position="center"
                    />

                </ScrollView>
            </ScrollToTopWrapper>
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
        fontFamily: "Outfit-Medium",
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
        fontFamily: 'Outfit-SemiBold',
    },
});

export default DiscoverScreen;