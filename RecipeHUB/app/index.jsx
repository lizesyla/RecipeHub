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
      <View style={styles.card}>
        <Text style={styles.title}>Log In</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#777"
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
          placeholderTextColor="#777"
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
          style={styles.primaryButton}
          onPress={handleEmailLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#111" />
          ) : (
            <>
              <Ionicons name="log-in-outline" size={20} color="#111" style={styles.primaryIcon} />
              <Text style={styles.primaryText}>Log In</Text>
            </>
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
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.linkText}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#161616",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#1f1f1f",
    color: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2c2c2c",
    fontSize: 15,
  },
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
    marginTop: 4,
    textAlign: "right",
    width: "100%",
  },  
  primaryButton: {
    marginTop: 18,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryIcon: {
    marginRight: 8,
  },
  primaryText: {
    color: "#111",
    fontSize: 16,
    fontWeight: "600",
  },
  googleButton: {
    marginTop: 12,
    backgroundColor: "#111",
    paddingVertical: 10,
    borderRadius: 999,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2e7d32",
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
  linkText: {
    color: "#4CAF50",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  signUpView: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
  },
  accountText: {
    color: "#AAAAAA",
    fontSize: 15,
    textAlign: "center",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  }
});


