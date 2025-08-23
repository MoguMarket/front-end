// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNnrZ5QREI9Z3_TN5jGJlY_ra67L5o6pY",
  authDomain: "web-kit-69b0d.firebaseapp.com",
  projectId: "web-kit-69b0d",
  storageBucket: "web-kit-69b0d.firebasestorage.app",
  messagingSenderId: "952396845343",
  appId: "1:952396845343:web:a4fafd49ea00b7a3e3e02a",
  measurementId: "G-DWSHYWXHSW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
