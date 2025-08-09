import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import theme from "../../themes/theme";

const TextCard = ({ episodeNumber, title, decription, onPress }) => {


  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.episodeItem}>
        <View style={styles.episodeNumberContainer}>
          <Text style={styles.episodeNumber}>{episodeNumber}</Text>
        </View>
        <View style={styles.episodeInfo}>
          <Text style={styles.episodeTitle}>{title}</Text>
          <Text numberOfLines={2} style={styles.episodeDuration}>{decription}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 0.9,
    borderColor: theme.borderColor,
    borderRadius: 8,
    paddingHorizontal: 17,
    paddingVertical: 15,
    marginBottom: 15,
  },
  episodeItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  episodeInfo: {
    flex: 1,
  },
  episodeTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Outfit-Light-BETA",
  },
  episodeDuration: {
    color: "#FFF",
    fontSize: 13,
    fontFamily: "Outfit-Thin-BETA",
  },
  heartButton: {
    padding: 10,
  },
});

export default TextCard;
