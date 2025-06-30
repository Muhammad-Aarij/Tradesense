import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import TopPickTile from './TopPickTile';

const TopPicksSection = ({ topPicks }) => {
    if (!topPicks || topPicks.length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Top Picks for you</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {topPicks.map((item) => (
                    <TopPickTile
                        key={item._id}
                        type={item.type}
                        title={item.title}
                        description={item.description}
                        imageSource={item.thumbnail }
                        locked={item.isPremium}
                        url={item.url}

                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // marginBottom: 24,
        marginLeft: 25,
    },
    heading: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
    },
});

export default TopPicksSection;
