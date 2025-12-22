import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Animated,
  Modal,
  TextInput
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { auth, db } from "../../../firebase";
import { collection, query, where, getDocs, doc, getDoc, updateDoc, onSnapshot, deleteDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { COLORS } from "../../../components/theme";

export default function ProfileScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;

  const [userData, setUserData] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editField, setEditField] = useState("");
  const [tempValue, setTempValue] = useState("");

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const user = auth.currentUser;

  
  const showToastMessage = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    Animated.timing(toastAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();

    setTimeout(() => {
      Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setShowToast(false));
    }, 2000);
  };

  
  const loadMyRecipes = async () => {
    if (!user) return;
    const q = query(collection(db, "AllRecipes"), where("ownerId", "==", user.uid));
    const snap = await getDocs(q);
    setRecipes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const loadFavoritesRealtime = () => {
    if (!user) return;
    const favRef = collection(db, "users", user.uid, "favorites");
    const unsub = onSnapshot(favRef, async snap => {
      const fullFavs = [];
      for (let f of snap.docs) {
        const r = await getDoc(doc(db, "AllRecipes", f.id));
        if (r.exists()) fullFavs.push({ id: f.id, ...r.data() });
      }
      setFavorites(fullFavs);
      setLoading(false);
    });
    return unsub;
  };

 
  const pickProfileImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
      base64: true
    });
    if (!result.canceled) {
      await updateDoc(doc(db, "users", user.uid), { photoBase64: result.assets[0].base64 });
      setUserData(prev => ({ ...prev, photoBase64: result.assets[0].base64 }));
      showToastMessage("Profile picture updated!");
    }
  };

  const openEditModal = (field) => {
    setEditField(field);
    setTempValue(userData[field] || "");
    setModalVisible(true);
  };

  const saveEdit = async () => {
    if (!tempValue) return;
    await updateDoc(doc(db, "users", user.uid), { [editField]: tempValue });
    setUserData(prev => ({ ...prev, [editField]: tempValue }));
    setModalVisible(false);
    showToastMessage(`${editField === "fullName" ? "Name" : "Bio"} updated!`);
  };

  const removeFavorite = async id => await deleteDoc(doc(db, "users", user.uid, "favorites", id));


  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setUserData({ fullName: user.displayName || "Unnamed", email: user.email, photo: user.photoURL, bio: "" });
      loadMyRecipes();
      const unsubFavs = loadFavoritesRealtime();
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      return () => { if (unsubFavs) unsubFavs(); };
    }, [])
  );

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return;
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) setUserData(docSnap.data());
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (!user) return <View style={styles.center}><Text style={{ color: "#fff" }}>Please log in.</Text></View>;
  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.buttonGreen} /></View>;

 
  const renderCard = (item, remove = false) => {
    const slideAnim = new Animated.Value(30);
    const opacityAnim = new Animated.Value(0);
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true })
    ]).start();

    return (
      <Animated.View key={item.id} style={{ ...styles.card, opacity: opacityAnim, transform: [{ translateY: slideAnim }] }}>
        <Text style={styles.cardTitle}>{item.title} {remove ? "💔" : "🍽️"}</Text>
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          {!remove && <TouchableOpacity onPress={() => router.push(`/recipe/${item.id}`)} style={styles.cardBtn}><Text style={styles.cardBtnText}>View</Text></TouchableOpacity>}
          <TouchableOpacity onPress={() => remove ? removeFavorite(item.id) : router.push(`/edit/${item.id}`)} style={styles.cardBtn}>
            <Text style={{ ...styles.cardBtnText, color: remove ? COLORS.danger : COLORS.buttonGreen }}>{remove ? "Remove" : "Edit"}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <>
      <Animated.ScrollView style={{ flex: 1, opacity: fadeAnim, backgroundColor: COLORS.background }} contentContainerStyle={{ paddingBottom: 40 }}>
       
        <View style={styles.profileRow}>
          <Image
            source={{
              uri: userData?.photoBase64 ? `data:image/jpeg;base64,${userData.photoBase64}` : userData?.photo || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }}
            style={styles.avatar}
          />

          <View style={styles.userInfo}>
            <View style={styles.row}>
              <Text style={styles.name}>{userData?.fullName || userData?.name}</Text>
              <TouchableOpacity onPress={() => openEditModal("fullName")}>
                <Text style={styles.editInline}>✏️</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.email}>{userData?.email}</Text>

            <View style={styles.row}>
              <Text style={styles.bio}>{userData?.bio || "No bio yet."}</Text>
              <TouchableOpacity onPress={() => openEditModal("bio")}>
                <Text style={styles.editInline}>✏️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={styles.sectionHeader}>My Recipes 🍳 ({recipes.length})</Text>
        {recipes.length ? recipes.map(r => renderCard(r)) : <Text style={styles.emptyText}>You haven’t added any recipes yet.</Text>}

      
        <Text style={styles.sectionHeader}>Favorites ❤️ ({favorites.length})</Text>
        {favorites.length ? favorites.map(f => renderCard(f, true)) : <Text style={styles.emptyText}>No favorites yet.</Text>}
      </Animated.ScrollView>

      
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editField === "fullName" ? "Edit Name" : "Edit Bio"}</Text>
            <TextInput
              value={tempValue}
              onChangeText={setTempValue}
              style={styles.input}
              placeholder={editField === "fullName" ? "Enter name" : "Enter bio"}
              multiline={editField === "bio"}
              autoFocus
            />
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginRight: 15 }}>
                <Text style={{ color: COLORS.danger, fontWeight: "bold" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveEdit}>
                <Text style={{ color: COLORS.buttonGreen, fontWeight: "bold" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      
      {showToast && (
        <Animated.View style={[styles.toast, { opacity: toastAnim }]}>
          <Text style={{ color: "#fff" }}>{toastMessage}</Text>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileRow: { flexDirection: "row", alignItems: "center", margin: 20, backgroundColor: COLORS.card, padding: 15, borderRadius: 16 },
  avatar: { width: 90, height: 90, borderRadius: 50, marginRight: 15 },
  userInfo: { flex: 1 },
  name: { fontSize: 22, fontWeight: "bold", color: COLORS.text },
  email: { fontSize: 16, color: COLORS.textMuted, marginBottom: 4 },
  bio: { fontSize: 14, color: COLORS.text, fontStyle: "italic", marginBottom: 4, flex:1 },
  sectionHeader: { fontSize: 20, fontWeight: "bold", color: COLORS.buttonGreen, marginVertical: 12, marginLeft: 20 },
  emptyText: { color: COLORS.textMuted, fontStyle: "italic", marginLeft: 20 },
  card: { backgroundColor: COLORS.card, padding: 14, borderRadius: 14, marginHorizontal: 20, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 1 }, shadowRadius: 4 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: COLORS.text, marginBottom: 6 },
  cardBtn: { marginLeft: 8 },
  cardBtnText: { color: COLORS.buttonGreen, fontWeight: "bold" },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  editInline: { color: COLORS.buttonGreen, fontWeight: "bold", marginLeft: 6, fontSize: 16 },
  modalOverlay: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.4)' },
  modalContent: { width:'80%', backgroundColor: COLORS.card, padding:20, borderRadius:12 },
  modalTitle: { color: COLORS.text, fontWeight:'bold', marginBottom:12 },
  input: { backgroundColor: COLORS.background, padding:10, borderRadius:8, color: COLORS.text, marginBottom:12, minHeight:40, textAlignVertical:'top' },
  toast: { position:'absolute', bottom:50, left:20, right:20, backgroundColor:'rgba(0,0,0,0.8)', padding:12, borderRadius:8, alignItems:'center' },
});