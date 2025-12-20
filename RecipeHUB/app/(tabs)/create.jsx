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
import * as Notifications from "expo-notifications";
import { getDoc } from "firebase/firestore";


const COLORS = {
  background: "#FFF6F8",     
  card: "#FFE4EB",            
  primary: "#FF4C8B",         
  primarySoft: "#FF8CB3",    
  accent: "#FFD1E0",          
  text: "#2E2E3A",            
  textMuted: "#8C8C99",       
  danger: "#FF2E5B",          
  border: "#FFB6C1",         
};

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

  const notificationsEnabled =
    settingsSnap.exists() &&
    settingsSnap.data()?.settings?.notifications === true;

  if (notificationsEnabled) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Recipe Created 🍰",
        body: "Your recipe was saved successfully!",
      },
      trigger: null,
    });
  }

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
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 24,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 16,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: COLORS.card,
    color: COLORS.text,
    padding: 14,
    borderRadius: 14,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  ingredientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  ingredientText: {
    color: COLORS.text,
    fontSize: 16,
  },
  deleteText: {
    color: COLORS.danger,
    fontWeight: "bold",
  },
  button: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
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
  },
  modalBox: {
    backgroundColor: COLORS.background,
    padding: 24,
    borderRadius: 16,
    width: "85%",
    alignItems: "center",
  },
  modalText: {
    color: COLORS.text,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primarySoft,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  imageButtonText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "bold",
  },
});
