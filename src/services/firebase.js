import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBRXq4lSAgpOJGa5UudfkzbETYIZhNbbi0",
    authDomain: "stock-trade-f1133.firebaseapp.com",
    projectId: "stock-trade-f1133",
    storageBucket: "stock-trade-f1133.firebasestorage.app",
    messagingSenderId: "719359623621",
    appId: "1:719359623621:web:a384a0d29abfb0188f4bac",
    measurementId: "G-GZJ5TR0GKH"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);