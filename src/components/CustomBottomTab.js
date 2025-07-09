import React, { useContext } from "react";
import {
  View, TouchableOpacity, Text, Image, StyleSheet, Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { homeT, pillar, acc, menu, chatbot } from "../assets/images";
import LinearGradient from "react-native-linear-gradient";
import { ThemeContext } from "../context/ThemeProvider";

const { width } = Dimensions.get("window");
const guidelineBaseWidth = 375;

const responsiveWidth = (size) => (width / guidelineBaseWidth) * size;
const responsiveHeight = (size) => (width / guidelineBaseWidth) * size;
const responsiveFontSize = (size) => (width / guidelineBaseWidth) * size;

const tabItems = [
  { name: "Home", icon: homeT },
  { name: "Pillars", icon: pillar },
  { name: "Accountability", icon: acc },
  { name: "Sidebar", icon: menu },
  { name: "ChatBot", icon: chatbot },
];

export default function CustomBottomTab({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const { theme, isDarkMode } = useContext(ThemeContext); // ✅ Moved inside
  const styles = getStyles(theme, isDarkMode);

  return (
    <View style={[styles.tabBarWrapper, { paddingBottom: insets.bottom }]}>
      <View style={styles.blurBackground} />
      {state.routes.map((route, index) => {
        if (route.name === "Courses") return null;

        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const icon = tabItems.find((item) => item.name === route.name)?.icon;

        const onPress = () => {
          const event = navigation.emit({ type: "tabPress", target: route.key });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const label =
          route.name === "Pillars" ? "Discover"
            : route.name === "Accountability" ? "Trader Hub"
              : route.name === "ChatBot" ? "TraderSense"
                : route.name;

        return focused ? (
          <LinearGradient
            key={index}
            start={{ x: 0.0, y: 0.95 }}
            end={{ x: 1.0, y: 1.0 }}
            colors={['rgba(112, 194, 232, 0.3)', 'rgba(204, 204, 204, 0)']}
            style={styles.gradientWrapper}
          >
            <TouchableOpacity
              accessibilityRole="button"
              onPress={onPress}
              style={[styles.tabItem, styles.activeTab]}
            >
              <View style={styles.iconLabelWrapper}>
                <Image source={icon} style={[styles.icon, { tintColor: theme.primaryColor, marginRight: 6 }]} />
                <Text style={[styles.label, { color: theme.primaryColor }]}>{label}</Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            onPress={onPress}
            style={[styles.tabItem, styles.inactiveTab]}
          >
            <View style={styles.iconLabelWrapper}>
              <Image source={icon} style={[styles.icon, { tintColor: theme.inactiveTint || "#AAA" }]} />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const getStyles = (theme, isDarkMode) => StyleSheet.create({
  tabBarWrapper: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    width: width - responsiveWidth(40),
    borderRadius: responsiveWidth(20),
    borderColor: isDarkMode ? theme.borderColor : "rgba(129,129,129,0.5)",
    borderWidth: 1.3,
    height: responsiveHeight(70),
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: responsiveWidth(10),
    marginBottom: responsiveHeight(10),
    overflow: "hidden",
    backgroundColor: theme.tabBg || 'rgba(11, 16, 22, 0.9)',
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.tabBlurOverlay || 'rgba(255, 255, 255, 0.08)',
    borderWidth: 0.9,
    borderColor: theme.borderColor,
    borderRadius: 8,
  },
  tabItem: {
    borderRadius: responsiveWidth(25),
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    paddingHorizontal: responsiveWidth(16),
    paddingVertical: responsiveHeight(6),
    height: responsiveHeight(40),
  },
  inactiveTab: {
    width: responsiveWidth(45),
    height: responsiveHeight(45),
  },
  iconLabelWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: responsiveWidth(22),
    height: responsiveWidth(22),
    resizeMode: "contain",
  },
  label: {
    fontWeight: "600",
    fontSize: responsiveFontSize(12),
  },
  gradientWrapper: {
    borderRadius: responsiveWidth(25),
  },
});
