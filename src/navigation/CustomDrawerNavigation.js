import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";

const CustomDrawerNavigation = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding: 20 }}>
        <TouchableOpacity onPress={() => props.navigation.navigate("Home")}>
          <Text style={{ color: "white", fontSize: 18 }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate("Profile")}>
          <Text style={{ color: "white", fontSize: 18 }}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate("Settings")}>
          <Text style={{ color: "white", fontSize: 18 }}>Settings</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerNavigation;
