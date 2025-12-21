import { Stack } from "expo-router";
import { StatusBar, Platform, View, ActivityIndicator } from "react-native";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function RootLayoutNav() {
  const { loading } = useAuth();

  
  useEffect(() => {
    Font.loadAsync({
      ...Ionicons.font,
    });
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#111" }}>
        <ActivityIndicator size="large" color="#fc91e5ff" />
      </View>
    );
  }

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "android" ? "#fc91e5ff" : "transparent"}
        translucent={Platform.OS === "android"}
      />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
