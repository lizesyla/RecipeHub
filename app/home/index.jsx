import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const [recipes] = useState([
    {
      id: "1",
      title: "Cake",
      description: "A simple and delicious homemade cake.",
      time: "30min",
      rating: 4,
      category: "Dessert",
      image: require("../assets/cake.jpg"),
    },
    {
      id: "2",
      title: "Maria's Special Chocolate Cake",
      description:
        "A rich and moist chocolate cake that's perfect for any occasion.",
      time: "45min",
      rating: 5,
      category: "Dessert",
      image: require("../assets/homemade_cake.jpg"),
    },
    {
      id: "3",
      title: "Baklava",
      description:
        "A traditional dessert made with layers of flaky pastry, chopped nuts, and sweet honey syrup.",
      time: "1h 30min",
      rating: 5,
      category: "Dessert",
      image: require("../assets/baklava.jpg"),
    },
    {
      id: "4",
      title: "Pizza Margherita",
      description:
        "Classic Italian pizza with tomato sauce, mozzarella, and fresh basil.",
      time: "25min",
      rating: 5,
      category: "Pizza",
      image: require("../assets/margherita.jpg"),
    },
    {
      id: "5",
      title: "Pizza Pepperoni",
      description:
        "Crispy crust topped with mozzarella cheese, pepperoni, and spicy tomato sauce.",
      time: "30min",
      rating: 4,
      category: "Pizza",
      image: require("../assets/pepperoni.jpg"),
    },
    {
      id: "6",
      title: "Vegetable Pizza",
      description:
        "Healthy and colorful pizza with mushrooms, bell peppers, and olives.",
      time: "35min",
      rating: 4,
      category: "Pizza",
      image: require("../assets/vegetable.jpg"),
    },
    {
      id: "7",
      title: "Beef and Potato Stew",
      description:
        "Traditional slow-cooked stew made with tender beef, potatoes, and onions in tomato sauce.",
      time: "1h 15min",
      rating: 5,
      category: "Stew",
      image: require("../assets/beef_potato.jpg"),
    },
    {
      id: "8",
      title: "Zucchini and Rice Stew",
      description:
        "Light and creamy stew made with zucchini, rice, and fresh herbs.",
      time: "1h",
      rating: 4,
      category: "Stew",
      image: require("../assets/Zucchini-stew.jpg"), 
    },
  ]);

  const filteredRecipes = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  const renderRecipe = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.info}>{item.time}</Text>
          <Text style={styles.info}>⭐ {item.rating}</Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <TextInput
        style={styles.search}
        placeholder="Search recipes..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
        renderItem={renderRecipe}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  search: {
    height: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  cardContent: { padding: 10 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  description: { fontSize: 14, color: "#555", marginBottom: 5 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: { fontSize: 12, color: "#888" },
  category: {
    fontSize: 12,
    color: "#FF6347",
    fontWeight: "bold",
  },
});
