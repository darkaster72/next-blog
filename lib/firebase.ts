// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWgMTAN7V7_R_tdgM35_05wpWnL7PPXMo",
  authDomain: "next-blog-app-c7eb1.firebaseapp.com",
  projectId: "next-blog-app-c7eb1",
  storageBucket: "next-blog-app-c7eb1.appspot.com",
  messagingSenderId: "484106198314",
  appId: "1:484106198314:web:4f59ea7a932e8324699253",
  measurementId: "G-Z827R9JMW0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const signInWithGoogle = async () => {
  return await signInWithPopup(auth, provider);
};
