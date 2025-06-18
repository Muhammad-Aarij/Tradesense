import React from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";
import LottieView from "lottie-react-native";
import theme from "../themes/theme";
import { bg } from "../assets/images";

export default function Loader() {
  return (
<ImageBackground  style={styles.container} resizeMode="cover">
      {/* <BlurView style={styles.blur} blurType="dark" blurAmount={10} /> */}
      <View style={styles.overlay}>
        <LottieView 
          source={require("../assets/loaderr.json")} 
          autoPlay 
          loop 
          style={styles.animation} 
        />
        <Text style={styles.text}>Loading</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
 container: {
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%",
  backgroundColor:"black"
},

  blur: {
    // ...StyleSheet.absoluteFillObject,
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
