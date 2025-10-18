import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
      
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "android" ? "#4CAF50" : "transparent"}
        translucent={Platform.OS === "android"}
      />

      <ScrollView
        style={[styles.container, { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }]}
        contentContainerStyle={{ padding: 20 }}
      >
       
        <Text style={styles.header}>Welcome to RecipeHub!</Text>

        
        <Text style={styles.sectionTitle}>Popular Recipes</Text>

        <View style={styles.card}>
          <Ionicons name="restaurant-outline" size={28} color="#fff" />
          <Text style={styles.cardText}>Spaghetti Carbonara</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="restaurant-outline" size={28} color="#fff" />
          <Text style={styles.cardText}>Chicken Curry</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="restaurant-outline" size={28} color="#fff" />
          <Text style={styles.cardText}>Chocolate Cake</Text>
        </View>

        <Text style={styles.sectionTitle}>New Recipes</Text>
        <View style={styles.card}>
          <Ionicons name="restaurant-outline" size={28} color="#fff" />
          <Text style={styles.cardText}>Avocado Toast</Text>
        </View>
        <View style={styles.card}>
          <Ionicons name="restaurant-outline" size={28} color="#fff" />
          <Text style={styles.cardText}>Beef Tacos</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    color: "#fff",
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  cardText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 12,
  },
});