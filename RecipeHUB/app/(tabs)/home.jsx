import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  Animated,
  FlatList,
  Easing
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { auth, db } from "../../firebase";
import { collection, getDoc, deleteDoc, doc, onSnapshot, query, orderBy, setDoc } from "firebase/firestore";
import { COLORS } from "../../components/theme";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const FadeButton = ({ onPress, children, style }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[{ opacity: fadeAnim }, style]}
      activeOpacity={1}
    >
      {children}
    </AnimatedTouchable>
  );
};

const DeleteConfirmationModal = ({ visible, onConfirm, onCancel }) => {
  const [modalVisible, setModalVisible] = useState(visible);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 7, useNativeDriver: true })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 300, duration: 200, useNativeDriver: true })
      ]).start(() => setModalVisible(false));
    }
  }, [visible]);

  if (!modalVisible) return null;

  return (
    <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
      <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.modalTitle}>Delete Recipe</Text>
        <Text style={styles.modalText}>
          Are you sure you want to delete this recipe? This action cannot be undone.
        </Text>
        <View style={styles.modalButtons}>
          <FadeButton onPress={onCancel} style={styles.modalButtonCancel}>
            <Text style={styles.modalButtonTextCancel}>Cancel</Text>
          </FadeButton>
          <FadeButton onPress={onConfirm} style={styles.modalButtonConfirm}>
            <Text style={styles.modalButtonTextConfirm}>Delete</Text>
          </FadeButton>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const RecipeCard = React.memo(({
  item,
  favorites,
  currentUser,
  currentUserPhoto,
  onToggleFavorite,
  onDelete,
  onPressRecipe
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const formattedDate = useMemo(() => {
    if (!item.createdAt) return "";
    if (typeof item.createdAt === "string") return item.createdAt.split("T")[0];
    if (item.createdAt.toDate) return item.createdAt.toDate().toISOString().split("T")[0];
    return "";
  }, [item.createdAt]);

  const userPhoto = item.ownerId === currentUser?.uid ? currentUserPhoto : item.ownerPhoto || null;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, friction: 3, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[styles.postContainer, { opacity: fadeAnim }]}>
      <Animated.View
        style={{ transform: [{ scale: scaleAnim }] }}
        onTouchStart={handlePressIn}
        onTouchEnd={handlePressOut}
      >
        <View style={styles.userRow}>
          {userPhoto ? (
            <Image source={{ uri: userPhoto }} style={{ width: 38, height: 38, borderRadius: 19 }} />
          ) : (
            <Ionicons name="person-circle-outline" size={38} color="#b61290ff" />
          )}
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.username}>{item.ownerEmail}</Text>
            {formattedDate !== "" && <Text style={styles.date}>{formattedDate}</Text>}
          </View>
        </View>

        <FadeButton onPress={() => onPressRecipe(item.id)}>
          <Image source={{ uri: item.imageURL }} style={styles.recipeImage} resizeMode="cover" />
        </FadeButton>

        <FadeButton onPress={() => onPressRecipe(item.id)}>
          <Text style={styles.recipeTitle}>{item.title}</Text>
        </FadeButton>

        <View style={styles.actionRow}>
          <FadeButton onPress={() => onToggleFavorite(item)}>
            <Ionicons
              name={favorites.includes(item.id) ? "heart" : "heart-outline"}
              size={28}
              color={favorites.includes(item.id) ? "red" : "#100a0aff"}
            />
          </FadeButton>

          {item.ownerId === currentUser?.uid && (
            <FadeButton onPress={() => onDelete(item.id, item.ownerId)}>
              <Ionicons name="trash-outline" size={28} color="red" />
            </FadeButton>
          )}
        </View>
      </Animated.View>
    </Animated.View>
  );
});


export default function HomeScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [currentUserPhoto, setCurrentUserPhoto] = useState(null);

  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  
  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    const unsubUser = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setCurrentUserPhoto(docSnap.data().photo || null);
      }
    });
    return () => unsubUser();
  }, [user]);

  useEffect(() => {
    const unsubRecipes = loadRecipesRealtime();
    const unsubFavorites = loadFavoritesRealtime();
    return () => {
      unsubRecipes();
      if (unsubFavorites) unsubFavorites();
    };
  }, []);

  const loadRecipesRealtime = useCallback(() => {
    const ref = collection(db, "AllRecipes");
    const q = query(ref, orderBy("createdAt", "desc"));

    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecipes(items);
      setLoading(false);
    }, () => {
      setError("Error loading recipes.");
      setLoading(false);
    });
  }, []);

  const loadFavoritesRealtime = useCallback(() => {
    if (!user) return;
    const favRef = collection(db, "users", user.uid, "favorites");
    return onSnapshot(favRef, snap => {
      const favIds = snap.docs.map(d => d.id);
      setFavorites(favIds);
    });
  }, [user]);

  const toggleFavorite = useCallback(async (item) => {
    if (!user) return;
    const favDoc = doc(db, "users", user.uid, "favorites", item.id);

    setFavorites(prev => {
      if (prev.includes(item.id)) {
        deleteDoc(favDoc).catch(err => console.log(err));
        return prev.filter(f => f !== item.id);
      } else {
        setDoc(favDoc, item).catch(err => console.log(err));
        return [...prev, item.id];
      }
    });
  }, [user]);

  const showDeleteConfirmation = useCallback((id, ownerId) => {
    setRecipeToDelete({ id, ownerId });
    setDeleteModalVisible(true);
  }, []);

  const handleDeleteRecipe = useCallback(async () => {
    if (!recipeToDelete || !user) return;
    const { id, ownerId } = recipeToDelete;
    if (ownerId !== user.uid) {
      Alert.alert("Error", "You can only delete your own recipes.");
      return;
    }
    setRecipes(prev => prev.filter(item => item.id !== id));
    try {
      await deleteDoc(doc(db, "AllRecipes", id));
      setDeleteModalVisible(false);
      setRecipeToDelete(null);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to delete recipe.");
      loadRecipesRealtime();
    }
  }, [recipeToDelete, user, loadRecipesRealtime]);

  const onMoreRecipesPress = useCallback(() => router.push("/more-recipes"), [router]);
  const onRecipePress = useCallback((id) => router.push(`/recipe/${id}`), [router]);

  const renderHeader = useMemo(() => (
    <Animated.View
      style={[styles.headerContainer, {
        opacity: headerAnim,
        transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-50, 0] }) }]
      }]}
    >
      <View style={{ width: 100 }} />
      <Text style={styles.header}>Feed</Text>
      <FadeButton onPress={onMoreRecipesPress} style={styles.moreButton}>
        <Text style={styles.moreButtonText}>More Recipes</Text>
      </FadeButton>
    </Animated.View>
  ), [headerAnim, onMoreRecipesPress]);

  const renderItem = useCallback(({ item }) => (
    <RecipeCard
      item={item}
      favorites={favorites}
      currentUser={user}
      currentUserPhoto={currentUserPhoto}
      onToggleFavorite={toggleFavorite}
      onDelete={showDeleteConfirmation}
      onPressRecipe={onRecipePress}
    />
  ), [favorites, user, currentUserPhoto, toggleFavorite, showDeleteConfirmation, onRecipePress]);

  const renderEmptyComponent = useMemo(() => {
    if (loading) return <View style={styles.centerContainer}><ActivityIndicator size="large" color="#4CAF50" /></View>;
    if (error) return <View style={styles.centerContainer}><Text style={styles.error}>{error}</Text></View>;
    if (recipes.length === 0) return <View style={styles.centerContainer}><Text style={styles.noRecipes}>No recipes yet.</Text></View>;
    return null;
  }, [loading, error, recipes.length]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "android" ? "#fc91e5ff" : "transparent"}
        translucent={Platform.OS === "android"}
      />

      <FlatList
        data={recipes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={[styles.container, { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }]}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={10}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={Platform.OS === "android"}
      />

      <DeleteConfirmationModal
        visible={deleteModalVisible}
        onConfirm={handleDeleteRecipe}
        onCancel={() => { setDeleteModalVisible(false); setRecipeToDelete(null); }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: COLORS.background, paddingHorizontal: 20, paddingBottom: 20 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", minHeight: 200 },
  headerContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20, marginTop: 10 },
  header: { fontSize: 28, fontWeight: "bold", color: COLORS.primary, textAlign: "center", flex: 1 },
  error: { color: COLORS.danger, textAlign: "center", fontSize: 16, marginTop: 20 },
  noRecipes: { color: COLORS.textMuted, textAlign: "center", fontSize: 18, marginTop: 20 },
  postContainer: { backgroundColor: COLORS.card, marginBottom: 25, borderRadius: 12, paddingBottom: 15, overflow: "hidden" },
  userRow: { flexDirection: "row", alignItems: "center", padding: 12 },
  username: { color: COLORS.text, fontSize: 16, fontWeight: "bold" },
  date: { color: COLORS.textMuted, fontSize: 12 },
  recipeImage: { width: "100%", height: 220, borderRadius: 12, marginTop: 10 },
  recipeTitle: { color: COLORS.text, fontSize: 20, fontWeight: "bold", marginTop: 12, paddingHorizontal: 12, paddingVertical: 8 },
  actionRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 14, paddingHorizontal: 12 },
  moreButton: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: COLORS.primary, borderRadius: 8 },
  moreButtonText: { color: COLORS.text, fontWeight: "bold", fontSize: 14 },
  modalOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: COLORS.text, justifyContent: "center", alignItems: "center", zIndex: 1000, opacity: 0.7 },
  modalContainer: { backgroundColor: COLORS.card, borderRadius: 15, padding: 24, width: "85%", maxWidth: 400 },
  modalTitle: { fontSize: 22, fontWeight: "bold", color: COLORS.text, marginBottom: 12, textAlign: "center" },
  modalText: { fontSize: 16, color: COLORS.textMuted, textAlign: "center", marginBottom: 24, lineHeight: 22 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  modalButtonCancel: { flex: 1, paddingVertical: 12, backgroundColor: COLORS.accent, borderRadius: 8, alignItems: "center" },
  modalButtonConfirm: { flex: 1, paddingVertical: 12, backgroundColor: COLORS.danger, borderRadius: 8, alignItems: "center" },
  modalButtonTextCancel: { color: COLORS.text, fontSize: 16, fontWeight: "600" },
  modalButtonTextConfirm: { color: COLORS.text, fontSize: 16, fontWeight: "600" }
});
