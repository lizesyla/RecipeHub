import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

const RecipeCard = React.memo(({ item, onPress }) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      style={styles.card} 
      onPress={() => onPress(item.id)}
    >
      <Ionicons name="restaurant-outline" size={20} color="#fff" />
      <Text style={styles.text}>{item.title}</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
});

export default RecipeCard;