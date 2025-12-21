import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, Platform, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useCallback, useMemo } from "react";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { db } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { COLORS } from "../components/theme";

export const googleProvider = new GoogleAuthProvider();

const ProfileImagePicker = React.memo(({ profileImage, onPickImage, onTakePhoto }) => {
  return (
    <View style={styles.imageWrapper}>
      <View style={styles.imagePlaceholder}>
        {profileImage ? (
          <Image source={{ uri: `data:image/jpeg;base64,${profileImage}` }} style={styles.profileImage} />
        ) : (
          <Ionicons name="person-circle-outline" size={80} color="#555" />
        )}
      </View>

      <View style={styles.imageButtonsRow}>
        <TouchableOpacity style={styles.imageButton} onPress={onPickImage}>
          <Text style={styles.imageButtonText}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.imageButton} onPress={onTakePhoto}>
          <Text style={styles.imageButtonText}>Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

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

  const handlePickImage = useCallback(async () => {
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
        quality: 0.3,
        base64: true,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].base64);
      }
    } catch {
      setError("Failed to pick image");
    }
  }, []);

  const handleTakePhoto = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access camera is required");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.3,
        base64: true,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].base64);
      }
    } catch {
      setError("Failed to open camera");
    }
  }, []);

  const isFormValid = useMemo(() => {
    if (
      fullName.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      return false;
    }

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) return false;
    if (password.length < 6) return false;
    if (password !== confirmPassword) return false;

    return true;
  }, [fullName, email, password, confirmPassword]);

  const handleSignUp = useCallback(async () => {
    if (!isFormValid) return;

    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await updateProfile(userCredential.user, { displayName: fullName });

      await setDoc(doc(db, "users", uid), {
        fullName,
        email,
        photo: profileImage ? `data:image/jpeg;base64,${profileImage}` : null,
        createdAt: new Date(),
      });

      await signOut(auth);
      setModalVisible(true);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("Email already exists");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [email, password, fullName, profileImage, isFormValid]);

  const handleModalClose = () => {
    setModalVisible(false);
    router.replace("/");
  };

  const handleGoogleRegister = async () => {
    if (Platform.OS !== "web") return;

    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          fullName: user.displayName || "",
          email: user.email,
          photo: user.photoURL || null,
          provider: "google",
          createdAt: new Date(),
        });
      }

      router.replace("/(tabs)/home");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Sign Up</Text>

        <ProfileImagePicker profileImage={profileImage} onPickImage={handlePickImage} onTakePhoto={handleTakePhoto} />

        <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#777" value={fullName} onChangeText={(text) => { setFullName(text); setError(""); }} />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#777" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} value={email} onChangeText={(text) => { setEmail(text); setError(""); }} />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry placeholderTextColor="#777" value={password} onChangeText={(text) => { setPassword(text); setError(""); }} />
        <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry placeholderTextColor="#777" value={confirmPassword} onChangeText={(text) => { setConfirmPassword(text); setError(""); }} />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          testID="register-button"
          style={styles.primaryButton}
          onPress={handleSignUp}
          disabled={loading || !isFormValid} 
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
          testID="google-register-button"
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

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={handleModalClose}>
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
    color: COLORS.text,
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
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
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
    backgroundColor: COLORS.primarySoft,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginHorizontal: 4,
  },
  imageButtonText: {
    color: COLORS.text,
    fontSize: 12,
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
    borderColor: COLORS.primary,
    fontSize: 15,
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
  linkText: {
    color: COLORS.primary,
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
    color: COLORS.textMuted,
    fontSize: 15,
    textAlign: "center",
  },
  errorText: {
    color: COLORS.danger,
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
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 15,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "bold",
  },
});