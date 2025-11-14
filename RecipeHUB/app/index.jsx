import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert  } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      setTimeout(() => {
        router.replace("/(tabs)/home");
      }, 100);
    } catch (error) {
      Alert.alert("Login Error", error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      
    } catch (error) {
      Alert.alert("Google Login Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
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

<TouchableOpacity style={styles.arrowButton} onPress={handleEmailLogin}>
        <Ionicons name="arrow-forward-circle" size={60} color="#4CAF50" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Ionicons name="logo-google" size={20} color="#4CAF50" style={styles.googleIcon} />
        <Text style={styles.googleText}>Sign in with Google</Text>
      </TouchableOpacity>

      <View style={styles.signUpView}>
        <Text style={styles.accountText}>Don't have an account?</Text>
        <TouchableOpacity
          onPress={() => router.push("/register")}
        >
          <Text style={styles.linkText}> Sign Up</Text>
        </TouchableOpacity>
      </View>
      

      {/* about us */}
       <TouchableOpacity
        style={styles.aboutUsButton}
        onPress={() => router.push("./profile/about")}
      >
        <Text style={styles.aboutUsText}>About Us</Text>
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
  linkText: {
    color: "#4CAF50",
    fontSize: 16,
    textAlign: "center",
  },
  accountText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  signUpView: {
    flexDirection: "row",
    marginTop: 20,
  },
    aboutUsButton: {
    position: "absolute",
    bottom: 40,
  },
  aboutUsText: {
    color: "#4CAF50",
    fontSize: 16,
    textAlign: "center",
  },
  googleButton: {
    marginTop: 20,
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 10,
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  googleIcon: {
    marginRight: 10,
  },
  googleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  linkText:
   { color: "#4CAF50",
    fontSize: 16,
     textAlign: "center" },
  signUpView:
   { flexDirection: "row",
    marginTop: 20 },
  accountText:
   { color: "#FFFFFF", 
   fontSize: 16, 
   textAlign: "center" }
});


