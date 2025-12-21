// import { View, Text, Switch, StyleSheet, Alert } from "react-native";
// import { useEffect, useState } from "react";
// import * as Notifications from "expo-notifications";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { auth, db } from "../../../firebase";
// import { doc, getDoc, setDoc } from "firebase/firestore";

// export default function NotificationsScreen() {
//     const [enabled, setEnabled] = useState(false);
//     const user = auth.currentUser;

//     useEffect(() => {
//         registerForPushNotifications();
//     }, []);

//     useEffect(() => {
//         if (!user) return;

//         const loadSettings = async () => {
//             const ref = doc(db, "users", user.uid);
//             const snap = await getDoc(ref);

//             if (snap.exists()) {
//                 setEnabled(snap.data()?.settings?.notifications ?? false);
//             }
//         };

//         loadSettings();
//     }, []);


//     const registerForPushNotifications = async () => {
//         const { status } = await Notifications.getPermissionsAsync();

//         let finalStatus = status;

//         if (status !== "granted") {
//             const request = await Notifications.requestPermissionsAsync();
//             finalStatus = request.status;
//         }

//         if (finalStatus !== "granted") {
//             Alert.alert(
//                 "Permission required",
//                 "Enable notifications from settings."
//             );
//             return;
//         }
//     };

//     const toggleNotifications = async (value) => {
//         if (!user) return;

//         setEnabled(value);

//         await setDoc(
//             doc(db, "users", user.uid),
//             {
//                 settings: {
//                     notifications: value,
//                 },
//             },
//             { merge: true }
//         );

//         if (value) {
//             await Notifications.scheduleNotificationAsync({
//                 content: {
//                     title: "Notifications Enabled 🔔",
//                     body: "You will receive recipe notifications.",
//                 },
//                 trigger: null,
//             });
//         }
//     };


//     return (
//         <SafeAreaView style={styles.container}>
//             <Text style={styles.title}>Notification Settings</Text>

//             <View style={styles.row}>
//                 <Text style={styles.label}>Enable Notifications for Create</Text>
//                 <Switch
//                     value={enabled}
//                     onValueChange={toggleNotifications}
//                     thumbColor={enabled ? "#FF5FA2" : "#ccc"}
//                 />
//             </View>

//             <Text style={styles.info}>
//                 When enabled, you will receive notifications when creating recipes or
//                 important updates.
//             </Text>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#0F0F14",
//         padding: 20,
//     },
//     title: {
//         fontSize: 22,
//         fontWeight: "bold",
//         color: "#FF5FA2",
//         marginBottom: 20,
//     },
//     row: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         backgroundColor: "#1A1A22",
//         padding: 16,
//         borderRadius: 12,
//     },
//     label: {
//         color: "#fff",
//         fontSize: 16,
//     },
//     info: {
//         marginTop: 20,
//         color: "#aaa",
//         fontSize: 14,
//     },
// });
import { View, Text, Switch, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { COLORS } from "../../../components/theme"; 

export default function NotificationsScreen() {
  const [enabled, setEnabled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  useEffect(() => {
    if (!user) return;

    const loadSettings = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setEnabled(snap.data()?.settings?.notifications ?? false);
      }
    };

        loadSettings();
    }, []);

  const registerForPushNotifications = async () => {
    const { status } = await Notifications.getPermissionsAsync();

    let finalStatus = status;

    if (status !== "granted") {
      const request = await Notifications.requestPermissionsAsync();
      finalStatus = request.status;
    }

    if (finalStatus !== "granted") {
      Alert.alert(
        "Permission required",
        "Enable notifications from settings."
      );
      return;
    }
  };

  const toggleNotifications = async (value) => {
    if (!user) return;

    setEnabled(value);

    await setDoc(
      doc(db, "users", user.uid),
      {
        settings: {
          notifications: value,
        },
      },
      { merge: true }
    );

        if (value) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Notifications Enabled 🔔",
                    body: "You will receive recipe notifications.",
                },
                trigger: null,
            });
        }
    };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>

            <View style={styles.row}>
                <Text style={styles.label}>Enable Notifications for Create</Text>
                <Switch
                    value={enabled}
                    onValueChange={toggleNotifications}
                    thumbColor={enabled ? COLORS.primary : COLORS.textMuted}
                    trackColor={{ true: COLORS.accent, false: COLORS.border }}
                />
            </View>

      <Text style={styles.info}>
        When enabled, you will receive notifications when creating recipes or important updates.
      </Text>

      {enabled && (
        notifications.length > 0 ? (
          notifications.map(item => (
            <Text key={item.id}>{item.title}</Text>
          ))
        ) : (
          <Text>No items yet!</Text>
        )
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: COLORS.primary,
        marginBottom: 20,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: COLORS.card,
        padding: 16,
        borderRadius: 12,
    },
    label: {
        color: COLORS.text,
        fontSize: 16,
    },
    info: {
        marginTop: 20,
        color: COLORS.textMuted,
        fontSize: 14,
    },
});
