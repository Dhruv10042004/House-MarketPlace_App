// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyCrR5gIFBaNZUb7D2b2nFK7LOIsODbR2uY",
  authDomain: "house-marketplace-app-29f4c.firebaseapp.com",
  projectId: "house-marketplace-app-29f4c",
  storageBucket: "house-marketplace-app-29f4c.appspot.com",
  messagingSenderId: "597522060910",
  appId: "1:597522060910:web:9670552d13fd2f423c787f"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db=getFirestore();