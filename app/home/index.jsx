import { useState } from "react";
import { Text, FlatList, TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import RecipeCard from "../components/RecipeCard.jsx";

export default function Home() {
  const [recipes, setRecipes] = useState([
    { id: "1", title: "Pasta Carbonara" },
    { id: "2", title: "Chicken Curry" },
  ]);

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        🍽️ Recipe Hub
      </Text>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RecipeCard title={item.title} />}
      />

      <Link href="/add-recipe" asChild>
        <TouchableOpacity
          style={{
            backgroundColor: "#FF7F50",
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Add Recipe</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}
