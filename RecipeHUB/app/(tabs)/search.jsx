import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView, StatusBar, Platform, FlatList, ActivityIndicator, Alert, LayoutAnimation, UIManager  } from "react-native";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase" 
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import RecipeCard from '../../components/RecipeCard';
import { COLORS } from "../../components/theme"; 

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const showAlert = (title, message) => {
  if (Platform.OS === 'web') {
    alert(`${title}: ${message}`);
  } else {
    Alert.alert(title, message);
  }
};
export default function SearchScreen() {
  
  useEffect(() => {
    Font.loadAsync({
      ...Ionicons.font,
    });
  }, []);

  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClear = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSearchText("");
    setResults([]);
  }, []);

  const handleSearch = useCallback(async () => {
    if (searchText.trim().length < 2) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      if (Platform.OS === 'web' && !navigator.onLine) {throw new Error("Offline");}
      const q = query(
        collection(db, "AllRecipes"), 
        where("keywords", "array-contains", searchText.toLowerCase())
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      setResults(data);
    } catch (error) {
      showAlert("Error", "Could not fetch recipes. Check your connection.");
      console.log("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, [searchText]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
    handleSearch(searchText);
  }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchText, handleSearch]);

  const handleNavigate = useCallback((id) => {
    router.push(`/recipe/${id}`);
  }, []);

  const renderItem = useCallback(({ item, index }) => (
    <RecipeCard 
    item={item}
    index={index}
    onPress={handleNavigate} />
  ), [handleNavigate]);

  const ListHeader = useMemo(() => (
  <View>
    <Text style={styles.header}>Search Recipes</Text>
    <View style={styles.searchBox}>
      <Ionicons name="search" size={22} color="#b51c7aff" />
      <TextInput
        style={styles.inputBox}
        placeholder="Search..."
        value={searchText}
        onChangeText={setSearchText}
      />
      {searchText.length > 0 && (
        <TouchableOpacity 
          onPress={handleClear} 
          style={styles.clearButton}
        >
          <Ionicons name="close-circle" size={20} color="#fc91e5ff" />
        </TouchableOpacity>
      )}

    </View>
    {loading && <ActivityIndicator color="#fc91e5ff" />}
  </View>
), [searchText, loading]);

  return (
<SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "android" ? COLORS.primary : "transparent"}
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
      
        removeClippedSubviews={Platform.OS !== 'web'}
      />
    </SafeAreaView>
  );
}
    
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.buttonGreen,
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 6,
    marginTop: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
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
    color: COLORS.text,
    fontSize: 16,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  resultText: {
    color: COLORS.text,
    fontSize: 16,
    marginLeft: 10,
  },
  clearButton: {
    padding: 5, 
    marginLeft: 5,
  }
});
