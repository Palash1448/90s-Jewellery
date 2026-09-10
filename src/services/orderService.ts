import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import { db, isPlaceholderConfig } from '../firebase/config';
import type { Order, OrderStatus, PaymentStatus, Address, Product } from '../types';
import { updateProductStock, getProductById } from './productService';
import { upsertCustomer } from './customerService';

const LOCAL_ORDERS_KEY = 'kj_local_orders';

function getLocalOrders(): Order[] {
  const local = localStorage.getItem(LOCAL_ORDERS_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      // ignore
    }
  }
  return [];
}

function saveLocalOrders(orders: Order[]): void {
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
}

/**
 * Generate human-readable Indian order number (e.g., ORD-20260909-00125)
 */
export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `ORD-${year}${month}${day}-${randomSuffix}`;
}

/**
 * Create a new pending order before payment
 */
export async function createPendingOrder(params: {
  product: Product;
  quantity: number;
  customer: {
    name: string;
    mobile: string;
    whatsapp: string;
    email: string;
  };
  address: Address;
}): Promise<Order> {
  const { product, quantity, customer, address } = params;

  // 1. Ensure customer is recorded
  const customerRecord = await upsertCustomer(customer);

  // 2. Compute accurate financial values
  const unitPrice = product.price;
  const mrp = product.mrp || product.price;
  const discount = Math.max(0, mrp - unitPrice) * quantity;
  const subtotal = unitPrice * quantity;
  const shipping = subtotal >= 999 ? 0 : (product.shippingCharge || 0);
  const total = subtotal + shipping;

  const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const orderNumber = generateOrderNumber();

  const orderData: Order = {
    id: orderId,
    orderNumber,
    customerId: customerRecord.id,
    productId: product.id,
    productName: product.name,
    productImage: product.primaryImage || (product.images && product.images[0]) || '',
    quantity,
    unitPrice,
    mrp,
    discount,
    shipping,
    subtotal,
    total,
    customerSnapshot: {
      name: customer.name.trim(),
      mobile: customer.mobile.trim(),
      whatsapp: (customer.whatsapp || customer.mobile).trim(),
      email: (customer.email || '').trim(),
    },
    addressSnapshot: { ...address },
    paymentStatus: 'pending',
    paymentTransactionId: '',
    orderStatus: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Save to local cache
  const list = getLocalOrders();
  list.unshift(orderData);
  saveLocalOrders(list);

  // Save to Firestore
  if (!isPlaceholderConfig) {
    try {
      const docRef = doc(db, 'orders', orderId);
      await setDoc(docRef, {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Firestore createPendingOrder warning:', err);
    }
  }

  return orderData;
}

/**
 * Confirm order after successful server-side payment verification
 */
export async function confirmOrderPayment(
  orderId: string,
  transactionId: string
): Promise<Order> {
  const currentOrder = await getOrderById(orderId);
  if (!currentOrder) {
    throw new Error(`Order ${orderId} not found.`);
  }

  const updated: Order = {
    ...currentOrder,
    paymentStatus: 'paid',
    paymentTransactionId: transactionId,
    orderStatus: 'confirmed',
    updatedAt: new Date().toISOString(),
  };

  // 1. Update local cache
  const list = getLocalOrders();
  const idx = list.findIndex((o) => o.id === orderId);
  if (idx !== -1) {
    list[idx] = updated;
    saveLocalOrders(list);
  }

  // 2. Decrement product stock safely
  try {
    await updateProductStock(currentOrder.productId, currentOrder.quantity);
  } catch (err) {
    console.error('Stock deduction error:', err);
  }

  // 3. Update Firestore
  if (!isPlaceholderConfig) {
    try {
      const docRef = doc(db, 'orders', orderId);
      await updateDoc(docRef, {
        paymentStatus: 'paid',
        paymentTransactionId: transactionId,
        orderStatus: 'confirmed',
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Firestore confirmOrderPayment warning:', err);
    }
  }

  return updated;
}

/**
 * Mark order as payment failed
 */
export async function markOrderPaymentFailed(orderId: string, errorReason?: string): Promise<Order> {
  const currentOrder = await getOrderById(orderId);
  if (!currentOrder) throw new Error('Order not found');

  const updated: Order = {
    ...currentOrder,
    paymentStatus: 'failed',
    updatedAt: new Date().toISOString(),
  };

  const list = getLocalOrders();
  const idx = list.findIndex((o) => o.id === orderId);
  if (idx !== -1) {
    list[idx] = updated;
    saveLocalOrders(list);
  }

  if (!isPlaceholderConfig) {
    try {
      const docRef = doc(db, 'orders', orderId);
      await updateDoc(docRef, {
        paymentStatus: 'failed',
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Firestore markOrderPaymentFailed warning:', err);
    }
  }

  return updated;
}

/**
 * Fetch a single order by ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  if (!isPlaceholderConfig) {
    try {
      const docRef = doc(db, 'orders', orderId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Order;
      }
    } catch (err) {
      console.warn('Firestore getOrderById warning:', err);
    }
  }

  const list = getLocalOrders();
  return list.find((o) => o.id === orderId) || null;
}

/**
 * Fetch all orders for admin dashboard
 */
export async function getAllOrders(): Promise<Order[]> {
  let list: Order[] = [];

  if (!isPlaceholderConfig) {
    try {
      const colRef = collection(db, 'orders');
      const q = query(colRef, orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
      if (list.length > 0) {
        saveLocalOrders(list);
        return list;
      }
    } catch (err) {
      console.warn('Firestore getAllOrders warning:', err);
    }
  }

  return getLocalOrders();
}

/**
 * Update order tracking/fulfillment status (Admin)
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
  const current = await getOrderById(orderId);
  if (!current) throw new Error('Order not found.');

  const updated: Order = {
    ...current,
    orderStatus: status,
    updatedAt: new Date().toISOString(),
  };

  const list = getLocalOrders();
  const idx = list.findIndex((o) => o.id === orderId);
  if (idx !== -1) {
    list[idx] = updated;
    saveLocalOrders(list);
  }

  if (!isPlaceholderConfig) {
    try {
      const docRef = doc(db, 'orders', orderId);
      await updateDoc(docRef, {
        orderStatus: status,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Firestore updateOrderStatus error:', err);
    }
  }

  return updated;
}
