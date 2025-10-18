import { View, Text, StyleSheet, StatusBar, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function ContactScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
      <View style={styles.container}>
        <Text style={styles.infoText}>
          Ky është Contact Screen! Këtu mund të vendosni informacionin për kontakt.
        </Text>

        <View style={styles.contactBox}>
          <Ionicons name="call" size={24} color="#4CAF50" />
          <Text style={styles.contactText}>+383 44 123 456</Text>
        </View>

        <View style={styles.contactBox}>
          <Ionicons name="mail" size={24} color="#4CAF50" />
          <Text style={styles.contactText}>contact@app.com</Text>
        </View>

        <TouchableOpacity style={styles.button}>
          <Ionicons name="chatbox-ellipses-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Send Message</Text>
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