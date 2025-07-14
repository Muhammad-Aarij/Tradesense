import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import TopPickTile from './TopPickTile';
import { ThemeContext } from '../context/ThemeProvider'; // adjust path if needed

const TopPicksSection = ({ topPicks }) => {
    const { theme } = useContext(ThemeContext);

    if (!topPicks || topPicks.length === 0) return null;

    const styles = getStyles(theme);

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {topPicks.map((item) => (
                    <TopPickTile
                        key={item._id}
                        type={item.type}
                        title={item.title}
                        description={item.description}
                        imageSource={item.thumbnail}
                        locked={item.isPremium}
                        url={item.url}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const getStyles = (theme) => StyleSheet.create({
    container: {
        marginLeft: 25,
    },
    heading: {
        color: theme.textColor,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
    },
});

export default TopPicksSection;
