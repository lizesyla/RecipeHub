import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function CreateScreen() {
  const [title, setTitle] = useState("");
  const [inputIngredient, setInputIngredient] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState("");
  const [recipeSaved, setRecipeSaved] = useState(null); // ruan recetën e plotë

  const addIngredient = () => {
    if (inputIngredient.trim() === "") return;
    const newIngredient = { id: Date.now().toString(), name: inputIngredient };
    setIngredients([...ingredients, newIngredient]);
    setInputIngredient("");
  };

  const deleteIngredient = (id) => {
    setIngredients(ingredients.filter(item => item.id !== id));
  };

  const saveRecipe = () => {
    const recipe = {
      title,
      ingredients,
      instructions
    };
    setRecipeSaved(recipe);

    setTitle("");
    setIngredients([]);
    setInputIngredient("");
    setInstructions("");
  };

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
        <TextInput
          style={styles.input}
          placeholder="Enter recipe title"
          placeholderTextColor="#aaa"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Ingredients</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Add ingredient"
            placeholderTextColor="#aaa"
            value={inputIngredient}
            onChangeText={setInputIngredient}
          />
          <TouchableOpacity onPress={addIngredient} style={styles.addButton}>
            <Ionicons name="add-circle-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {ingredients.map(item => (
          <View key={item.id} style={styles.ingredientItem}>
            <Text style={styles.ingredientText}>{item.name}</Text>
            <TouchableOpacity onPress={() => deleteIngredient(item.id)}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}

        <Text style={[styles.label, { marginTop: 20 }]}>Instructions</Text>
        <TextInput
          style={[styles.input, { height: 150 }]}
          placeholder="Describe cooking steps"
          placeholderTextColor="#aaa"
          multiline
          value={instructions}
          onChangeText={setInstructions}
        />

        <TouchableOpacity style={styles.button} onPress={saveRecipe}>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Save Recipe</Text>
        </TouchableOpacity>

        {recipeSaved ? (
          <View style={styles.savedRecipe}>
            <Text style={styles.savedTitle}>{recipeSaved.title}</Text>
            {recipeSaved.ingredients.map(ing => (
              <Text key={ing.id} style={styles.savedIngredient}>• {ing.name}</Text>
            ))}
            <Text style={styles.savedInstructions}>{recipeSaved.instructions}</Text>
          </View>
        ) : (
          <Text style={styles.noRecipe}>No recipe yet</Text>
        )}
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: "#4CAF50",
    padding: 6,
    borderRadius: 8,
  },
  ingredientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1E1E1E",
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
  },
  ingredientText: {
    color: "#fff",
    fontSize: 16,
  },
  deleteText: {
    color: "red",
    fontWeight: "bold",
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
  savedRecipe: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#222",
    borderRadius: 12,
  },
  savedTitle: {
    color: "#4CAF50",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  savedIngredient: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 5,
  },
  savedInstructions: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
  },
  noRecipe: {
    color: "gray",
    fontSize: 16,
    marginTop: 30,
    textAlign: "center",
  },
});
