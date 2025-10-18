import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileLayout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: "#111" },
        headerTintColor: "#fff",
      }}
    >
      <Drawer.Screen name="index" options={{ title: "Profile" }} />
      <Drawer.Screen name="about" options={{ title: "About Us" }} />
      <Drawer.Screen name="contact" options={{ title: "Contact Us" }} />
      <Drawer.Screen name="logout" options={{ title: "Logout" }} />
    </Drawer>
  );
}