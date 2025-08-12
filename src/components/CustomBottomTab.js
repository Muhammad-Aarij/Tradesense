import React, { useContext, useEffect, useRef } from "react";
import {
  View, TouchableOpacity, Text, Image, StyleSheet, Dimensions,
  Platform, Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { homeT, pillar, acc, menu, chatbot, discoverIcon, menuIcon, traderHub } from "../assets/images";
import LinearGradient from "react-native-linear-gradient";
import { ThemeContext } from "../context/ThemeProvider";

const { width } = Dimensions.get("window");
const guidelineBaseWidth = 375;

const responsiveWidth = (size) => (width / guidelineBaseWidth) * size;
const responsiveHeight = (size) => (width / guidelineBaseWidth) * size;
const responsiveFontSize = (size) => (width / guidelineBaseWidth) * size;

const tabItems = [
  { name: "Home", icon: homeT },
  { name: "Pillars", icon: discoverIcon },
  { name: "Accountability", icon: traderHub },
  { name: "More", icon: menuIcon }, 
  { name: "Sense Ai", icon: chatbot },
];

export default function CustomBottomTab({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const { theme, isDarkMode } = useContext(ThemeContext); // ✅ Moved inside
  const styles = getStyles(theme, isDarkMode);

  // Create animated values for each tab
  const animatedValues = useRef(
    state.routes.map(() => ({
      scale: new Animated.Value(1),
      opacity: new Animated.Value(0.6),
      translateY: new Animated.Value(0),
      pulse: new Animated.Value(1),
      shadowOpacity: new Animated.Value(0),
    }))
  ).current;

  // Tab bar entrance animation
  const tabBarScale = useRef(new Animated.Value(0.9)).current;
  const tabBarOpacity = useRef(new Animated.Value(0)).current;

  // Initialize tab bar animation
  useEffect(() => {
    Animated.parallel([
      Animated.spring(tabBarScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(tabBarOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Animation function for smooth tab transitions
  const animateTab = (index, focused) => {
    const animations = [
      Animated.spring(animatedValues[index].scale, {
        toValue: focused ? 1.08 : 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(animatedValues[index].opacity, {
        toValue: focused ? 1 : 0.6,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(animatedValues[index].translateY, {
        toValue: focused ? -3 : 0,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(animatedValues[index].shadowOpacity, {
        toValue: focused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ];

    Animated.parallel(animations).start();

    // Add subtle pulse effect for active tabs
    if (focused) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValues[index].pulse, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValues[index].pulse, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      animatedValues[index].pulse.setValue(1);
    }
  };

  // Run animations when focused tab changes
  useEffect(() => {
    state.routes.forEach((route, index) => {
      if (route.name !== "Courses") {
        const focused = state.index === index;
        animateTab(index, focused);
      }
    });
  }, [state.index]);

  return (
     <Animated.View 
      style={[
        styles.tabBarWrapper, 
        { 
          // Ensure the bar sits above the iOS home indicator while not growing too tall.
          // Keep internal padding minimal; we account for spacing from content on screens.
          paddingBottom: Platform.OS === 'ios' ? insets.bottom * 0.25 : insets.bottom,
          transform: [{ scale: tabBarScale }],
          opacity: tabBarOpacity,
        }
      ]}
    >
      <Animated.View style={styles.blurBackground} />
      {state.routes.map((route, index) => {
        if (route.name === "Courses") return null;

        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const icon = tabItems.find((item) => item.name === route.name)?.icon;

        const onPress = () => {
          const event = navigation.emit({ type: "tabPress", target: route.key });
          if (!focused && !event.defaultPrevented) {
            // Add a small press animation with pulse effect
            Animated.sequence([
              Animated.spring(animatedValues[index].scale, {
                toValue: 0.92,
                useNativeDriver: true,
                tension: 400,
                friction: 10,
              }),
              Animated.spring(animatedValues[index].scale, {
                toValue: focused ? 1.08 : 1,
                useNativeDriver: true,
                tension: 300,
                friction: 10,
              }),
            ]).start();

            // Add pulse effect to pressed icon
            Animated.timing(animatedValues[index].pulse, {
              toValue: 1.15,
              duration: 150,
              useNativeDriver: true,
            }).start(() => {
              Animated.timing(animatedValues[index].pulse, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
              }).start();
            });
            
            navigation.navigate(route.name);
          }
        };

        const label =
          route.name === "Pillars" ? "Discover"
            : route.name === "Accountability" ? "Traders Hub"
              : route.name === "ChatBot" ? "TraderSense"
                : route.name;

        // Define custom icon sizes for each specific route
        const getIconSize = (routeName) => {
          switch (routeName) {
            case "More":
              return responsiveWidth(33); // Largest for sidebar
            case "Pillars": // Discover
              return responsiveWidth(30); // Large for discover
            case "Sense Ai":
              return responsiveWidth(40); // Large for chatbot
            case "Home":
              return responsiveWidth(18); // Medium for home
            case "Accountability": // Trader Hub
              return responsiveWidth(25); // Smallest for trader hub
            default:
              return responsiveWidth(20); // Default fallback
          }
        };

        const iconSize = getIconSize(route.name);

        // Shadow effect for active tabs
        const shadowOpacity = animatedValues[index].shadowOpacity;

        return (
          <Animated.View
            key={index}
            style={[
              {
                transform: [
                  { scale: animatedValues[index].scale },
                  { translateY: animatedValues[index].translateY },
                ],
                opacity: animatedValues[index].opacity,
              },
            ]}
          >
            {focused ? (
              <LinearGradient
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
                    <Animated.View style={[
                      styles.iconContainer,
                      {
                        // shadowColor: theme.primaryColor,
                        // shadowOffset: { width: 0, height: 2 },
                        // shadowOpacity: shadowOpacity,
                        // shadowRadius: 4,
                        // elevation: focused ? 4 : 0,
                      }
                    ]}>
                      <Animated.Image 
                        source={icon} 
                        style={[
                          styles.icon, 
                          { 
                            tintColor: theme.primaryColor, 
                            marginRight: 6,
                            width: iconSize,
                            height: iconSize,
                            transform: [{ scale: animatedValues[index].pulse }],
                          }
                        ]} 
                      />
                    </Animated.View>
                    <Animated.Text 
                      style={[
                        styles.label, 
                        { 
                          color: theme.primaryColor,
                        }
                      ]}
                    >
                      {label}
                    </Animated.Text>
                  </View>
                </TouchableOpacity>
              </LinearGradient>
            ) : (
              <TouchableOpacity
                accessibilityRole="button"
                onPress={onPress}
                style={[styles.tabItem, styles.inactiveTab]}
              >
                <View style={styles.iconLabelWrapper}>
                  <Animated.View style={[
                    styles.iconContainer,
                    {
                      // shadowColor: theme.inactiveTint || "#AAA",
                      // shadowOffset: { width: 0, height: 1 },
                      // shadowOpacity: shadowOpacity,
                      // shadowRadius: 2,
                      // elevation: 0,
                    }
                  ]}>
                    <Animated.Image 
                      source={icon} 
                      style={[
                        styles.icon, 
                        { 
                          tintColor: theme.inactiveTint || "#AAA",
                          width: iconSize,
                          height: iconSize,
                          transform: [{ scale: animatedValues[index].pulse }],
                        }
                      ]} 
                    />
                  </Animated.View>
                </View>
              </TouchableOpacity>
            )}
          </Animated.View>
        );
      })}
    </Animated.View>
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
    paddingHorizontal: responsiveWidth(11),
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
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
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
