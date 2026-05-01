// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxLZHhuYqqpKNKKlkirbvTJASCFZCCXtc",
  authDomain: "ktu-canteen.firebaseapp.com",
  databaseURL: "https://ktu-canteen-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ktu-canteen",
  storageBucket: "ktu-canteen.firebasestorage.app",
  messagingSenderId: "544929346174",
  appId: "1:544929346174:web:ee44431daebee82bc01e2f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);