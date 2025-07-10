import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, Image, ImageBackground, Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/slice/loaderSlice';
import { useTopPicks, useRecommendations, useBundles } from '../../../functions/DiscoverApis';
import theme from '../../../themes/theme';
import { bg, discover1, video1, video3 } from '../../../assets/images';
import RecommendationTile from '../../../components/RecommendationTile';
import TopPicksSection from '../../../components/TopPicksSection';
import BundleTileSection from '../../../components/BundleTileSection';
import AudioMediaTile from '../../../components/AudioMediaTile';

const { height } = Dimensions.get('window');

const DiscoverScreen = () => {
    const [selectedCard, setSelectedCard] = useState(0);
    const { userObject } = useSelector(state => state.auth);
    const userId = userObject?._id;
    // const userId = '6853b8d8db9a55c298462b64'; // replace with dynamic if needed
    const dispatch = useDispatch();

    // Debug userId
    useEffect(() => {
        console.log('UserObject:', userObject);
        console.log('UserId:', userId);
    }, [userObject, userId]);

    const { data: topPicks, isLoading: loadingTop } = useTopPicks(userId);
    const { data: recommendations, isLoading: loadingRec } = useRecommendations(userId);
    const { data: bundles, isLoading: loadingBundles, error: bundlesError } = useBundles(userId);

    useEffect(() => {
        dispatch(startLoading());

        if (!loadingTop && !loadingRec && !loadingBundles) {
            dispatch(stopLoading());
        }
    }, [loadingTop, loadingRec, loadingBundles]);

    // Debug bundles data
    useEffect(() => {
        if (bundles) {
            console.log('Bundles data:', bundles);
            console.log('Is bundles an array?', Array.isArray(bundles));
        }
        if (bundlesError) {
            console.log('Bundles error:', bundlesError);
        }
    }, [bundles, bundlesError]);

    return (
        <ImageBackground source={bg} style={styles.container} resizeMode="cover">
            <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
                {/* Header Image */}
                <View style={{ position: 'relative', height: height / 3 }}>
                    <Image source={discover1} style={styles.topImg} />
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

                <Text style={styles.sectionTitle}>Top Picks for you</Text>   
                {/* Top Picks Section */}
                <View style={styles.section}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <TopPicksSection topPicks={topPicks} />
                    </ScrollView>
                </View>

                {/* Daily Thought */}
                <View style={styles.section}>
                    <AudioMediaTile
                        title="Daily Thought"
                        title2="MEDITATION"
                        duration="3-10 MIN"
                        imageSource={video1}
                        description="Daily reflective guidance"
                        onPress={() => { }}
                    />
                </View>

                {/* Bundles */}
                {bundles && Array.isArray(bundles) && bundles.map((bundle, i) => (
                    <View key={bundle.goal} style={styles.section}>
                        <Text style={styles.sectionTitle}>{bundle.goal}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginLeft: 25 }}>
                            {bundle.resources && Array.isArray(bundle.resources) && bundle.resources.map((item) => (
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
                ))}
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#08131F', paddingBottom: 85 },
    contentScroll: { width: '100%' },
    section: { marginBottom: 20 },
    category: {
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
        paddingRight: 45,
    },
    sectionTitle: {
        color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 12, paddingHorizontal: 25,
    },
    topImg: { width: '100%', height: height / 3 },
    centeredOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center', alignItems: 'center', zIndex: 1,
    },
    titleB: {
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: 30,
        fontFamily: 'Inter-SemiBold',
    },
});

export default DiscoverScreen;
