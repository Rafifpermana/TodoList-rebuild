// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Konfigurasi Firebase Anda (dari Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBbyugQBkcjpP9dI9tEYFXyNxufEF8hMns",
  authDomain: "mysmartnotebook-df42b.firebaseapp.com",
  projectId: "mysmartnotebook-df42b",
  storageBucket: "mysmartnotebook-df42b.firebasestorage.app",
  messagingSenderId: "1084724733648",
  appId: "1:1084724733648:web:59bf3a7261cbef438860d5",
  measurementId: "G-W13H242SGM",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
