import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { auth, isPlaceholderConfig } from './config';

const LOCAL_ADMIN_KEY = 'kj_admin_mock_session';

export interface AdminUser {
  uid: string;
  email: string | null;
  role: 'admin';
  displayName?: string | null;
}

/**
 * Format Firebase Auth errors into clear, actionable messages
 */
export function getFirebaseAuthErrorMessage(error: any): string {
  const code = error?.code || '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Incorrect email or password. Please verify your admin credentials.';
    case 'auth/user-not-found':
      return 'No admin account found with this email. You can create an admin account using the "Register Admin" tab.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled in Firebase Console. Please enable it under Authentication > Sign-in method.';
    case 'auth/too-many-requests':
      return 'Access temporarily blocked due to many failed attempts. Please try again later or reset password.';
    case 'auth/network-request-failed':
      return 'Network error occurred. Please check your internet connection.';
    default:
      return error?.message || 'Authentication failed. Please try again.';
  }
}

/**
 * Sign in admin with Email & Password via Firebase Auth
 */
export async function loginAdmin(email: string, password: string): Promise<AdminUser> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const adminUser: AdminUser = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      role: 'admin',
      displayName: userCredential.user.displayName || 'Store Admin',
    };
    localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(adminUser));
    return adminUser;
  } catch (error: any) {
    // If Firebase Auth returns error, handle mock demo fallback if applicable
    if (
      (email.toLowerCase() === 'admin@90schyaathavanijewellery.com' || email.toLowerCase() === 'admin@demo.com') &&
      password === 'admin123' &&
      isPlaceholderConfig
    ) {
      const mockUser: AdminUser = {
        uid: 'admin-demo-1001',
        email: email,
        role: 'admin',
        displayName: '90s chya athavani Admin',
      };
      localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(mockUser));
      return mockUser;
    }
    throw error;
  }
}

/**
 * Register / Create a new Admin account via Firebase Auth
 */
export async function registerAdmin(
  email: string,
  password: string,
  displayName: string = 'Store Admin'
): Promise<AdminUser> {
  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  
  if (displayName && userCredential.user) {
    try {
      await updateProfile(userCredential.user, { displayName });
    } catch {
      // ignore non-fatal profile name update error
    }
  }

  const adminUser: AdminUser = {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    role: 'admin',
    displayName: displayName || userCredential.user.displayName,
  };

  localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(adminUser));
  return adminUser;
}

/**
 * Logout admin from Firebase Auth
 */
export async function logoutAdmin(): Promise<void> {
  localStorage.removeItem(LOCAL_ADMIN_KEY);
  try {
    await fbSignOut(auth);
  } catch (error) {
    console.error('Logout error', error);
  }
}

/**
 * Send password reset email via Firebase Auth
 */
export async function sendAdminPasswordReset(email: string): Promise<boolean> {
  await fbSendPasswordResetEmail(auth, email.trim());
  return true;
}

/**
 * Auth state listener with Firebase Auth
 */
export function subscribeToAuthChanges(callback: (user: AdminUser | null) => void) {
  return onAuthStateChanged(auth, (fbUser: User | null) => {
    if (fbUser) {
      const adminUser: AdminUser = {
        uid: fbUser.uid,
        email: fbUser.email,
        role: 'admin',
        displayName: fbUser.displayName || 'Store Admin',
      };
      localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(adminUser));
      callback(adminUser);
    } else {
      const currentLocal = localStorage.getItem(LOCAL_ADMIN_KEY);
      if (currentLocal && isPlaceholderConfig) {
        try {
          callback(JSON.parse(currentLocal));
          return;
        } catch {
          // ignore
        }
      }
      callback(null);
    }
  });
}

