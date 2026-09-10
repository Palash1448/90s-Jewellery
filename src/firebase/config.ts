import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoPlaceholderKeyForLocalTesting',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'athavani-jewels-demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'athavani-jewels-demo',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'athavani-jewels-demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '102938475610',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:102938475610:web:abcdef1234567890'
};

// Check if using placeholder demo credentials
export const isPlaceholderConfig = !import.meta.env.VITE_FIREBASE_API_KEY || 
  import.meta.env.VITE_FIREBASE_API_KEY.includes('Placeholder') || 
  import.meta.env.VITE_FIREBASE_API_KEY === 'YOUR_API_KEY';

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;
