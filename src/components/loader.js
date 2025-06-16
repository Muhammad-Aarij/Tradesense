import React from "react";
import { StyleSheet, View, Text } from "react-native";
import LottieView from "lottie-react-native";
import { BlurView } from "@react-native-community/blur";
import theme from "../themes/theme";

export default function Loader() {
  return (
    <View style={styles.container}>
      <BlurView style={styles.blur} blurType="dark" blurAmount={10} />
      <View style={styles.overlay}>
        <LottieView 
          source={require("../assets/loaderr.json")} 
          autoPlay 
          loop 
          style={styles.animation} 
        />
        <Text style={styles.text}>Loading</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // Ensure it overlays on top
    justifyContent: "center",
    alignItems: "center",
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  overlay: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
  },
  animation: {
    width: 150,
    height: 150,
  },
  text: {
    fontFamily: "Inter-Medium",
    fontSize: 20,
    color: theme.primaryColor,
    marginTop: 10,
  },
});
