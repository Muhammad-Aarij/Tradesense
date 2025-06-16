import React from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "@react-native-community/blur"; // or "expo-blur"
import { homeT, pillar, course, affiliate, userT } from "../assets/images";
import theme from "../themes/theme";

const { width } = Dimensions.get("window");

const tabItems = [
  { name: "Home", icon: homeT },
  { name: "Pillars", icon: pillar },
  { name: "Courses", icon: course },
  { name: "Accountability", icon: affiliate },
  { name: "Affiliate", icon: userT },
];

export default function CustomBottomTab({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBarWrapper, { paddingBottom: insets.bottom }]}>
      {/* ✅ Blur only the background */}
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="light"
        blurAmount={25}
        reducedTransparencyFallbackColor="rgba(255,255,255,0.9)"
      />

      {/* ✅ Foreground content unchanged */}
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const icon = tabItems.find((item) => item.name === route.name)?.icon;

        const onPress = () => {
          const event = navigation.emit({ type: "tabPress", target: route.key });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            onPress={onPress}
            style={[styles.tabItem, focused ? styles.activeTab : styles.inactiveTab]}
          >
            <View style={styles.iconLabelWrapper}>
              <Image source={icon} style={[styles.icon, focused ? styles.iconActive : styles.iconInactive]} />
              {focused && <Text style={styles.labelActive}>{route.name}</Text>}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    width: width - 20,
    marginHorizontal: 10,
    marginBottom: 20,
    borderRadius: 50,
    height: 60,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    overflow: "hidden", // required for rounded corners to apply to blur
    backgroundColor: "transparent", // so blur is visible
  },
  tabItem: {
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: theme.primaryColor,
    paddingHorizontal: 16,
    paddingVertical: 6,
    // width: 120,
    height: 40,
  },
  inactiveTab: {
    width: 45,
    height: 45,
  },
  iconLabelWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  iconActive: {
    tintColor: "#FFF",
    marginRight: 6,
  },
  iconInactive: {
    tintColor: "#AAA",
  },
  labelActive: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 12,
  },
});
