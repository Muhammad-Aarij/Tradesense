import React from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet, Dimensions, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { BlurView } from "@react-native-community/blur"; // or "expo-blur"
import { homeT, pillar, course, affiliate, userT, menu, chatbot, acc } from "../assets/images";
import theme from "../themes/theme";
import LinearGradient from "react-native-linear-gradient";

const { width, height } = Dimensions.get("window");

const guidelineBaseWidth = 375;

const responsiveWidth = (size) => (width / guidelineBaseWidth) * size;
const responsiveHeight = (size) => (width / guidelineBaseWidth) * size; // same scale as width
const responsiveFontSize = (size) => (width / guidelineBaseWidth) * size;

const tabItems = [
  { name: "Home", icon: homeT },
  { name: "Pillars", icon: pillar },
  // { name: "Courses", icon: course },
  { name: "Accountability", icon: acc },
  { name: "Sidebar", icon: menu },
  { name: "ChatBot", icon: chatbot },
];

export default function CustomBottomTab({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.tabBarWrapper, 
      Platform.OS === 'ios' && styles.tabBarWrapperIOS,
      { paddingBottom: Platform.OS === 'ios' ? insets.bottom + responsiveHeight(0) : insets.bottom }
    ]}>
      {/* ✅ Blur only the background */}
      <View
        style={[StyleSheet.absoluteFill, {
          backgroundColor: 'rgba(255, 255, 255, 0.09)',
          borderWidth: 0.9, borderColor: theme.borderColor,
          borderRadius: 8,
        }]}
      // blurType="light"
      // blurAmount={25}
      // reducedTransparencyFallbackColor="rgba(255,255,255,0.9)"
      />

      {state.routes.map((route, index) => {
        if (route.name === "Courses") return null; // ✨ Skip rendering tab space

        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const icon = tabItems.find((item) => item.name === route.name)?.icon;

        const onPress = () => {
          const event = navigation.emit({ type: "tabPress", target: route.key });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return focused ? (
          <LinearGradient
            key={index}
            start={{ x: 0.0, y: 0.95 }} end={{ x: 1.0, y: 1.0 }}
            colors={['rgba(112, 194, 232, 0.3)', 'rgba(204, 204, 204, 0)']}
            style={{ borderRadius: 25, top: responsiveHeight(10) }}
          >
            <TouchableOpacity
              accessibilityRole="button"
              onPress={onPress}
              style={[styles.tabItem, styles.activeTab]}
            >
              <View style={styles.iconLabelWrapper}>
                <Image source={icon} style={[styles.icon, styles.iconActive]} />
                <Text style={styles.labelActive}>
                  {route.name === "Pillars"
                    ? "Discover"
                    : route.name === "Accountability"
                      ? "Trader Hub"
                      : route.name === "ChatBot"
                        ? "TraderSense"
                        : route.name}
                </Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            onPress={onPress}
            style={[styles.tabItem, styles.inactiveTab, { top: responsiveHeight(10) }]}
          >
            <View style={styles.iconLabelWrapper}>
              <Image source={icon} style={[styles.icon, styles.iconInactive]} />
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
    alignSelf: "center",
    width: width - responsiveWidth(40),
    borderRadius: responsiveWidth(20),
    borderColor: theme.borderColor,
    borderWidth: 0.9,
    height: responsiveHeight(70),
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: responsiveWidth(10),
    marginBottom: responsiveHeight(10),
    overflow: "hidden",
    backgroundColor: 'rgba(11, 16, 22, 0.9)',
  },

  // iOS-specific styling
  tabBarWrapperIOS: {
    height: responsiveHeight(60), // Slightly increased height for iOS
    marginBottom: responsiveHeight(12), // More bottom margin for iOS
    paddingHorizontal: responsiveWidth(8), // Slightly less horizontal padding
    width: width - responsiveWidth(32), // Slightly wider for iOS
  },

  tabItem: {
    borderRadius: responsiveWidth(25),
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    paddingHorizontal: responsiveWidth(16),
    paddingVertical: responsiveHeight(4),
    height: responsiveHeight(35),
  },

  inactiveTab: {
    width: responsiveWidth(40),
    height: responsiveHeight(40),
  },

  iconLabelWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    width: responsiveWidth(20),
    height: responsiveWidth(20),
    resizeMode: "contain",
  },
  iconActive: {
    tintColor: theme.primaryColor,
    marginRight: responsiveWidth(6),
  },
  iconInactive: {
    tintColor: "#AAA",
  },
  labelActive: {
    color: theme.primaryColor,
    fontWeight: "600",
    fontSize: responsiveFontSize(12),
  },
});
