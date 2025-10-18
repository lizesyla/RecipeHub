import { View, Text, StyleSheet, StatusBar, Platform, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="information-circle-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>More Info</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 20,
    backgroundColor: "#222",
    alignItems: "center",
  },
  headerText: {
    color: "#4CAF50",
    fontSize: 24,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  infoText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  contactBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    width: "100%",
  },
  contactText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 12,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "bold",
  },
});