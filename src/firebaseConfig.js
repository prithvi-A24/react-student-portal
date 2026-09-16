import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA1dv-eBUeaMwXU_MjiPL3GsZuFT-HrpqM",
  authDomain: "fir-testing-508806.firebaseapp.com",
  projectId: "firebase-testing-508806",
  storageBucket: "firebase-testing-508806.firebasestorage.app",
  messagingSenderId: "815872975118",
  appId: "1:815872975118:web:df6f04dd1d78f37757775f",
  measurementId: "G-WKEGS862ZK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };
