import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileLayout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: "#fc91e5ff" },
        headerTintColor: "#fff",
        drawerActiveBackgroundColor: "#fc91e5ff",
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#ccc",
      }}
    >
      <Drawer.Screen
        name="index"
        options={{ title: "Profile" }}
      />
      <Drawer.Screen
        name="notifications"
        options={{
          title: "Notifications",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" color={color} size={size} />
          ),
        }}
      />


      <Drawer.Screen
        name="about"
        options={{
          title: "About Us",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="contact"
        options={{
          title: "Contact Us",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="call-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="logout"
        options={{
          title: "Logout",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="exit-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer>
  );
}