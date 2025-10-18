import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, StatusBar, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CreateScreen() {
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
       
        <Text style={styles.header}>Create Recipe</Text>

        
        <Text style={styles.label}>Recipe Title</Text>
        <TextInput style={styles.input} placeholder="Enter recipe title" placeholderTextColor="#aaa" />

       
        <Text style={styles.label}>Ingredients</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="List ingredients separated by commas"
          placeholderTextColor="#aaa"
          multiline
        />

       
        <Text style={[styles.label]}>Instructions</Text>
        <TextInput
          style={[styles.input, { height: 150 }]}
          placeholder="Describe cooking steps"
          placeholderTextColor="#aaa"
          multiline
        />

       
        <TouchableOpacity style={styles.button}>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Add Recipe</Text>
        </TouchableOpacity>
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
  button: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 8,
    fontWeight: "bold",
  },
});
