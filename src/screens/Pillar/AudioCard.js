import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import theme from "../../themes/theme";
import { heart, heartOutline, hearts } from "../../assets/images";

// --- Placeholder Images (Replace with your actual imports) ---
const playIcon = { uri: "https://placehold.co/20x20/FFFFFF/000?text=%E2%96%B6" }; // Play icon
const heartOutlineIcon = { uri: "https://placehold.co/20x20/FFFFFF/000?text=%E2%99%A1" }; // Heart outline
const heartFilledIcon = { uri: "https://placehold.co/20x20/FF6347/FFFFFF?text=%E2%99%A5" }; // Heart filled
// --- End Placeholder Images ---

const AudioCard = ({ episodeNumber, title, duration, isLiked: initialIsLiked, onPress }) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  const toggleLike = () => {
    setIsLiked((prevLiked) => !prevLiked);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.episodeItem}>
        <View style={styles.episodeNumberContainer}>
          <Text style={styles.episodeNumber}>{episodeNumber}</Text>
        </View>
        <View style={styles.episodeInfo}>
          <Text style={styles.episodeTitle}>{title}</Text>
          <Text style={styles.episodeDuration}>{duration}</Text>
        </View>
        <TouchableOpacity style={styles.heartButton} onPress={toggleLike}>
          <Image
            source={isLiked ? heart : heartOutline}
            style={{ width: 20, height: 20, resizeMode: "contain" }}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 0.9,
    borderColor: theme.borderColor,
    borderRadius: 8,
    // paddingVertical: 12,
    paddingHorizontal: 15,
  },
  episodeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  episodeNumberContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 24,
  },
  episodeNumber: {
    color: "#FFF",
    fontSize: 19.4,
    fontFamily: "Inter-SemiBold",
  },
  episodeInfo: {
    flex: 1,
  },
  episodeTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "Inter-Regular",
  },
  episodeDuration: {
    color: "#AAAAAA",
    fontSize: 12,
    fontFamily: "Inter-Light-BETA",
  },
  heartButton: {
    padding: 10,
  },
});

export default AudioCard;
