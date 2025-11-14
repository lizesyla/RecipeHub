import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
export default function Register() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: fullName });
      Alert.alert("Success", "Account created successfully!");
      // Wait a moment for auth state to update, then navigate
      setTimeout(() => {
        router.replace("/(tabs)/home");
      }, 100);
    } catch (error) {
      Alert.alert("Registration Error", error.message);
    }
  };
  const handleGoogleRegister = async () => {
    // signInWithPopup only works on web
    if (Platform.OS !== "web") {
      Alert.alert(
        "Not Available", 
        "Google Sign-Up with popup is only available on web. Please use email/password registration on mobile devices."
      );
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
      // Navigation will be handled automatically by AuthContext
    } catch (error) {
      Alert.alert("Google Sign Up Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#aaa"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        placeholderTextColor="#aaa"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={styles.arrowButton} 
        onPress={handleRegister}
      >
        <Ionicons name="arrow-forward-circle" size={60} color="#4CAF50" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleRegister}>
        <Text style={styles.googleText}>Sign up with Google</Text>
      </TouchableOpacity>

      <View style={styles.loginView}>
        <Text style={styles.accountText}>Already have an account?</Text>
        <TouchableOpacity
          onPress={() => router.push("/")}
        >
          <Text style={styles.linkText}> Log In</Text>
        </TouchableOpacity>
      </View>

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
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 40
  },
  input: {
    width: "80%",
    backgroundColor: "#222",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
  },
  arrowButton: {
    marginTop: 30
  },
  linkText: {
    color: "#4CAF50",
    fontSize: 16,
    textAlign: "center",
  },
  loginView: {
    flexDirection: "row",
    marginTop: 20,
  },
  accountText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  googleButton: { marginTop: 20, backgroundColor: "#4285F4", padding: 10, borderRadius: 8 },
  googleText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  linkText: { color: "#4CAF50", fontSize: 16, textAlign: "center" },
  loginView: { flexDirection: "row", marginTop: 20 },
  accountText: { color: "#FFFFFF", fontSize: 16, textAlign: "center" }
});

