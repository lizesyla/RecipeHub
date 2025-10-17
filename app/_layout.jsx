import { StatusBar } from "expo-status-bar";
import { Drawer } from "expo-router/drawer";

export default function Layout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="home"
        options={{
          title: "Home",
          headerStyle: { backgroundColor: "#FF7F50" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          headerTitleAlign: "center",
        }}
      />
    
      <Drawer.Screen
        name="about"
        options={{
          title: "About",
          headerStyle: { backgroundColor: "#FF7F50" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          headerTitleAlign: "center",
        }}
      />

      <Drawer.Screen
        name="register"
        options={{
          title: "Register",
          headerStyle: { backgroundColor: "#FF7F50" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          headerTitleAlign: "center",
        }}
      />

 

      <StatusBar style="light" />
    </Drawer>
  );
}
