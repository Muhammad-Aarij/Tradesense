import React from "react";
import { View, FlatList } from "react-native";
import AudioCard from "../AudioCard";

const mockAudios = [
  { id: "a1", title: "Mindfulness", duration: "5 min", isLiked: false },
  { id: "a2", title: "Daily Gratitude", duration: "8 min", isLiked: true },
  { id: "a1", title: "Mindfulness", duration: "5 min", isLiked: false },
  { id: "a2", title: "Daily Gratitude", duration: "8 min", isLiked: true },
  { id: "a1", title: "Mindfulness", duration: "5 min", isLiked: false },
  { id: "a2", title: "Daily Gratitude", duration: "8 min", isLiked: true },
  { id: "a1", title: "Mindfulness", duration: "5 min", isLiked: false },
  { id: "a2", title: "Daily Gratitude", duration: "8 min", isLiked: true },
  { id: "a1", title: "Mindfulness", duration: "5 min", isLiked: false },
  { id: "a2", title: "Daily Gratitude", duration: "8 min", isLiked: true },
  { id: "a1", title: "Mindfulness", duration: "5 min", isLiked: false },
  { id: "a2", title: "Daily Gratitude", duration: "8 min", isLiked: true },
];

const AudioContent = () => {
  return (
    <FlatList
      data={mockAudios}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <AudioCard {...item} />}
    />
  );
};

export default AudioContent;
