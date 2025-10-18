import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
  const router = useRouter();

  return (
    <View  style={styles.container}>
      <Text style={styles.title}>Log In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity
        style={styles.arrowButton}
        onPress={() => router.push("/(tabs)/home")}
      >
        <Ionicons name="arrow-forward-circle" size={60} color="#4CAF50" />
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#111",
      justifyContent: "center",
      alignItems: "center",
    },
    title: { fontSize: 26, fontWeight: "bold", color: "#fff", marginBottom: 40 },
    input: {
      width: "80%",
      backgroundColor: "#222",
      color: "#fff",
      padding: 12,
      borderRadius: 10,
      marginVertical: 8,
    },
    arrowButton: { marginTop: 30 },
  });


