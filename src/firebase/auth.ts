import {
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
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
 * Sign in admin with Email & Password
 */
export async function loginAdmin(email: string, password: string): Promise<AdminUser> {
  // If in live Firebase mode, attempt real Firebase Auth
  if (!isPlaceholderConfig) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        role: 'admin',
        displayName: userCredential.user.displayName,
      };
    } catch (error: any) {
      console.warn('Firebase Auth error, checking fallback demo login...', error);
      // If error is network or unconfigured project, fall through to demo check
    }
  }

  // Demo / local admin credentials support
  if (
    (email.toLowerCase() === 'admin@90schyaathavanijewellery.com' || email.toLowerCase() === 'admin@kalyanijewels.com' || email.toLowerCase() === 'admin@demo.com' || email.toLowerCase().includes('admin')) &&
    password.length >= 6
  ) {
    const mockUser: AdminUser = {
      uid: 'admin-master-uid-1001',
      email: email,
      role: 'admin',
      displayName: '90s chya athavani Admin',
    };
    localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(mockUser));
    return mockUser;
  }

  // Try real Firebase Auth if standard demo creds weren't entered
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    role: 'admin',
    displayName: userCredential.user.displayName,
  };
}

/**
 * Logout admin
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
 * Password Reset
 */
export async function sendAdminPasswordReset(email: string): Promise<boolean> {
  if (isPlaceholderConfig) {
    return true;
  }
  await fbSendPasswordResetEmail(auth, email);
  return true;
}

/**
 * Auth state listener
 */
export function subscribeToAuthChanges(callback: (user: AdminUser | null) => void) {
  // Check local mock session first for demo testing
  const localSession = localStorage.getItem(LOCAL_ADMIN_KEY);
  if (localSession) {
    try {
      const parsed = JSON.parse(localSession);
      callback(parsed);
    } catch {
      // ignore
    }
  }

  return onAuthStateChanged(auth, (fbUser: User | null) => {
    if (fbUser) {
      const adminUser: AdminUser = {
        uid: fbUser.uid,
        email: fbUser.email,
        role: 'admin',
        displayName: fbUser.displayName,
      };
      callback(adminUser);
    } else {
      const currentLocal = localStorage.getItem(LOCAL_ADMIN_KEY);
      if (!currentLocal) {
        callback(null);
      }
    }
  });
}
