
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
  Animated
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { auth, db } from "../../firebase";
import { collection, getDocs, deleteDoc, doc, onSnapshot, query, orderBy, setDoc } from "firebase/firestore";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const FadeButton = ({ onPress, children, style }) => {
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[{ opacity: fadeAnim }, style]}
      activeOpacity={1}
    >
      {children}
    </AnimatedTouchable>
  );
};
export default function HomeScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubRecipes = loadRecipesRealtime();
    const unsubFavorites = loadFavoritesRealtime();

    return () => {
      unsubRecipes();
      if (unsubFavorites) unsubFavorites();
    };
  }, []);

  
  const loadRecipesRealtime = () => {
    const ref = collection(db, "AllRecipes");
    const q = query(ref, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecipes(items);
        setLoading(false);
      },
      () => {
        setError("Error loading recipes.");
        setLoading(false);
      }
    );

    return unsubscribe;
  };
    const RecipeCard = ({ item }) => {
    const id = item.id;
    const scaleAnim = React.useRef(new Animated.Value(1)).current;
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      // Animacion fade-in kur komponenti mountohet
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, []);

    let formattedDate = "";
    if (item.createdAt) {
      if (typeof item.createdAt === "string") {
        formattedDate = item.createdAt.split("T")[0];
      } else if (item.createdAt.toDate) {
        formattedDate = item.createdAt.toDate().toISOString().split("T")[0];
      }
    }

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        friction: 3,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    };

    const handleToggleFavorite = () => {
      toggleFavorite(item);
    };

    const handleDelete = () => {
      deleteRecipe(item.id, item.ownerId);
    };

    const handlePressRecipe = () => {
      router.push(`/recipe/${id}`);
    };

    return (
      <Animated.View style={[styles.postContainer, { opacity: fadeAnim }]}>
        <Animated.View 
          style={{ transform: [{ scale: scaleAnim }] }}
          onTouchStart={handlePressIn}
          onTouchEnd={handlePressOut}
        >
          <View style={styles.userRow}>
            <Ionicons name="person-circle-outline" size={38} color="#4CAF50" />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.username}>{item.ownerEmail}</Text>
              {formattedDate !== "" && (
                <Text style={styles.date}>{formattedDate}</Text>
              )}
            </View>
          </View>

          <FadeButton onPress={handlePressRecipe}>
            <Image source={{ uri: item.imageURL }} style={styles.recipeImage} />
          </FadeButton>

          <FadeButton onPress={handlePressRecipe}>
            <Text style={styles.recipeTitle}>{item.title}</Text>
          </FadeButton>

          <View style={styles.actionRow}>
            <FadeButton onPress={handleToggleFavorite}>
              <Ionicons
                name={favorites.includes(item.id) ? "heart" : "heart-outline"}
                size={28}
                color={favorites.includes(item.id) ? "red" : "#fff"}
              />
            </FadeButton>

            {item.ownerId === user?.uid && (
              <FadeButton onPress={handleDelete}>
                <Ionicons name="trash-outline" size={28} color="red" />
              </FadeButton>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    );
  };


  const loadFavoritesRealtime = () => {
    if (!user) return;

    const favRef = collection(db, "users", user.uid, "favorites");

    const unsub = onSnapshot(favRef, (snap) => {
      const favIds = snap.docs.map(d => d.id);
      setFavorites(favIds);
    });

    return unsub;
  };

  
  const toggleFavorite = async (item) => {
    if (!user) return;

    const favDoc = doc(db, "users", user.uid, "favorites", item.id);

    setFavorites(prev => {
      if (prev.includes(item.id)) {
        deleteDoc(favDoc).catch(err => console.log(err));
        return prev.filter(f => f !== item.id);
      } else {
        setDoc(favDoc, item).catch(err => console.log(err));
        return [...prev, item.id];
      }
    });
  };

  const onMoreRecipesPress = () => {
    router.push("/more-recipes");
  };

  
  const deleteRecipe = async (id, ownerId) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    if (ownerId !== currentUser.uid) {
      Alert.alert("Error", "You can only delete your own recipes.");
      return;
    }

   
    setRecipes(prev => prev.filter(item => item.id !== id));

    try {
      await deleteDoc(doc(db, "AllRecipes", id));
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to delete recipe.");
      
      loadRecipesRealtime();
    }
  };

  
  const RecipeCard = ({ item }) => {
    const id = item.id;

    let formattedDate = "";
    if (item.createdAt) {
      if (typeof item.createdAt === "string") {
        formattedDate = item.createdAt.split("T")[0];
      } else if (item.createdAt.toDate) {
        formattedDate = item.createdAt.toDate().toISOString().split("T")[0];
      }
    }

    return (
      <View style={styles.postContainer}>
        <View style={styles.userRow}>
          <Ionicons name="person-circle-outline" size={38} color="#4CAF50" />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.username}>{item.ownerEmail}</Text>
            {formattedDate !== "" && (
              <Text style={styles.date}>{formattedDate}</Text>
            )}
          </View>
        </View>

        <Image source={{ uri: item.imageURL }} style={styles.recipeImage} />

        <TouchableOpacity onPress={() => router.push(`/recipe/${id}`)}>
          <Text style={styles.recipeTitle}>{item.title}</Text>
        </TouchableOpacity>

        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => toggleFavorite(item)}>
            <Ionicons
              name={favorites.includes(item.id) ? "heart" : "heart-outline"}
              size={28}
              color={favorites.includes(item.id) ? "red" : "#fff"}
            />
          </TouchableOpacity>

          {item.ownerId === user?.uid && (
            <TouchableOpacity onPress={() => deleteRecipe(item.id, item.ownerId)}>
              <Ionicons name="trash-outline" size={28} color="red" />
            </TouchableOpacity>
          )}
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
        style={[styles.container, {
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
        }]}
        contentContainerStyle={{ padding: 20 }}
      >
      <View style={styles.headerContainer}>
        <View style={{ width: 100 }} /> 
        <Text style={styles.header}>Feed</Text>
        <TouchableOpacity onPress={onMoreRecipesPress} style={styles.moreButton}>
          <Text style={styles.moreButtonText}>More Recipes</Text>
        </TouchableOpacity>
      </View>


        {loading && <ActivityIndicator size="large" color="#4CAF50" />}
        {error !== "" && <Text style={styles.error}>{error}</Text>}
        {!loading && recipes.length === 0 && <Text style={styles.noRecipes}>No recipes yet.</Text>}

        {recipes.map(item => <RecipeCard key={item.id} item={item} />)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#111" 
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
    flex: 1
  },
  
  error: { color: "red", textAlign: "center", marginTop: 20 },
  noRecipes: { color: "#aaa", textAlign: "center", marginTop: 20 },

  postContainer: {
    backgroundColor: "#1a1a1a",
    marginBottom: 25,
    borderRadius: 12,
    paddingBottom: 15
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12
  },

  username: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  date: { color: "#aaa", fontSize: 12 },

  recipeImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginTop: 10
  },

  recipeTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
    paddingHorizontal: 12
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between", 
    marginTop: 14,
    paddingHorizontal: 12
  },
  headerContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
},

moreButton: {
  paddingHorizontal: 10,
  paddingVertical: 6,
  backgroundColor: "#4CAF50",
  borderRadius: 6,
},
moreButtonText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 16,
}

});
