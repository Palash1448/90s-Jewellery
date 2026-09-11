import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db, isPlaceholderConfig } from '../firebase/config';
import type { Customer, Order } from '../types';
import { parseFirebaseDate, formatOrderDate } from '../utils/dateUtils';

const LOCAL_CUSTOMERS_KEY = 'kj_local_customers';

function getLocalCustomers(): Customer[] {
  const local = localStorage.getItem(LOCAL_CUSTOMERS_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      // ignore
    }
  }
  return [];
}

function saveLocalCustomers(customers: Customer[]): void {
  localStorage.setItem(LOCAL_CUSTOMERS_KEY, JSON.stringify(customers));
}

/**
 * Upsert customer record by mobile number
 */
export async function upsertCustomer(data: {
  name: string;
  mobile: string;
  whatsapp: string;
  email: string;
}): Promise<Customer> {
  const cleanMobile = data.mobile.replace(/[^0-9]/g, '');
  const existingCustomers = await getAllCustomers();
  const existing = existingCustomers.find((c) => c.mobile.replace(/[^0-9]/g, '') === cleanMobile);

  const customerId = existing ? existing.id : `cust_${cleanMobile}_${Date.now()}`;

  const customer: Customer = {
    id: customerId,
    name: data.name.trim(),
    mobile: data.mobile.trim(),
    whatsapp: (data.whatsapp || data.mobile).trim(),
    email: (data.email || '').trim().toLowerCase(),
    createdAt: existing ? existing.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 1. Save local
  const list = getLocalCustomers();
  const idx = list.findIndex((c) => c.id === customerId);
  if (idx !== -1) {
    list[idx] = customer;
  } else {
    list.unshift(customer);
  }
  saveLocalCustomers(list);

  // 2. Save to Firestore
  if (!isPlaceholderConfig) {
    try {
      const docRef = doc(db, 'customers', customerId);
      await setDoc(docRef, {
        ...customer,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore customer upsert warning:', err);
    }
  }

  return customer;
}

/**
 * Fetch all customers with aggregated metrics
 */
export async function getAllCustomers(ordersList?: Order[]): Promise<Customer[]> {
  let list: Customer[] = [];

  if (!isPlaceholderConfig) {
    try {
      const colRef = collection(db, 'customers');
      const snap = await getDocs(colRef);
      list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Customer));
      if (list.length > 0) {
        saveLocalCustomers(list);
      }
    } catch (err) {
      console.warn('Firestore customers fetch warning:', err);
    }
  }

  if (list.length === 0) {
    list = getLocalCustomers();
  }

  // If orders provided, aggregate stats
  if (ordersList && ordersList.length > 0) {
    return list.map((customer) => {
      const customerOrders = ordersList.filter(
        (o) =>
          o.customerId === customer.id ||
          o.customerSnapshot?.mobile?.replace(/[^0-9]/g, '') === customer.mobile?.replace(/[^0-9]/g, '')
      );
      const paidOrders = customerOrders.filter((o) => o.paymentStatus === 'paid');
      const totalSpent = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const lastOrder = customerOrders.sort(
        (a, b) => parseFirebaseDate(b.createdAt).getTime() - parseFirebaseDate(a.createdAt).getTime()
      )[0];

      return {
        ...customer,
        totalOrders: customerOrders.length,
        totalSpent,
        lastOrderDate: lastOrder ? formatOrderDate(lastOrder.createdAt) : undefined,
      };
    });
  }

  return list;
}
