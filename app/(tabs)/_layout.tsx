import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#6200ea", // Active tab color
        tabBarInactiveTintColor: "#8e8e93", // Inactive tab color
        tabBarIcon: ({ focused }) => {
          // Custom icons from assets
          let iconSource;

          switch (route.name) {
            case "home":
              iconSource = focused
                ? require("../../assets/icons/home-active.png") // Active icon
                : require("../../assets/icons/home-inactive.png"); // Inactive icon
              break;
            case "preferences":
              iconSource = focused
                ? require("../../assets/icons/preferences-active.png")
                : require("../../assets/icons/preferences-inactive.png");
              break;
            case "messages":
              iconSource = focused
                ? require("../../assets/icons/messages-active.png")
                : require("../../assets/icons/messages-inactive.png");
              break;
            case "companies":
              iconSource = focused
                ? require("../../assets/icons/courses-active.png")
                : require("../../assets/icons/courses-inactive.png");
              break;
          }

          return (
            <Image
              source={iconSource}
              style={{ width: 24, height: 24, resizeMode: "contain" }}
            />
          );
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          backgroundColor: "#ffffff", // Customize the tab bar background
        },
      })}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="preferences" />
      <Tabs.Screen name="messages" />
      <Tabs.Screen name="companies" />
    </Tabs>
  );
};

export default TabLayout;
