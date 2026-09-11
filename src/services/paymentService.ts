import type { Order, Product, Address, PaymentVerificationResult } from '../types';
import { createPendingOrder, confirmOrderPayment, markOrderPaymentFailed, saveRazorpayOrderId } from './orderService';

// Razorpay Live Key ID (Safe on frontend)
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TaKGbG6vDu7a0e';

// PHP Backend Base URL
export const RAZORPAY_API_URL = (import.meta.env.VITE_RAZORPAY_API_URL || '/razorpay-api').replace(/\/+$/, '');

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayCheckoutOptions {
  key?: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
    backdrop_color?: string;
  };
  modal?: {
    confirm_close?: boolean;
    ondismiss?: () => void;
    animation?: boolean;
  };
  handler?: (response: RazorpaySuccessResponse) => void;
}

/**
 * 1. Dynamically Load Razorpay Checkout.js Script
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK checkout.js script.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

/**
 * 2. Create Razorpay Order via PHP Backend (/create_order.php)
 */
export async function createRazorpayOrderViaPHP(params: {
  firebaseOrderId: string;
  amount: number;
  currency?: string;
  notes?: Record<string, any>;
}): Promise<{
  success: boolean;
  razorpayOrderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  error?: string;
}> {
  const { firebaseOrderId, amount, currency = 'INR', notes = {} } = params;

  try {
    const response = await fetch(`${RAZORPAY_API_URL}/create_order.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        firebaseOrderId,
        amount,
        currency,
        notes,
      }),
    });

    const responseText = await response.text();
    let data: any = {};
    try {
      data = JSON.parse(responseText);
    } catch {
      if (response.status === 405) {
        throw new Error(
          'API Endpoint returned 405 (Method Not Allowed). If running locally, please restart `npm run dev` to enable the Razorpay dev server middleware.'
        );
      }
      throw new Error(`Server returned unexpected response (status ${response.status}): ${responseText.substring(0, 120) || 'Empty body'}`);
    }

    if (!response.ok || !data.success) {
      throw new Error(data.error || `Order creation failed with status ${response.status}`);
    }

    // Save Razorpay order ID to Firebase for tracking
    if (data.razorpayOrderId) {
      await saveRazorpayOrderId(firebaseOrderId, data.razorpayOrderId);
    }

    return {
      success: true,
      razorpayOrderId: data.razorpayOrderId,
      amount: data.amount,
      currency: data.currency || currency,
      keyId: data.keyId || RAZORPAY_KEY_ID,
    };
  } catch (error: any) {
    console.error('createRazorpayOrderViaPHP error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create Razorpay order on server.',
    };
  }
}

/**
 * 3. Verify Payment Signature via PHP Backend (/verify_payment.php)
 */
export async function verifyRazorpayPaymentViaPHP(params: {
  firebaseOrderId: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}): Promise<PaymentVerificationResult> {
  const { firebaseOrderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = params;

  try {
    const response = await fetch(`${RAZORPAY_API_URL}/verify_payment.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        firebaseOrderId,
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      }),
    });

    const responseText = await response.text();
    let data: any = {};
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(`Server returned non-JSON response (status ${response.status}): ${responseText.substring(0, 120) || 'Empty body'}`);
    }

    if (!response.ok || !data.success || !data.verified) {
      throw new Error(data.error || 'Payment signature verification failed.');
    }

    // Update Firebase Order to PAID & CONFIRMED
    const updatedOrder = await confirmOrderPayment(firebaseOrderId, razorpay_payment_id, {
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    return {
      success: true,
      orderId: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      transactionId: razorpay_payment_id,
      status: 'paid',
      message: 'Payment verified and order confirmed successfully.',
    };
  } catch (error: any) {
    console.error('verifyRazorpayPaymentViaPHP error:', error);
    await markOrderPaymentFailed(firebaseOrderId, error.message || 'Verification failure');

    return {
      success: false,
      orderId: firebaseOrderId,
      orderNumber: '',
      transactionId: razorpay_payment_id,
      status: 'failed',
      message: error.message || 'Payment signature verification failed.',
    };
  }
}

/**
 * 4. Open Razorpay Checkout Window
 */
export async function openRazorpayCheckoutModal(options: {
  razorpayOrderId: string;
  amount: number;
  currency?: string;
  order: Order;
  brandName?: string;
  onSuccess: (response: RazorpaySuccessResponse) => void;
  onDismiss: () => void;
  onFailure: (errorReason: string) => void;
}): Promise<void> {
  const { razorpayOrderId, amount, currency = 'INR', order, brandName, onSuccess, onDismiss, onFailure } = options;

  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded || !(window as any).Razorpay) {
    throw new Error('Razorpay SDK could not be loaded. Please check your internet connection.');
  }

  const cleanMobile = order.customerSnapshot.mobile.replace(/[^0-9]/g, '');

  const checkoutConfig: RazorpayCheckoutOptions = {
    key: RAZORPAY_KEY_ID,
    amount: Math.round(amount * 100), // amount in paise
    currency: currency,
    name: brandName || '90s chya athavani Jewellery',
    description: `Order #${order.orderNumber} - ${order.productName}`,
    image: order.productImage || 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=300&q=80',
    order_id: razorpayOrderId,
    prefill: {
      name: order.customerSnapshot.name,
      email: order.customerSnapshot.email || '',
      contact: cleanMobile.length === 10 ? `+91${cleanMobile}` : cleanMobile,
    },
    notes: {
      firebaseOrderId: order.id,
      orderNumber: order.orderNumber,
      productId: order.productId,
      quantity: String(order.quantity),
    },
    theme: {
      color: '#BA9541',
      backdrop_color: 'rgba(0, 0, 0, 0.75)',
    },
    modal: {
      confirm_close: true,
      ondismiss: () => {
        onDismiss();
      },
      animation: true,
    },
    handler: (response: RazorpaySuccessResponse) => {
      onSuccess(response);
    },
  };

  const razorpayInstance = new (window as any).Razorpay(checkoutConfig);

  razorpayInstance.on('payment.failed', (response: any) => {
    console.warn('Razorpay payment.failed event:', response);
    const reason = response?.error?.description || response?.error?.reason || 'Payment was declined by bank or user cancelled.';
    onFailure(reason);
  });

  razorpayInstance.open();
}

