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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

import { auth, db } from "../../firebase";
import { doc, getDoc, deleteDoc, setDoc } from "firebase/firestore";

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const user = auth.currentUser;

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    fetchRecipe();
    loadFavorites();
  }, []);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const recipeDoc = await getDoc(doc(db, "AllRecipes", id));
      if (recipeDoc.exists()) {
        setRecipe(recipeDoc.data());
      }
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    if (!user) return;
    const favDoc = await getDoc(doc(db, "users", user.uid, "favorites", id));
    if (favDoc.exists()) {
      setFavorites([id]);
    }
  };

  const toggleFavorite = async () => {
    if (!user || !recipe) return;

    setFavLoading(true);
    const favDoc = doc(db, "users", user.uid, "favorites", id);

    try {
      if (favorites.includes(id)) {
        await deleteDoc(favDoc);
        setFavorites([]);
      } else {
        await setDoc(favDoc, recipe);
        setFavorites([id]);
      }
    } finally {
      setFavLoading(false);
    }
  };

  const deleteRecipe = () => {
    Alert.alert("Delete Recipe", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "AllRecipes", id));
            await deleteDoc(doc(db, "users", recipe.userId, "recipes", id));
            await deleteDoc(doc(db, "users", user.uid, "favorites", id));

            router.replace("/home"); 
          } catch (err) {
            console.log("Error deleting:", err);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  if (!recipe) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={{ color: "#fff" }}>Recipe not found.</Text>
      </SafeAreaView>
    );
  }

  const isOwner = recipe.userId === user?.uid;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "android" ? "#4CAF50" : "transparent"}
        translucent={Platform.OS === "android"}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back-circle" size={44} color="#4CAF50" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 80 }}>
        <Text style={styles.title}>{recipe.title}</Text>

        <Text style={styles.meta}>
          By:{recipe.username} | {
  recipe.createdAt?.toDate
    ? recipe.createdAt.toDate().toISOString().split("T")[0]
    : typeof recipe.createdAt === "string"
      ? recipe.createdAt.split("T")[0]
      : "Unknown date"
}
        </Text>

        {recipe.imageURL && (
          <Image source={{ uri: recipe.imageURL }} style={styles.image} />
        )}

        <Text style={styles.sectionHeader}>Ingredients</Text>
        {recipe.ingredients?.map((item) => (
          <Text key={item.id} style={styles.ingredient}>
            - {item.name}
          </Text>
        ))}

        <Text style={styles.sectionHeader}>Instructions</Text>
        <Text style={styles.instructions}>{recipe.instructions}</Text>

       
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={toggleFavorite}
          disabled={favLoading}
        >
          <Ionicons
            name={favorites.includes(id) ? "heart" : "heart-outline"}
            size={28}
            color={favorites.includes(id) ? "red" : "#fff"}
          />
          <Text style={styles.favoriteText}>
            {favorites.includes(id) ? "Favorited" : "Add to Favorites"}
          </Text>
        </TouchableOpacity>

       
        {isOwner && (
          <TouchableOpacity style={styles.deleteButton} onPress={deleteRecipe}>
            <Ionicons name="trash-outline" size={26} color="white" />
            <Text style={styles.deleteText}>Delete Recipe</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 20,
    left: 16,
    zIndex: 10,
  },
  deleteButton: {
    flexDirection: "row",
    backgroundColor: "red",
    padding: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  deleteText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#4CAF50",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 6,
  },
  meta: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionHeader: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 6,
  },
  ingredient: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 6,
    marginBottom: 4,
  },
  instructions: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  favoriteButton: {
    flexDirection: "row",
    backgroundColor: "#222",
    padding: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
