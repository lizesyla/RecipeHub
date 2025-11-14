// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQvRLoEYdpMDRU-wv7nnpdjjom4Aqf_Xk",
  authDomain: "recipehub-57b2c.firebaseapp.com",
  projectId: "recipehub-57b2c",
  storageBucket: "recipehub-57b2c.firebasestorage.app",
  messagingSenderId: "575256859562",
  appId: "1:575256859562:web:ed63b07d9b3c66078a51d3",
  measurementId: "G-Q4RC983CJF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);