import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export let analytics = null;
if (typeof window !== "undefined") {
  const { getAnalytics } = require("firebase/analytics");
  analytics = getAnalytics(app);
}
