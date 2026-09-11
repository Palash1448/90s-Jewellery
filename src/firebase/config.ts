import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Firebase configuration for fir-jewl
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCeNf4EwkkUqZEZXCUBsjo4lV1z8ABypfU',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'fir-jewl.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'fir-jewl',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'fir-jewl.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '730072904679',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:730072904679:web:b951396523022462a34342'
};

// Check if using placeholder demo credentials
export const isPlaceholderConfig = !firebaseConfig.apiKey || 
  firebaseConfig.apiKey.includes('Placeholder') || 
  firebaseConfig.apiKey === 'YOUR_API_KEY' ||
  firebaseConfig.apiKey.includes('DemoPlaceholder');

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;
