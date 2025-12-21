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
import { useRef, useEffect, useState, useCallback, useContext } from "react"; 
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import { COLORS } from "../../../components/theme";
import emailjs from '@emailjs/browser'; 


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
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const userData = {}; 

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

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
    Platform.OS === "web" ? alert("Plotëso fushën!") : Alert.alert("Error", "Plotëso fushën!");
    return;
  }

  const templateParams = {
    message: message,
    from_name: userData?.name || "Përdorues i Paidentifikuar", 
    reply_to: userData?.email || "nuk ka email",
  };

  try {
    await emailjs.send(
      'service_lwy8qyv',  
      'template_6y5tk8n',  
      templateParams,
      '0cElaOrnxUKsTEBID'   
    );

    if (notificationsEnabled) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Mesazhi u dërgua 📬",
          body: "Faleminderit! Ne e morëm email-in tuaj.",
        },
        trigger: null,
      });
    }

    if (Platform.OS === "web") {
      alert("Email-i u dërgua me sukses!");
    } else {
      Alert.alert("Sukses", "Email-i u dërgua me sukses!");
    }

    setMessage("");
  } catch (error) {
    console.log("Gabim gjatë dërgimit:", error);
    Alert.alert("Gabim", "Dërgimi dështoi. Provo përsëri.");
  }
}, [message, notificationsEnabled, userData]);

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