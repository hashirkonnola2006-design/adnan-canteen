// Firebase Realtime Database - Shared Config & Helpers
// Initialize Firebase (config will be set below)

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

// Initialize Firebase
firebase.initializeApp(FIREBASE_CONFIG);
const db = firebase.database();

// ========== MENU HELPERS ==========
async function dbGetMenu() {
  const snapshot = await db.ref('menu').once('value');
  const data = snapshot.val();
  if (!data) return [];
  // Convert object to array
  return Object.keys(data).map(key => ({ _id: key, ...data[key] }));
}

async function dbSaveMenuItem(item) {
  const id = item._id || db.ref('menu').push().key;
  const saveData = { ...item };
  delete saveData._id;
  await db.ref('menu/' + id).set(saveData);
  return id;
}

async function dbUpdateMenuItem(id, updates) {
  await db.ref('menu/' + id).update(updates);
}

async function dbDeleteMenuItem(id) {
  await db.ref('menu/' + id).remove();
}

// ========== ORDERS HELPERS ==========
async function dbGetOrders() {
  const snapshot = await db.ref('orders').once('value');
  const data = snapshot.val();
  if (!data) return [];
  return Object.keys(data).map(key => ({ id: key, ...data[key] }));
}

async function dbSaveOrder(order) {
  const id = order.id || db.ref('orders').push().key;
  const saveData = { ...order };
  delete saveData.id;
  await db.ref('orders/' + id).set(saveData);
  return id;
}

async function dbUpdateOrder(id, updates) {
  await db.ref('orders/' + id).update(updates);
}

// ========== SETTINGS HELPERS ==========
async function dbGetSettings() {
  const snapshot = await db.ref('settings').once('value');
  return snapshot.val() || { canteen_name: 'Smart Canteen', owner_upi: 'hashirkonnola2006@oksbi', owner_phone: '' };
}

async function dbSaveSettings(settings) {
  await db.ref('settings').set(settings);
}

// ========== REALTIME LISTENERS ==========
function dbOnMenuChange(callback) {
  db.ref('menu').on('value', snapshot => {
    const data = snapshot.val();
    if (!data) return callback([]);
    callback(Object.keys(data).map(key => ({ _id: key, ...data[key] })));
  });
}

function dbOnOrdersChange(callback) {
  db.ref('orders').on('value', snapshot => {
    const data = snapshot.val();
    if (!data) return callback([]);
    callback(Object.keys(data).map(key => ({ id: key, ...data[key] })));
  });
}
