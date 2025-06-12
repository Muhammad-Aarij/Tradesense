import React, { useContext, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { heart, heartOutline, hearts } from "../../assets/images";
import { ThemeContext } from "../../context/ThemeProvider";


const AudioCard = ({ episodeNumber, title, duration, isLiked: initialIsLiked, onPress }) => {
  const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
  const styles = getStyles(theme);

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

const getStyles = (theme) => StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
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
    color: theme.textColor,
    fontSize: 19.4,
    fontFamily: "Inter-SemiBold",
  },
  episodeInfo: {
    flex: 1,
  },
  episodeTitle: {
    color: theme.textColor,
    fontSize: 13,
    fontFamily: "Inter-Regular",
  },
  episodeDuration: {
    color: theme.textColor,
    fontSize: 12,
    fontFamily: "Inter-Light-BETA",
  },
  heartButton: {
    padding: 10,
  },
});

export default AudioCard;
