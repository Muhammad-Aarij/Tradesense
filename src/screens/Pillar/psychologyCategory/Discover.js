import React, { useEffect, useState, useContext } from 'react';
import {
    View, Text, StyleSheet, ScrollView, Image, ImageBackground, Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { useTopPicks, useRecommendations, useBundles, useDailyThought } from '../../../functions/DiscoverApis';
import { ThemeContext } from '../../../context/ThemeProvider';
import { bg, discover1, discoverLight, video1 } from '../../../assets/images';
import RecommendationTile from '../../../components/RecommendationTile';
import TopPicksSection from '../../../components/TopPicksSection';
import BundleTileSection from '../../../components/BundleTileSection';
import AudioMediaTile from '../../../components/AudioMediaTile';

const { height } = Dimensions.get('window');

const DiscoverScreen = () => {
    const { theme, isDarkMode } = useContext(ThemeContext);
    const [selectedCard, setSelectedCard] = useState(0);
    const { userObject } = useSelector(state => state.auth);
    const userId = userObject?._id;

    const dispatch = useDispatch();

    const { data: topPicks, isLoading: loadingTop } = useTopPicks(userId);
    const { data: recommendations, isLoading: loadingRec } = useRecommendations(userId);
    const { data: bundles, isLoading: loadingBundles, error: bundlesError } = useBundles(userId);
    const { data: dailyThought, isLoading: loadingThought } = useDailyThought();

    console.log(bundles);
    useEffect(() => {
        dispatch(startLoading());
        if (!loadingTop && !loadingRec && !loadingBundles) {
            dispatch(stopLoading());
        }
    }, [loadingTop, loadingRec, loadingBundles]);


    const styles = getStyles(theme);
    const topImage = !isDarkMode ? discoverLight : discover1;

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
                    <Text style={styles.sectionTitle}>Top Recommendations</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={[styles.category, { marginLeft: 25 }]}
                    >
                        {recommendations?.map((item, index) => (
                            <RecommendationTile
                                key={item._id}
                                thumbnail={item.thumbnail}
                                title={item.title}
                                type={item.type}
                                url={item.url}
                                lock={item.isPremium}
                                description={item.description}
                                isCenter={index === selectedCard}
                                onPress={() => setSelectedCard(index)}
                            />
                        ))}
                    </ScrollView>
                </View>

                {/* Top Picks Section */}
                <View style={styles.section}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <TopPicksSection topPicks={topPicks} />
                    </ScrollView>
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
                {bundles && Array.isArray(bundles) && bundles.map((bundle) => {
                    if (!Array.isArray(bundle.resources) || bundle.resources.length === 0) return null;

                    return (
                        <View key={bundle.goal} style={styles.section}>
                            <Text style={styles.sectionTitle}>{bundle.goal}</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginLeft: 25 }}>
                                {bundle.resources.map((item) => (
                                    <BundleTileSection
                                        key={item._id}
                                        title={item.title}
                                        description={item.description}
                                        imageSource={{ uri: item.thumbnail }}
                                        locked={item.isPremium}
                                        type={item.type}
                                        url={item.url}
                                    />
                                ))}
                            </ScrollView>
                        </View>
                    );
                })}

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
    category: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        paddingRight: 45,
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
