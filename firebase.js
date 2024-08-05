// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1v5AOxM15nk0f_uB6RJ5O8r271vlrVPc",
  authDomain: "inventory-management-d7762.firebaseapp.com",
  projectId: "inventory-management-d7762",
  storageBucket: "inventory-management-d7762.appspot.com",
  messagingSenderId: "13839893385",
  appId: "1:13839893385:web:e695cc456beb3b18921758",
  measurementId: "G-WM0SCFZMQF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export{firestore}