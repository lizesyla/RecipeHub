import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, Platform, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, signOut } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";

export default function Register() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access gallery is required");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (e) {
      setError("Failed to pick image");
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access camera is required");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (e) {
      setError("Failed to open camera");
    }
  };

  const validateInputs = () => {
    if (fullName.trim() === "" || email.trim() === "" || password.trim() === "" || confirmPassword.trim() === "") {
      setError("All fields are required");
      return false;
    }

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      setError("Email is not valid");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    setError("");
    return true;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;
    
    setLoading(true);
    setError("");
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Ruaj vetëm URL-n lokale të fotos (pa Firebase Storage)
      await updateProfile(userCredential.user, {
        displayName: fullName,
        ...(profileImage ? { photoURL: profileImage } : {}),
      });
      await signOut(auth);
      setLoading(false);
      setModalVisible(true);
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/email-already-in-use") {
        setError("Email already exists");
      } else {
        setError(error.message);
      }
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    router.replace("/");
  };
  const handleGoogleRegister = async () => {
    if (Platform.OS !== "web") {
      setError("Google Sign-Up is only available on web");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await signInWithPopup(auth, googleProvider);
      setLoading(false);
      router.replace("/(tabs)/home");
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/email-already-in-use") {
        setError("Email already exists");
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Sign Up</Text>

        <View style={styles.imageWrapper}>
          <View style={styles.imagePlaceholder}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <Ionicons name="person-circle-outline" size={80} color="#555" />
            )}
          </View>
          <View style={styles.imageButtonsRow}>
            <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
              <Text style={styles.imageButtonText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageButton} onPress={handleTakePhoto}>
              <Text style={styles.imageButtonText}>Camera</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#777"
          value={fullName}
          onChangeText={(text) => {
            setFullName(text);
            setError("");
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#777"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError("");
          }}
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
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          placeholderTextColor="#777"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setError("");
          }}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#111" />
          ) : (
            <>
              <Ionicons name="person-add-outline" size={20} color="#111" style={styles.primaryIcon} />
              <Text style={styles.primaryText}>Create Account</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#4CAF50" />
          ) : (
            <>
              <Ionicons name="logo-google" size={20} color="#4CAF50" style={styles.googleIcon} />
              <Text style={styles.googleText}>Sign up with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.loginView}>
          <Text style={styles.accountText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/")}>
            <Text style={styles.linkText}> Log In</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
            <Text style={styles.modalTitle}>Success!</Text>
            <Text style={styles.modalText}>Account created successfully!</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
              <Text style={styles.modalButtonText}>Go to Login</Text>
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
    marginBottom: 20,
    textAlign: "center",
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#1f1f1f",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2c2c2c",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  imageButtonsRow: {
    flexDirection: "row",
    gap: 10,
  },
  imageButton: {
    backgroundColor: "#1f1f1f",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#4CAF50",
    marginHorizontal: 4,
  },
  imageButtonText: {
    color: "#fff",
    fontSize: 12,
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
  loginView: {
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#161616",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 15,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

