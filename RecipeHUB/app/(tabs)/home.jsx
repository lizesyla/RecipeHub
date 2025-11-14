import { View, Text, StyleSheet, ScrollView, StatusBar, Platform, TouchableOpacity, ActivityIndicator, Image  } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";


export default function HomeScreen() {
  const router = useRouter();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
      const data = await response.json();
      setMeals(data.meals || []);  
    } catch (error) {
      console.error("Gabim gjatë marrjes së të dhënave:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "android" ? "#4CAF50" : "transparent"}
        translucent={Platform.OS === "android"}
      />

      
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back-circle" size={50} color="#4CAF50" />
      </TouchableOpacity>

      <ScrollView
        style={[styles.container, { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }]}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Welcome to RecipeHub!</Text>

        <Text style={styles.sectionTitle}>Popular Recipes</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
        ) : (
          meals.map((meal) => (
            <View key={meal.idMeal} style={styles.card}>
              <Image source={{ uri: meal.strMealThumb }} style={styles.mealImage} />
              <Ionicons name="restaurant-outline" size={28} color="#fff" />
              <Text style={styles.cardText}>{meal.strMeal}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


{/* 
  //       <View style={styles.card}>
  //         <Ionicons name="restaurant-outline" size={28} color="#fff" />
  //         <Text style={styles.cardText}>Spaghetti Carbonara</Text>
  //       </View>

  //       <View style={styles.card}>
  //         <Ionicons name="restaurant-outline" size={28} color="#fff" />
  //         <Text style={styles.cardText}>Chicken Curry</Text>
  //       </View>

  //       <View style={styles.card}>
  //         <Ionicons name="restaurant-outline" size={28} color="#fff" />
  //         <Text style={styles.cardText}>Chocolate Cake</Text>
  //       </View>

  //       <Text style={styles.sectionTitle}>New Recipes</Text>

  //       <View style={styles.card}>
  //         <Ionicons name="restaurant-outline" size={28} color="#fff" />
  //         <Text style={styles.cardText}>Avocado Toast</Text>
  //       </View>

  //       <View style={styles.card}>
  //         <Ionicons name="restaurant-outline" size={28} color="#fff" />
  //         <Text style={styles.cardText}>Beef Tacos</Text>
  //       </View>
  //     </ScrollView>
  //   </SafeAreaView>
  // );
// } */}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 60, 
  },
  sectionTitle: {
    fontSize: 20,
    color: "#fff",
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  cardText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 12,
  },
  mealImage: {
  width: 60,
  height: 60,
  borderRadius: 10,
  marginRight: 12,
  },
});
