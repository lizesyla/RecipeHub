import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
  const router = useRouter();

  return (
    <View>
      <Text>Log In</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity
        onPress={() => router.push("/(tabs)/home")}
      >
        <Ionicons name="arrow-forward-circle" size={60} color="#4CAF50" />
      </TouchableOpacity>
    </View>
  );
}


