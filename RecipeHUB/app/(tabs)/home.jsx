import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { auth, db } from "../../firebase";
import { collection, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";

export default function HomeScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecipes();
    loadFavorites();
  }, []);

 
  const fetchRecipes = async () => {
    if (!user) {
      setError("You must be logged in to view recipes.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const recipesRef = collection(db, "users", user.uid, "recipes");
      const snapshot = await getDocs(recipesRef);
      let items = [];
      snapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
      setRecipes(items);
    } catch {
      setError("Error loading recipes.");
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    if (!user) return;
    const favRef = collection(db, "users", user.uid, "favorites");
    const snap = await getDocs(favRef);
    let favs = [];
    snap.forEach((doc) => favs.push(doc.id));
    setFavorites(favs);
  };

  const toggleFavorite = async (item) => {
    if (!user) return;
    const favDoc = doc(db, "users", user.uid, "favorites", item.id);
    if (favorites.includes(item.id)) {
      await deleteDoc(favDoc);
      setFavorites(favorites.filter((f) => f !== item.id));
    } else {
      await setDoc(favDoc, item);
      setFavorites([...favorites, item.id]);
    }
  };

  const deleteRecipe = async (id) => {
    if (!user) return;
    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to delete this recipe?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "users", user.uid, "recipes", id));
              setRecipes(recipes.filter((item) => item.id !== id));
            } catch {
              Alert.alert("Error", "Failed to delete recipe.");
            }
          },
        },
      ]
    );
  };
  const RecipeCard = ({ item, isFavorite, onToggleFavorite, onDelete }) => {
    const id = item.id;
    const title = item.title;
    const imageURL = item.imageURL || "https://www.example.com/default-image.jpg";
    const username = item.username || user.email;
    const tags = item.tags || [];

    return (
      <View style={styles.postContainer}>
        <View style={styles.userRow}>
          <Ionicons name="person-circle-outline" size={38} color="#4CAF50" />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.username}>{username}</Text>
            {item.createdAt && <Text style={styles.date}>{item.createdAt?.split("T")[0]}</Text>}
          </View>
        </View>
        <Image source={{ uri: imageURL }} style={styles.recipeImage} />
        <TouchableOpacity onPress={() => router.push(`/recipe/${id}`)}>
          <Text style={styles.recipeTitle}>{title}</Text>
        </TouchableOpacity>
        {tags.length > 0 && (
          <View style={styles.tagsRow}>
            {tags.map((tag, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => onToggleFavorite(item)}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={28}
              color={isFavorite ? "red" : "#fff"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(id)}>
            <Ionicons name="trash-outline" size={28} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
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
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Feed</Text>
        {loading && <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />}
        {error !== "" && <Text style={styles.error}>{error}</Text>}
        {!loading && recipes.length === 0 && <Text style={styles.noRecipes}>No recipes yet.</Text>}

        {/* Firebase Recipes */}
        {recipes.map((item) => (
          <RecipeCard
            key={item.id}
            item={item}
            isFavorite={favorites.includes(item.id)}
            onToggleFavorite={toggleFavorite}
            onDelete={deleteRecipe}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },
  header: { fontSize: 28, fontWeight: "bold", color: "#4CAF50", marginBottom: 20, textAlign: "center" },
  error: { color: "red", textAlign: "center", marginTop: 20 },
  noRecipes: { color: "#aaa", textAlign: "center", marginTop: 20 },
  postContainer: { backgroundColor: "#1a1a1a", marginBottom: 25, borderRadius: 12, paddingBottom: 15 },
  userRow: { flexDirection: "row", alignItems: "center", padding: 12 },
  username: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  date: { color: "#aaa", fontSize: 12 },
  recipeImage: { width: "100%", height: 220, borderRadius: 12, marginTop: 10 },
  recipeTitle: { color: "#fff", fontSize: 20, fontWeight: "bold", marginTop: 12, paddingHorizontal: 12 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8, paddingHorizontal: 12 },
  tag: { backgroundColor: "#333", borderRadius: 10, paddingVertical: 4, paddingHorizontal: 10, marginRight: 6, marginBottom: 6 },
  tagText: { color: "#4CAF50", fontSize: 12 },
  actionRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 14, paddingHorizontal: 12 },
});
