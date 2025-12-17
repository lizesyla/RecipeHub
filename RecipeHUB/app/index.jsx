import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";


export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (email.trim() === "" || password.trim() === "") {
        setError("Both fields are required");
        return false;
    }

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
        setError("Email is not valid");
        return false;
    }

    setError("");
    return true;
  }


  const handleEmailLogin = async () => {
    if (!validateInputs()) return;
    
    setLoading(true);
    setError("");
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      router.replace("/(tabs)/home");
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/invalid-credential") {
        setError("Incorrect email or password");
      } else {
        setError(error.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    
    try {
      await signInWithPopup(auth, googleProvider);
      setLoading(false);
      router.replace("/(tabs)/home");
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/invalid-credential") {
        setError("Incorrect email or password");
      } else {
        setError(error.message);
      }
    }
  };
  const handleForgotPassword = async () => {
    if (email.trim() === "") {
      setError("Please enter your email to reset password");
      return;
    }
  
    setLoading(true);
    setError("");
  
    try {
      await sendPasswordResetEmail(auth, email);
      setError("Password reset email has been sent!");
    } catch (error) {
      setError("Failed to send reset email");
    }
  
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError("");
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setError("");
        }}
      />
      <TouchableOpacity onPress={handleForgotPassword}>
           <Text style={styles.forgotText}>Forgot Password?</Text>
       </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity 
        style={styles.arrowButton} 
        onPress={handleEmailLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <Ionicons name="arrow-forward-circle" size={60} color="#4CAF50" />
        )}
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.googleButton} 
        onPress={handleGoogleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#4CAF50" />
        ) : (
          <>
            <Ionicons name="logo-google" size={20} color="#4CAF50" style={styles.googleIcon} />
            <Text style={styles.googleText}>Sign in with Google</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.signUpView}>
        <Text style={styles.accountText}>Don't have an account?</Text>
        <TouchableOpacity
          onPress={() => router.push("/register")}
        >
          <Text style={styles.linkText}> Sign Up</Text>
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
  forgotText: {
    color: "#4CAF50",
    fontSize: 14,
    marginTop: 5,
    textAlign: "right",
    width: "100%",
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
   textAlign: "center" },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  }
});


