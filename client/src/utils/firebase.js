import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const apiKey = import.meta.env.VITE_FIREBASE_APIKEY?.trim();

if (!apiKey) {
  throw new Error("Missing VITE_FIREBASE_APIKEY. Set it in client/.env and restart Vite.");
}

const firebaseConfig = {
  apiKey,
  authDomain: "authexamnotes-bac5c.firebaseapp.com",
  projectId: "authexamnotes-bac5c",
  storageBucket: "authexamnotes-bac5c.firebasestorage.app",
  messagingSenderId: "99221487604",
  appId: "1:99221487604:web:1cbc5b6cdd1079c034c3a1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth,provider}