// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBWbdVlmKX9WrhY5tGQ0Z-W7aLh8n8WafQ",
  authDomain: "wagering-game-b9b3b.firebaseapp.com",
  projectId: "wagering-game-b9b3b",
  storageBucket: "wagering-game-b9b3b.appspot.com",
  messagingSenderId: "463043443226",
  appId: "1:463043443226:web:57ea3f10fa819dbef66fa3",
  measurementId: "G-7Z75V50ZHW"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);

export {app,auth};