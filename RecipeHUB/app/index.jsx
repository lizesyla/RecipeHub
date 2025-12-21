import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider,
  signInWithPopup } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { Modal, Animated } from "react-native";
import { useRef, useState, useCallback, useMemo } from "react";
import { COLORS } from "../components/theme"; 
import React from "react";


const googleProvider = new GoogleAuthProvider();
const GoogleLoginButton = React.memo(({ onPress, loading }) => {
  return (
    <TouchableOpacity
      style={styles.googleButton}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#4CAF50" />
      ) : (
        <>
          <Ionicons
            name="logo-google"
            size={20}
            color="#4CAF50"
            style={styles.googleIcon}
          />
          <Text style={styles.googleText}>Sign in with Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
});

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const [modalVisible, setModalVisible] = useState(false);
const [modalMessage, setModalMessage] = useState("");
const fadeAnim = useRef(new Animated.Value(0)).current;

const isFormValid = useMemo(() => {
  if (email.trim() === "" || password.trim() === "") return false;

  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(email)) return false;

  return true;
}, [email, password]);


const showModal = useCallback((message) => {
  setModalMessage(message);
  setModalVisible(true);
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 300,
    useNativeDriver: true,
  }).start();
}, []);


const hideModal = useCallback(() => {
  Animated.timing(fadeAnim, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  }).start(() => setModalVisible(false));
}, []);

  const handleEmailLogin = useCallback(async () => {
    if (!isFormValid) {
      setError("Invalid email or password");
      return;
    }
  
    setLoading(true);
    setError("");
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)/home");
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        setError("Incorrect email or password");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [email, password, isFormValid]);
  

  const handleGoogleLogin = useCallback(async () => {
    setLoading(true);
    setError("");
  
    try {
      await signInWithPopup(auth, googleProvider);
      router.replace("/(tabs)/home");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  
  const handleForgotPassword = useCallback(async () => {
    if (email.trim() === "") {
      showModal("Please enter your email to reset password");
      return;
    }
  
    setLoading(true);
  
    try {
      await sendPasswordResetEmail(auth, email);
      showModal("Password reset email has been sent!");
    } catch {
      showModal("Failed to send reset email");
    } finally {
      setLoading(false);
    }
  }, [email, showModal]);
  

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
          activeOpacity={0.7}
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
            <ActivityIndicator size="small" color="#fc91e5ff" />
          ) : (
            <>
              <Ionicons name="logo-google" size={20} color="#fc91e5ff" style={styles.googleIcon} />
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
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              width: 300,
              padding: 20,
              backgroundColor: "white",
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 16 }}>
              {modalMessage}
            </Text>
            <TouchableOpacity
              onPress={hideModal}
              style={{
                marginTop: 20,
                paddingHorizontal: 20,
                paddingVertical: 10,
                backgroundColor: "#fc91e5ff",
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: COLORS.card,
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
    color: COLORS.primary,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: COLORS.card,
    color: COLORS.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 15,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  accountText: {
    color: COLORS.textMuted,
    fontSize: 15,
    textAlign: "center",
  },
  signUpView: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: 14,
    marginTop: 4,
    textAlign: "right",
    width: "100%",
  },  
  primaryButton: {
    marginTop: 18,
    backgroundColor: COLORS.primary,
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
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "600",
  },
  googleButton: {
    marginTop: 12,
    backgroundColor: COLORS.background,
    paddingVertical: 10,
    borderRadius: 999,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  googleIcon: {
    marginRight: 10,
  },
  googleText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  }
});
