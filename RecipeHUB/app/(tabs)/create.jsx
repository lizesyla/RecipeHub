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
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../firebase.js";
import { doc, setDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { Image, Alert } from "react-native";



export default function CreateRecipeScreen() {
  const [title, setTitle] = useState("");
  const [inputIngredient, setInputIngredient] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [image, setImage] = useState(null);


  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const showModal = (msg) => {
    setModalMessage(msg);
    setModalVisible(true);
  };

  const addIngredient = () => {
    if (inputIngredient.trim() === "") return;
    const newIngredient = {
      id: Date.now().toString(),
      name: inputIngredient,
    };
    setIngredients([...ingredients, newIngredient]);
    setInputIngredient("");
  };

  const deleteIngredient = (id) => {
    setIngredients(ingredients.filter((item) => item.id !== id));
  };
  const pickFromGallery = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission needed", "Gallery access is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission needed", "Camera access is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveRecipe = async () => {
    const user = auth.currentUser;

    if (!user) {
      showModal("You must be logged in to save a recipe.");
      return;
    }

    if (
      title.trim() === "" ||
      ingredients.length === 0 ||
      instructions.trim() === ""
    ) {
      showModal("Please fill out all fields.");
      return;
    }

    const recipeId = Date.now().toString();

    const recipe = {
      id: recipeId,
      title: title.trim(),
      ingredients,
      instructions: instructions.trim(),
      imageURL: image || imageURL.trim() || "https://www.example.com/default-image.jpg",
      ownerId: user.uid,
      ownerEmail: user.email,
      createdAt: new Date().toISOString(),
    };

    try {
  setLoading(true);

  await setDoc(doc(db, "AllRecipes", recipeId), recipe);

  
  const settingsRef = doc(db, "users", user.uid);
  const settingsSnap = await getDoc(settingsRef);


  setTitle("");
  setIngredients([]);
  setInstructions("");
  setImageURL("");
  setImage(null);


  showModal("Recipe created successfully!");
} catch (error) {
  showModal("Error saving recipe. Try again.");
} finally {
  setLoading(false);
}
  };

  return (
<SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />

      <Modal transparent visible={modalVisible || loading} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {loading ? (
              <>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={[styles.modalText, { marginTop: 15 }]}>
                  Saving recipe...
                </Text>
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

    
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 20 }}
        >
          <Text style={styles.header}>Create Recipe</Text>

          <Text style={styles.label}>Recipe Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter recipe title"
            placeholderTextColor={COLORS.muted}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter image URL"
            placeholderTextColor={COLORS.muted}
            value={imageURL}
            onChangeText={setImageURL}
          />
          <Text style={styles.label}>Recipe Image</Text>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity style={styles.imageButton} onPress={pickFromGallery}>
              <Ionicons name="images-outline" size={22} color="#fff" />
              <Text style={styles.imageButtonText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
              <Ionicons name="camera-outline" size={22} color="#fff" />
              <Text style={styles.imageButtonText}>Camera</Text>
            </TouchableOpacity>
          </View>
          {image && (
            <Image
              source={{ uri: image }}
              style={{
                width: "100%",
                height: 200,
                borderRadius: 14,
                marginTop: 12,
              }}
            />
          )}


          <Text style={styles.label}>Ingredients</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Add ingredient"
              placeholderTextColor={COLORS.muted}
              value={inputIngredient}
              onChangeText={setInputIngredient}
            />
            <TouchableOpacity onPress={addIngredient} style={styles.addButton}>
              <Ionicons name="add" size={26} color="#fff" />
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
            style={[styles.input, { height: 140 }]}
            placeholder="Describe cooking steps"
            placeholderTextColor={COLORS.muted}
            multiline
            value={instructions}
            onChangeText={setInstructions}
          />

          <TouchableOpacity style={styles.button} onPress={saveRecipe}>
            <Ionicons name="save-outline" size={22} color="#fff" />
            <Text style={styles.buttonText}>Save Recipe</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 20,
    textAlign: "center",
  },
  label: { color: "#fff", fontSize: 16, marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },

  row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },

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

  ingredientText: { color: "#fff", fontSize: 16 },
  deleteText: { color: "red", fontWeight: "bold" },

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
    padding: 20,
  },

  modalBox: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
  },

  modalText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },

  modalButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },

  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
