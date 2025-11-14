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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  modalBox: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 12,
    width: "90%",
    alignItems: "center"
  },
  modalText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20
  },
  modalButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  }
});
