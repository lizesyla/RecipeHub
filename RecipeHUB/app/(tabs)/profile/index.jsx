import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "android" ? "#4CAF50" : "transparent"}
        translucent={Platform.OS === "android"}
      />

      <ScrollView contentContainerStyle={{ padding: 20 }}>
       

        <View style={styles.infoBox}>
          <Ionicons name="person-circle-outline" size={24} color="#4CAF50" />
          <Text style={styles.infoTextBox}>RecipeHUB</Text>
        </View>
        <View style={styles.infoBox}>
          <Ionicons name="mail-outline" size={24} color="#4CAF50" />
          <Text style={styles.infoTextBox}>recipehub@example.com</Text>
        </View>
        <View style={styles.infoBox}>
          <Ionicons name="calendar-outline" size={24} color="#4CAF50" />
          <Text style={styles.infoTextBox}>Joined: Jan 2025</Text>
        </View>

        <Text style={styles.sectionHeader}>Favorite Recipes</Text>
        <View style={styles.favoriteBox}>
          <Ionicons name="heart" size={20} color="#fff" />
          <Text style={styles.favoriteText}>Chocolate Cake</Text>
        </View>
        <View style={styles.favoriteBox}>
          <Ionicons name="heart" size={20} color="#fff" />
          <Text style={styles.favoriteText}>Pasta Carbonara</Text>
        </View>
        <View style={styles.favoriteBox}>
          <Ionicons name="heart" size={20} color="#fff" />
          <Text style={styles.favoriteText}>Caesar Salad</Text>
        </View>

        <Text style={styles.sectionHeader}>About Me</Text>
        <Text style={styles.infoText}>Food lover and aspiring chef! Always exploring new recipes and sharing favorites.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  headerText: {
    color: "#4CAF50",
    fontSize: 24,
    fontWeight: "bold",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
  infoTextBox: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 12,
  },
  sectionHeader: {
    color: "#4CAF50",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  favoriteBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  favoriteText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  infoText: {
    color: "#fff",
    fontSize: 16,
  },
});