import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return (
    <>
      {/* Fshijmë header-in e brendshëm për me mos dalë dy herë */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="addrecipe" />
      </Stack>

      <StatusBar style="light" />
    </>
  );
}
