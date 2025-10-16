import { View, Text, StyleSheet } from "react-native";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ℹ️ About Recipe Hub</Text>
      <Text style={styles.text}>
        Welcome to Recipe Hub! 🍳{"\n\n"}
        This app helps you explore and share delicious recipes from around the
        world. You can browse meals, save favorites, and learn how to cook step
        by step.
      </Text>
      <Text style={styles.footer}>Version 1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#FF7F50",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    color: "#333",
  },
  footer: {
    marginTop: 30,
    fontSize: 14,
    color: "#888",
  },
});
