// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

  const firebaseConfig = {
    apiKey: "AIzaSyBBPvX-mlCdStLS7hrAEehMBWaukrdrXD8",
    authDomain: "vedant-d772a.firebaseapp.com",
    projectId: "vedant-d772a",
    storageBucket: "vedant-d772a.firebasestorage.app",
    messagingSenderId: "758193359460",
    appId: "1:758193359460:web:d67b0f378d163ed4312d71",
    measurementId: "G-KZLLC3WHM5"
  };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, database };