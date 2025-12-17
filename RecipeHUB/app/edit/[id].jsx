import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons"; 

export default function EditRecipe() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipe = async () => {
      const ref = doc(db, "AllRecipes", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setTitle(data.title);
        setDescription(data.description);
      }

      setLoading(false);
    };

    loadRecipe();
  }, [id]);

  const saveChanges = async () => {
    const ref = doc(db, "AllRecipes", id);

    await updateDoc(ref, {
      title,
      description
    });

    router.back();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>Loading recipe...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back-circle" size={50} color="#4CAF50" />
      </TouchableOpacity>
      <Text style={styles.label}>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 100 }]}
        multiline
      />

      <TouchableOpacity style={styles.saveBtn} onPress={saveChanges}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 20 },
  label: { color: "#fff", marginTop: 50, fontSize: 16 },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
    marginTop: 5
  },
  saveBtn: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginTop: 30
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center"
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
    backButton: {
    position: "absolute",
    top: 10,
    left: 20,
    zIndex: 10,
  },
});
