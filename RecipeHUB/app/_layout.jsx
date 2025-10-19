import { Stack } from "expo-router";
import { StatusBar, Platform } from "react-native";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";

export default function RootLayout() {

  // ✅ Kjo pjesë i ngarkon ikonat globalisht
  useEffect(() => {
    Font.loadAsync({
      ...Ionicons.font,
    });
  }, []);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "android" ? "#4CAF50" : "transparent"}
        translucent={Platform.OS === "android"}
      />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
