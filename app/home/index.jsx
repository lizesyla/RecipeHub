
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState([
    {
      id: "1",
      title: "Cake",
      description: "Yummy",
      time: "30min",
      rating: 0,
      category: "Snack",
      
    },
    {
      id: "2",
      title: "Maria's Special Chocolate Cake",
      description: "A rich and moist chocolate cake that's perfect for any occasion",
      time: "45min",
      rating: 5,
      category: "Dessert",
      
    },
    // shto recetat tjera këtu
  ]);

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
        data={recipes.filter((r) =>
          r.title.toLowerCase().includes(search.toLowerCase())
        )}
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
    elevation: 2,
  },
  image: { width: "100%", height: 150 },
  cardContent: { padding: 10 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  description: { fontSize: 14, color: "#555", marginBottom: 5 },
  infoRow: { flexDirection: "row", justifyContent: "space-between" },
  info: { fontSize: 12, color: "#888" },
  category: {
    fontSize: 12,
    color: "#FF6347",
    fontWeight: "bold",
  },
});
