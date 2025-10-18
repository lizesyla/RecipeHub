import { View, Text, TextInput, StyleSheet, ScrollView, SafeAreaView, StatusBar, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SearchScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
      {/* StatusBar për iOS dhe Android */}
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "android" ? "#4CAF50" : "transparent"}
        translucent={Platform.OS === "android"}
      />

      <ScrollView
        style={[styles.container, { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }]}
        contentContainerStyle={{ padding: 20 }}
      >
        {/* Header */}
        <Text style={styles.header}>Search Recipes</Text>

        {/* Search Input */}
        <Text style={styles.label}>Search</Text>
        <TextInput
          style={styles.input}
          placeholder="Type recipe name or ingredient"
          placeholderTextColor="#aaa"
        />

        {/* Example results */}
        <Text style={[styles.label, { marginTop: 30 }]}>Results:</Text>
        <View style={styles.resultItem}>
          <Ionicons name="restaurant-outline" size={20} color="#fff" />
          <Text style={styles.resultText}>Spaghetti Carbonara</Text>
        </View>
        <View style={styles.resultItem}>
          <Ionicons name="restaurant-outline" size={20} color="#fff" />
          <Text style={styles.resultText}>Chicken Curry</Text>
        </View>
        <View style={styles.resultItem}>
          <Ionicons name="restaurant-outline" size={20} color="#fff" />
          <Text style={styles.resultText}>Chocolate Cake</Text>
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
  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  resultText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
});