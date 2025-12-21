import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import { TextInput, Platform, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import { useState, useCallback } from "react";
import { COLORS } from "../../../components/theme"; 

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Contact() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const [message, setMessage] = useState("");

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Notification permission not granted");
      }
    };

    requestPermission();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const sendMessage = useCallback(async () => {
    if (!message.trim()) {
      if (Platform.OS === "web") {
        alert("Ju lutemi plotësojeni fushën e kërkuar.");
      } else {
        Alert.alert("Error", "Ju lutemi plotësojeni fushën e kërkuar.");
      }
      return;
    }

    if (Platform.OS === "web") {
      alert("Mesazhi u dërgua me sukses! Mbesim në kontakt. 🌿");
    } else {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Message Sent",
          body: "Mesazhi u dërgua me sukses! Mbesim në kontakt. 🌿",
        },
        trigger: null,
      });
    }

    setMessage("");
  }, [message]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back-circle" size={50} color="#fc91e5ff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View
          style={{ opacity: fadeAnim, alignItems: "center", width: "100%" }}
        >
          <Image
            source={require("../../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Contact Us</Text>
          <Text style={styles.subtitle}>
            Na kontaktoni për çdo pyetje apo sugjerim! 🌿
          </Text>

          <View style={styles.contactBox}>
            <Ionicons name="call" size={24} color="#fc91e5ff" />
            <Text style={styles.contactText}>+383 44 123 456</Text>
          </View>

          <View style={styles.contactBox}>
            <Ionicons name="mail" size={24} color="#fc91e5ff" />
            <Text style={styles.contactText}>contact@app.com</Text>
          </View>

          <View style={styles.contactBox}>
            <Ionicons name="location" size={24} color="#fc91e5ff" />
            <Text style={styles.contactText}>Prishtina, Kosovo</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Write your message here..."
            placeholderTextColor="#888"
            value={message}
            onChangeText={setMessage}
            multiline
          />

          <TouchableOpacity style={styles.button} onPress={sendMessage}>
            <Text style={styles.buttonText}>Send Message</Text>
            <Ionicons
              name="chatbox-ellipses-outline"
              size={20}
              color="#fff"
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  contactBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
    width: "95%",
  },
  contactText: {
    color: COLORS.text,
    fontSize: 16,
    marginLeft: 12,
    flexShrink: 1,
  },
  button: {
    flexDirection: "row",
    backgroundColor: COLORS.buttonGreen,
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    width: "95%",
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    width: "95%",
    backgroundColor: COLORS.card,
    color: COLORS.text,
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    marginVertical: 12,
    minHeight: 80,
    textAlignVertical: "top",
  },
});
