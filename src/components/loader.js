import React, { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { BlurView } from "@react-native-community/blur";
import theme from "../themes/theme";

export default function Loader() {
  const [visible, setVisible] = useState(false);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setVisible((prev) => !prev);
  //   }, 2000);

  //   return () => clearInterval(interval);
  // }, []);

  // if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <BlurView style={styles.blur} blurType="light" blurAmount={10}>
        {/* <ActivityIndicator style={{}} size="small" color="#70C2E8" /> */}
        <Text style={{ fontFamily: "Inter-Light", fontSize: 20, color: theme.primaryColor, marginTop: 20 }}>Loading</Text>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    width: "100%", height: "100%",
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

