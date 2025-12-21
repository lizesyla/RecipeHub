import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../firebase";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDoc, 
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {router } from "expo-router";
import { COLORS } from "../../components/theme"; 

export default function MoreRecipes() {
  const [user, setUser] = useState(null);
  const [meals, setMeals] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }
    const favRef = collection(db, "users", user.uid, "favorites");
    const unsubscribe = onSnapshot(favRef, (snapshot) => {
      const favIds = snapshot.docs.map((doc) => doc.id);
      setFavorites(favIds);
    });

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/search.php?s="
      );
      const data = await response.json();
      setMeals(data.meals || []);
    } catch (error) {
      Alert.alert("Gabim", "Nuk u morën recetat nga API");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (meal) => {
    if (!user) {
      Alert.alert("Duhet të jesh i kyçur për të përdorur këtë funksion");
      return;
    }

    const favDoc = doc(db, "users", user.uid, "favorites", meal.idMeal);

    if (favorites.includes(meal.idMeal)) {
      try {
        await deleteDoc(favDoc);
        setFavorites(prev => prev.filter(f => f !== meal.idMeal));
      } catch (error) {
        Alert.alert("Gabim", "Nuk mund të hiqet nga favorites");
        console.error(error);
      }
    } else {
      try {
        const recipeInAllRecipes = doc(db, "AllRecipes", meal.idMeal);
        
        const existingRecipe = await getDoc(recipeInAllRecipes);
        
        if (!existingRecipe.exists()) {
          await setDoc(recipeInAllRecipes, {
            id: meal.idMeal,
            title: meal.strMeal,
            imageURL: meal.strMealThumb,
            ownerEmail: "TheMealDB",
            ownerId: "themealdb",
            createdAt: new Date(),
            instructions: meal.strInstructions,
            ingredients: getIngredients(meal),
            category: meal.strCategory,
            area: meal.strArea,
            isFromAPI: true
          });
        }

        await setDoc(favDoc, {
          id: meal.idMeal,
          title: meal.strMeal,
          imageURL: meal.strMealThumb,
          ownerEmail: "TheMealDB",
          ownerId: "themealdb",
          addedAt: new Date(),
        });
        
        setFavorites(prev => [...prev, meal.idMeal]);
      } catch (error) {
        Alert.alert("Gabim", "Nuk mund të shtohet në favorites");
        console.error(error);
      }
    }
  };

  const getIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== "") {
        ingredients.push(`${measure} ${ingredient}`.trim());
      }
    }
    return ingredients;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
        <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back-circle" size={50} color="#fc91e5ff" />
      </TouchableOpacity>
      <Text style={styles.header}>More Recipes from Database</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#fc91e5ff" style={{ marginTop: 20 }} />
      ) : (
        meals.map((meal) => (
          <View key={meal.idMeal} style={styles.card}>
            <Image source={{ uri: meal.strMealThumb }} style={styles.mealImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardText}>{meal.strMeal}</Text>
              <Text style={styles.category}>{meal.strCategory} • {meal.strArea}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleFavorite(meal)}>
              <Ionicons
                name={favorites.includes(meal.idMeal) ? "heart" : "heart-outline"}
                size={28}
                color={favorites.includes(meal.idMeal) ? "red" : "#fc91e5ff"}
              />
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.buttonGreen,
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardText: {
    color: COLORS.text,
    fontSize: 16,
    marginLeft: 12,
    fontWeight: "bold",
  },
  category: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginLeft: 12,
    marginTop: 4,
  },
  mealImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 20,
    zIndex: 10,
  },
});
