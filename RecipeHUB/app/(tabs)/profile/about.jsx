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
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
    <Image
      source={require("../../../assets/logo.png")}
      style={styles.logo}
      resizeMode="contain"
    />


        <Text style={styles.title}>About Us</Text>

        <ScrollView contentContainerStyle={styles.scrollContent}>
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
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back-circle" size={65} color="#4CAF50" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
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
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  text: {
    color: "#ccc",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  backButton: {
    marginTop: 35,
  },
});
