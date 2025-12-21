import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function NotFound() {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={90} color="#e756b7ff" />

      <Text style={styles.title}>Faqja nuk u gjet</Text>
      <Text style={styles.subtitle}>
        Linku që po kërkon nuk ekziston ose është fshirë.
      </Text>

      <Link href="/" asChild>
        <Pressable style={styles.button}>
          <Ionicons name="arrow-back-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Kthehu në Home</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fde9f6ff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#e756b7ff",
    marginTop: 15,
  },
  subtitle: {
    fontSize: 15,
    color: "#454343ff",
    textAlign: "center",
    marginVertical: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fc91e5ff",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 30,
    marginTop: 20,
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
