import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  Modal,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { auth, db } from "../../firebase.js";
import { doc, setDoc } from "firebase/firestore";

export default function CreateRecipeScreen() {
  const [title, setTitle] = useState("");
  const [inputIngredient, setInputIngredient] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  
  const [loading, setLoading] = useState(false);

  const showModal = (msg) => {
    setModalMessage(msg);
    setModalVisible(true);
  };

  const addIngredient = () => {
    if (inputIngredient.trim() === "") return;

    const newIngredient = { id: Date.now().toString(), name: inputIngredient };
    setIngredients([...ingredients, newIngredient]);
    setInputIngredient("");
  };

  const deleteIngredient = (id) => {
    setIngredients(ingredients.filter((item) => item.id !== id));
  };

  const saveRecipe = async () => {
    const user = auth.currentUser;

    if (!user) {
      showModal("You must be logged in to save a recipe.");
      return;
    }

    
    if (title.trim() === "" || ingredients.length === 0 || instructions.trim() === "") {
      showModal("Please fill out all fields before saving the recipe.");
      return;
    }

    const recipeId = Date.now().toString();

    const recipe = {
      id: recipeId,
      title: title.trim(),
      ingredients,
      instructions: instructions.trim(),
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };

    try {
      setLoading(true);

      await setDoc(doc(db, "users", user.uid, "recipes", recipeId), recipe);

      
      setTitle("");
      setIngredients([]);
      setInputIngredient("");
      setInstructions("");

      showModal("Recipe saved successfully!");
    } catch (error) {
      showModal("Error saving recipe. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "android" ? "#4CAF50" : "transparent"}
        translucent={Platform.OS === "android"}
      />

      
      <Modal transparent visible={modalVisible || loading} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            
            {loading ? (
              <>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={[styles.modalText, { marginTop: 15 }]}>Saving recipe...</Text>
              </>
            ) : (
              <>
                <Text style={styles.modalText}>{modalMessage}</Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>
              </>
            )}

          </View>
        </View>
      </Modal>

      <ScrollView
        style={[
          styles.container,
          { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
        ]}
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

        {ingredients.map((item) => (
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
          <Ionicons name="save-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Save Recipe</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
