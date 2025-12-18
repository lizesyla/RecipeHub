import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";


const firebaseConfig = {
  apiKey: "AIzaSyDQvRLoEYdpMDRU-wv7nnpdjjom4Aqf_Xk",
  authDomain: "recipehub-57b2c.firebaseapp.com",
  projectId: "recipehub-57b2c",
  storageBucket: "recipehub-57b2c.firebasestorage.app",
  messagingSenderId: "575256859562",
  appId: "1:575256859562:web:ed63b07d9b3c66078a51d3",
  measurementId: "G-Q4RC983CJF"
};


const app = initializeApp(firebaseConfig);
let auth;

if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  })
}

export { auth };


export const db = getFirestore(app);
export default app;




