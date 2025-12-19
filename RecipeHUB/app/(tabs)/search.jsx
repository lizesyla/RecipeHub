import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView, StatusBar, Platform, FlatList, ActivityIndicator } from "react-native";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase" 
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import RecipeCard from '../../components/RecipeCard';

export default function SearchScreen() {
  
  useEffect(() => {
    Font.loadAsync({
      ...Ionicons.font,
    });
  }, []);

  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  
  const handleSearch = useCallback(async () => {
    if (searchText.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const q = query(
        collection(db, "AllRecipes"),
        where("keywords", "array-contains", searchText.toLowerCase())
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setResults(data);
    } catch (error) {
      console.log("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, [searchText]);

  useEffect(() => {
    handleSearch();
  }, [searchText]);

  const handleNavigate = useCallback((id) => {
    router.push(`/recipe/${id}`);
  }, []);

  const renderItem = useCallback(({ item }) => (
    <RecipeCard item={item} onPress={handleNavigate} />
  ), [handleNavigate]);

  const ListHeader = useMemo(() => (
  <View>
    <Text style={styles.header}>Search Recipes</Text>
    <View style={styles.searchBox}>
      <Ionicons name="search" size={22} color="#4CAF50" />
      <TextInput
        style={styles.inputBox}
        placeholder="Search..."
        value={searchText}
        onChangeText={setSearchText}
      />
    </View>
    {loading && <ActivityIndicator color="#4CAF50" />}
  </View>
), [searchText, loading]);

  return (
<SafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "android" ? "#4CAF50" : "transparent"}
        translucent={Platform.OS === "android"}
      />
      
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          !loading && searchText.length > 1 ? (
            <Text style={{ color: "#aaa", textAlign: 'center', marginTop: 20 }}>No results found</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
    

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 6,
    marginTop: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  inputBox: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  resultText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
});
