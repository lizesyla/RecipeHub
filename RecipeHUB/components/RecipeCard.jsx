import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../components/theme"; 

const RecipeCard = React.memo(({ item, index, onPress }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true, 
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      })
    ]).start();
  }, [index]);
  return (
    <Animated.View 
      style={{ 
        opacity: fadeAnim, 
        transform: [{ translateY: slideAnim }] 
      }}
    >
    <TouchableOpacity 
      activeOpacity={0.7} 
      style={styles.card} 
      onPress={() => onPress(item.id)}
    >
      <Ionicons name="restaurant-outline" size={20} color="#fff" />
      <Text style={styles.text}>{item.title}</Text>
    </TouchableOpacity>
    </Animated.View>
    
  );
});
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    color: COLORS.text,
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "500",
  },
});

export default RecipeCard;
