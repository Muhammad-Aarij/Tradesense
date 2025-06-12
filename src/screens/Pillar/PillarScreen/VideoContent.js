import React from "react";
import { FlatList } from "react-native";
import VideoCard from "../VideoCard";

const mockVideos = [
    { id: "v1", title: "Introduction to Psychology", description: "Learn the basics of psychology.", imageSource: null },
    { id: "v2", title: "Understanding Anxiety", description: "Deep dive into anxiety and mindfulness.", imageSource: null },
];

const VideoContent = () => {
    return (
        <FlatList
            style={{ flexDirection: "row", flexWrap: "nowrap", flex: 1, }}
            data={mockVideos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <VideoCard {...item} />}
        />
    );
};

export default VideoContent;
