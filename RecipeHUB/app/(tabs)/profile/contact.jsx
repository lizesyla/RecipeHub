import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useEffect } from "react";

export default function ContactUs() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
          {/* LOGO */}
          <Image
            source={require("../../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* TITULLI */}
          <Text style={styles.title}>Contact Us</Text>
          <Text style={styles.subtitle}>
            Na kontaktoni për çdo pyetje apo sugjerim! 🌿
          </Text>

          {/* KONTAKT INFO */}
          <View style={styles.contactBox}>
            <Ionicons name="call" size={24} color="#4CAF50" />
            <Text style={styles.contactText}>+383 44 123 456</Text>
          </View>

          <View style={styles.contactBox}>
            <Ionicons name="mail" size={24} color="#4CAF50" />
            <Text style={styles.contactText}>contact@app.com</Text>
          </View>

          <View style={styles.contactBox}>
            <Ionicons name="location" size={24} color="#4CAF50" />
            <Text style={styles.contactText}>Prishtina, Kosovo</Text>
          </View>

          {/* BUTONI MESAZH */}
          <TouchableOpacity style={styles.button}>
            <Ionicons name="chatbox-ellipses-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Send Message</Text>
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
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  contactBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    width: "100%",
  },
  contactText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 12,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "bold",
  },
});
