import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { auth, db } from "../../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    // User info
    setUserData({ name: user.displayName, email: user.email });

    const fetchData = async () => {
      try {
        // Recetat e krijuara
        const recipesCol = collection(db, "users", user.uid, "recipes");
        const recipesSnapshot = await getDocs(recipesCol);
        const recipesList = recipesSnapshot.docs.map(doc => doc.data());
        setRecipes(recipesList);

        // Recetat favorite
        const favCol = collection(db, "users", user.uid, "favorites");
        const favSnapshot = await getDocs(favCol);
        const favList = favSnapshot.docs.map(doc => doc.data());
        setFavorites(favList);

      } catch (error) {
        console.log("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>Please log in to view your profile.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.header}>Profile</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.infoText}>{userData.name}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.infoText}>{userData.email}</Text>
      </View>

      <Text style={styles.sectionHeader}>My Recipes</Text>
      {recipes.length === 0 && <Text style={styles.infoText}>No recipes yet.</Text>}
      {recipes.map((recipe) => (
        <View key={recipe.id} style={styles.recipeBox}>
          <Text style={styles.recipeText}>{recipe.title}</Text>
        </View>
      ))}

      <Text style={styles.sectionHeader}>Favorite Recipes</Text>
      {favorites.length === 0 && <Text style={styles.infoText}>No favorite recipes yet.</Text>}
      {favorites.map((fav) => (
        <View key={fav.id} style={styles.recipeBox}>
          <Text style={styles.recipeText}>{fav.title}</Text>
        </View>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 26, fontWeight: "bold", color: "#4CAF50", marginBottom: 20 },
  infoBox: { marginBottom: 12 },
  label: { color: "#aaa", fontSize: 16 },
  infoText: { color: "#fff", fontSize: 18, marginTop: 2 },
  sectionHeader: { color: "#4CAF50", fontSize: 20, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  recipeBox: { backgroundColor: "#222", padding: 12, borderRadius: 10, marginBottom: 6 },
  recipeText: { color: "#fff", fontSize: 16 }
});
