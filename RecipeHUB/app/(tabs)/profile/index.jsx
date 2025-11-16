import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { auth, db } from "../../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  onSnapshot
} from "firebase/firestore";

export default function ProfileScreen() {
  const router = useRouter();

  const [userData, setUserData] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  const loadMyRecipes = async () => {
    if (!user) return;

    const allRecipesRef = collection(db, "AllRecipes");
    const q = query(allRecipesRef, where("ownerId", "==", user.uid));

    const snap = await getDocs(q);
    setRecipes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const loadFavoritesRealtime = () => {
    if (!user) return;

    const favRef = collection(db, "users", user.uid, "favorites");

    const unsub = onSnapshot(favRef, async (snap) => {
      const ids = snap.docs.map(f => f.id);

      const fullFavs = [];
      for (let id of ids) {
        const recipeRef = doc(db, "AllRecipes", id);
        const data = await getDoc(recipeRef);
        if (data.exists()) {
          fullFavs.push({ id, ...data.data() });
        }
      }

      setFavorites(fullFavs);
      setLoading(false);
    });

    return unsub;
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setUserData({
        name: user.displayName || "Unnamed",
        email: user.email,
        photo: user.photoURL
      });

      loadMyRecipes();
      const unsubFavs = loadFavoritesRealtime();

      return () => {
        if (unsubFavs) unsubFavs();
      };
    }, [])
  );

  const removeFavorite = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "favorites", id));
  };

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
      
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: userData.photo || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{userData.name}</Text>
        <Text style={styles.email}>{userData.email}</Text>
      </View>

      <Text style={styles.sectionHeader}>My Recipes</Text>

      {recipes.length === 0 && (
        <Text style={styles.emptyText}>You haven’t added any recipes yet.</Text>
      )}

      {recipes.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.recipeBox}
          onPress={() => router.push(`/recipe/${item.id}`)}
        >
          <Text style={styles.recipeText}>{item.title}</Text>

          <TouchableOpacity
            onPress={() => router.push(`/edit/${item.id}`)}
            style={styles.editBtn}
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionHeader}>Favorite Recipes</Text>

      {favorites.length === 0 && (
        <Text style={styles.emptyText}>No favorite recipes yet.</Text>
      )}

      {favorites.map((fav) => (
        <TouchableOpacity
          key={fav.id}
          style={styles.recipeBox}
          onPress={() => router.push(`/recipe/${fav.id}`)}
        >
          <Text style={styles.recipeText}>{fav.title}</Text>

          <TouchableOpacity
            onPress={() => removeFavorite(fav.id)}
            style={styles.removeBtn}
          >
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  profileHeader: {
    alignItems: "center",
    marginBottom: 25,
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 12
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginBottom: 10
  },

  name: { fontSize: 22, color: "#fff", fontWeight: "bold" },
  email: { color: "#aaa", marginTop: 4 },

  sectionHeader: {
    color: "#4CAF50",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 10
  },

  emptyText: { color: "#aaa", marginBottom: 10 },

  recipeBox: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8
  },

  recipeText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  editBtn: {
    position: "absolute",
    right: 10,
    top: 12,
    padding: 5
  },

  editText: { color: "#4CAF50", fontWeight: "bold" },

  removeBtn: {
    position: "absolute",
    right: 10,
    top: 12,
    padding: 5
  },

  removeText: { color: "red", fontWeight: "bold" }
});
