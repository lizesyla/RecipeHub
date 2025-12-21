import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useEffect, useState, useCallback, useContext } from "react"; // Shtuar useContext
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import { COLORS } from "../../../components/theme";
// Nëse e përdor AuthContext, importoje këtu:
// import { AuthContext } from "../../../context/AuthContext"; 

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
  
  // 1. Deklarimi i state-ave
  const [message, setMessage] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // 2. Nëse përdor userData nga Context, zhblloko rreshtin poshtë:
  // const { userData } = useContext(AuthContext); 
  // Nëse nuk e përdor, po e deklarojmë si objekt bosh që të mos bëjë crash kodi yt
  const userData = {}; 

  useEffect(() => {
    // Animacioni i parë
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Kërkesa për leje të njoftimeve
    const requestPermission = async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        setNotificationsEnabled(status === "granted");

        if (status !== "granted") {
          console.log("Notification permission not granted");
        }
      } catch (error) {
        console.log("Error requesting permissions:", error);
      }
    };

    requestPermission();
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

    try {
      if (notificationsEnabled) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Mesazhi u dergua 📬",
            body: "Faleminderit që na kontaktuat. Do t'ju përgjigjemi së shpejti.",
          },
          trigger: null,
        });
      }
      
      // Këtu mund të shtosh kodin për dërgimin e mesazhit në Firebase nëse dëshiron

      if (Platform.OS === "web") {
        alert("Mesazhi u dërgua me sukses!");
      } else {
        Alert.alert("Sukses", "Mesazhi u dërgua me sukses!");
      }
      
      setMessage("");
    } catch (error) {
      console.log("Error sending notification:", error);
    }
  }, [message, notificationsEnabled]);

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
    paddingTop: 60,
  },
  backButton: {
    position: "absolute",
    top: 20,
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
    color: COLORS.primary || "#000",
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.textMuted || "#666",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  contactBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card || "#f0f0f0",
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
    width: "95%",
  },
  contactText: {
    color: COLORS.text || "#333",
    fontSize: 16,
    marginLeft: 12,
    flexShrink: 1,
  },
  button: {
    flexDirection: "row",
    backgroundColor: COLORS.buttonGreen || "#28a745",
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    width: "95%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    width: "95%",
    backgroundColor: COLORS.card || "#f0f0f0",
    color: COLORS.text || "#000",
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    marginVertical: 12,
    minHeight: 100,
    textAlignVertical: "top",
  },
});