// Firebase configuration for global namespace (no module imports)
// Ensure the Firebase SDK scripts are loaded before this file.
const firebaseConfig = {
  apiKey: "AIzaSyAxLZHhuYqqpKNKKlkirbvTJASCFZCCXtc",
  authDomain: "ktu-canteen.firebaseapp.com",
  databaseURL: "https://ktu-canteen-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ktu-canteen",
  storageBucket: "ktu-canteen.firebasestorage.app",
  messagingSenderId: "544929346174",
  appId: "1:544929346174:web:ee44431daebee82bc01e2f"
};

// Initialize Firebase using the global `firebase` object provided by the CDN scripts.
if (typeof firebase !== "undefined" && firebase.initializeApp) {
  firebase.initializeApp(firebaseConfig);
} else {
  console.error("Firebase SDK not loaded. Ensure firebase-app.js script is included before firebase-config.js.");
}