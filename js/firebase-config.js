// Firebase Configuration
// Replace these values with your actual Firebase config from Firebase Console

const firebaseConfig = {
  apiKey: "AIzaSyBr2hEOCwEVDNy1fZ12q27BQUW3_S7nY9k",
  authDomain: "cms-centrereed.firebaseapp.com",
  projectId: "cms-centrereed",
  storageBucket: "cms-centrereed.firebasestorage.app",
  messagingSenderId: "198377329115",
  appId: "1:198377329115:web:c8fec22a2b6c37a6ea57fe",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

