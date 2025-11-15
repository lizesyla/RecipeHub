import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Linking
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ApiRecipeScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMealDetails();
  }, [id]);

  const fetchMealDetails = async () => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const data = await response.json();
      
      if (data.meals && data.meals[0]) {
        setMeal(formatMealData(data.meals[0]));
      } else {
        Alert.alert("Error", "Recipe not found");
        router.back();
      }
    } catch (error) {
      console.error("Error fetching meal:", error);
      Alert.alert("Error", "Failed to load recipe");
    } finally {
      setLoading(false);
    }
  };

  const formatMealData = (mealData) => {
    const ingredients = [];
    
    for (let i = 1; i <= 20; i++) {
      const ingredient = mealData[`strIngredient${i}`];
      const measure = mealData[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim() !== "" && ingredient.trim() !== "null") {
        ingredients.push({
          ingredient: ingredient.trim(),
          measure: measure ? measure.trim() : ""
        });
      }
    }

    return {
      id: mealData.idMeal,
      title: mealData.strMeal,
      imageURL: mealData.strMealThumb,
      category: mealData.strCategory,
      area: mealData.strArea,
      instructions: mealData.strInstructions,
      ingredients: ingredients,
      youtube: mealData.strYoutube,
      source: mealData.strSource,
      isFromAPI: true
    };
  };

  const openYoutube = () => {
    if (meal?.youtube) {
      Linking.openURL(meal.youtube);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!meal) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Recipe not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: meal.imageURL }} style={styles.image} />
      
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>{meal.title}</Text>
        
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>Category: {meal.category}</Text>
          <Text style={styles.metaText}>Cuisine: {meal.area}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {meal.ingredients.map((item, index) => (
            <View key={index} style={styles.ingredientRow}>
              <Text style={styles.ingredientText}>
                • {item.measure} {item.ingredient}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.instructions}>
            {meal.instructions}
          </Text>
        </View>

        {meal.youtube && (
          <TouchableOpacity style={styles.youtubeButton} onPress={openYoutube}>
            <Ionicons name="logo-youtube" size={20} color="#fff" />
            <Text style={styles.youtubeText}>Watch on YouTube</Text>
          </TouchableOpacity>
        )}

        {meal.source && (
          <TouchableOpacity 
            style={styles.sourceButton} 
            onPress={() => Linking.openURL(meal.source)}
          >
            <Text style={styles.sourceText}>View Original Source</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  image: {
    width: "100%",
    height: 300,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  metaText: {
    color: "#4CAF50",
    fontSize: 14,
    fontStyle: "italic",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 10,
  },
  ingredientRow: {
    marginBottom: 5,
  },
  ingredientText: {
    color: "#fff",
    fontSize: 16,
  },
  instructions: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 24,
  },
  youtubeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF0000",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: "center",
  },
  youtubeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  sourceButton: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  sourceText: {
    color: "#4CAF50",
    fontSize: 16,
  },
  errorText: {
    color: "#fff",
    fontSize: 18,
  },
});