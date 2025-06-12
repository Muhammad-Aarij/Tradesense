import React, { useState } from "react";
import { View, ImageBackground, StyleSheet } from "react-native";
import TopMenuScroll from "../TopMenuScroll";
import AudioContent from "./AudioContent";
import VideoContent from "./VideoContent";
import Header from "../../../components/Header";
import { audio2, bg, graphical, text, videoIcon } from "../../../assets/images";

const TopCategories = [
    { id: 'Audios', name: 'Audios', icon: audio2 },
    { id: 'Videos', name: 'Videos', icon: videoIcon },
    { id: 'Graphical', name: 'Graphical', icon: graphical },
    { id: 'Text', name: 'Text', icon: text },
];

const PillarScreen = () => {
    const [selectedTopCategory, setSelectedTopCategory] = useState(TopCategories[0].id);

    return (
        <ImageBackground source={bg} style={styles.container}>
            <View style={{ paddingHorizontal: 25 }}>
                <Header title={"Psychology"} />
            </View>

            {/* Top Menu Scroll */}
            <TopMenuScroll
                items={TopCategories}
                selectedItem={selectedTopCategory}
                onItemSelected={setSelectedTopCategory}
            />

            {/* Conditionally Render Content */}
            <View style={styles.contentContainer}>
                {selectedTopCategory === "Audios" && <AudioContent />}
                {selectedTopCategory === "Videos" && <VideoContent />}
                {/* {selectedTopCategory === "Graphical" && <GraphicalContent />}
        {selectedTopCategory === "Text" && <TextContent />} */}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex:1 },
    contentContainer: {flex:1, paddingHorizontal: 25, marginTop: 20 },
});

export default PillarScreen;
