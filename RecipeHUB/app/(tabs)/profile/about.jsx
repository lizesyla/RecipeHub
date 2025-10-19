import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function AboutUs() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>About Us</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.text}>
          Welcome to our app! 🌿{"\n\n"}
          Our mission is to provide a simple and elegant mobile experience that helps users
          stay connected and productive.{"\n\n"}
          We focus on delivering intuitive design, smooth navigation, and a clean interface
          - so you can focus on what matters most.{"\n\n"}
          Built using React Native and Expo.
        </Text>
      </ScrollView>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back-circle" size={60} color="#4CAF50" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 10,
  },
  text: {
    color: "#ccc",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  backButton: {
    marginTop: 30,
  },
});
