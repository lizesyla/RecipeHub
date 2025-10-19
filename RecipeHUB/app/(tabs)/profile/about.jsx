import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

export default function AboutUs() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back-circle" size={50} color="#4CAF50" />
      </TouchableOpacity>

      <Animated.View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>About Us</Text>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.text}>
            Welcome to our app! 🌿{"\n\n"}
            We’re a passionate team dedicated to creating simple, elegant, and
            powerful mobile experiences.{"\n\n"}
            Our mission is to make your daily tasks smoother and your digital
            life more enjoyable — with a clean design, fast performance, and an
            intuitive interface.{"\n\n"}
            Built proudly using React Native & Expo.
          </Text>
        </ScrollView>

        <TouchableOpacity
          style={styles.contactLink}
          onPress={() => router.push("/(tabs)/profile/contact")}
          activeOpacity={0.7} 
        >
          <Text style={styles.linkText}>Contact Us</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 5,
    paddingBottom: 100, 
  },
  text: {
    color: "#ccc",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  contactLink: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#1a1a1a",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  linkText: {
    color: "#4CAF50",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
