import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isPlaceholderConfig } from '../firebase/config';
import type { StoreSettings } from '../types';

export const DEFAULT_SETTINGS: StoreSettings = {
  brandName: import.meta.env.VITE_BRAND_NAME || '90s chya athavani Jewellery',
  logoUrl: '',
  faviconUrl: '',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210',
  contactNumber: '+91 98765 43210',
  email: import.meta.env.VITE_SUPPORT_EMAIL || 'orders@90schyaathavanijewellery.com',
  defaultShippingCharge: Number(import.meta.env.VITE_DEFAULT_SHIPPING_FEE) || 50,
  freeShippingThreshold: Number(import.meta.env.VITE_FREE_SHIPPING_THRESHOLD) || 999,
  deliveryInfo: 'Standard insured delivery within 3-5 business days across India via BlueDart / Delhivery / XpressBees.',
  defaultWhatsAppMessage: 'Hi 90s chya athavani Jewellery, I would like to order [PRODUCT_NAME] (₹[PRICE]). Product link: [PRODUCT_URL]',
  orderConfirmationMessage: '🎉 Order Confirmed! Hello [CUSTOMER_NAME], your order #[ORDER_NUMBER] for [PRODUCT_NAME] (₹[TOTAL]) has been placed successfully.',
  shippingPolicy: 'We provide express door-to-door delivery across India. Orders are dispatched within 24 hours of confirmation. All shipments are insured against transit damage.',
  returnPolicy: 'We offer an easy 7-day replacement guarantee if the product arrives damaged or defective. A parcel opening video is required for damage claims.',
  privacyPolicy: 'We respect your privacy. Customer contact and shipping information is used solely for order processing and direct WhatsApp updates.',
  termsConditions: 'By placing an order on our platform, you agree to our standard terms of sale, delivery guidelines, and warranty terms.'
};

const LOCAL_STORAGE_KEY = 'kj_store_settings';

export async function getStoreSettings(): Promise<StoreSettings> {
  const local = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (local) {
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(local) };
    } catch {
      // ignore
    }
  }

  if (!isPlaceholderConfig) {
    try {
      const docRef = doc(db, 'settings', 'store_settings');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as StoreSettings;
        const merged = { ...DEFAULT_SETTINGS, ...data };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
    } catch (err) {
      console.warn('Firestore settings fetch warning:', err);
    }
  }

  return DEFAULT_SETTINGS;
}

export async function updateStoreSettings(newSettings: Partial<StoreSettings>): Promise<StoreSettings> {
  const current = await getStoreSettings();
  const updated: StoreSettings = { ...current, ...newSettings };

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

  if (!isPlaceholderConfig) {
    try {
      const docRef = doc(db, 'settings', 'store_settings');
      await setDoc(docRef, updated, { merge: true });
    } catch (err) {
      console.error('Failed to save settings to Firestore:', err);
    }
  }

  return updated;
}
