import { Stack } from "expo-router";
import { StatusBar, Platform } from "react-native";

export default function RootLayout() {
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