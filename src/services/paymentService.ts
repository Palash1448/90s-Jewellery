import { httpsCallable } from 'firebase/functions';
import { functions, isPlaceholderConfig } from '../firebase/config';
import type { Order, Product, Address, PaymentInitiationResult, PaymentVerificationResult } from '../types';
import { createPendingOrder, confirmOrderPayment, markOrderPaymentFailed } from './orderService';

export interface PaymentGatewayOptions {
  provider?: 'razorpay' | 'cashfree' | 'phonepe' | 'simulator';
  method?: 'upi' | 'card' | 'netbanking' | 'cod_advance';
}

/**
 * 1. Initialize Payment
 * Prepares the order and payment transaction payload
 */
export async function createPayment(params: {
  product: Product;
  quantity: number;
  customer: {
    name: string;
    mobile: string;
    whatsapp: string;
    email: string;
  };
  address: Address;
  options?: PaymentGatewayOptions;
}): Promise<PaymentInitiationResult> {
  const { product, quantity, customer, address } = params;

  // Step A: In production Firebase mode with Cloud Functions enabled:
  if (!isPlaceholderConfig) {
    try {
      const createPaymentIntentFn = httpsCallable<any, PaymentInitiationResult>(functions, 'createPaymentIntent');
      const res = await createPaymentIntentFn({
        productId: product.id,
        quantity,
        customerInfo: customer,
        addressInfo: address,
      });
      if (res.data && res.data.success) {
        return res.data;
      }
    } catch (err) {
      console.warn('Cloud Functions payment creation skipped/fallback to direct service:', err);
    }
  }

  // Step B: Create pending order in database
  const order = await createPendingOrder({
    product,
    quantity,
    customer,
    address,
  });

  return {
    success: true,
    orderId: order.id,
    orderNumber: order.orderNumber,
    amount: order.total,
    currency: 'INR',
    gatewayOrderId: `PAY_GW_${order.id}_${Date.now()}`,
  };
}

/**
 * 2. Server-side / Cloud Function Payment Verification
 */
export async function verifyPayment(params: {
  orderId: string;
  paymentTransactionId: string;
  signature?: string;
  simulatedSuccess?: boolean;
}): Promise<PaymentVerificationResult> {
  const { orderId, paymentTransactionId, simulatedSuccess = true } = params;

  if (!orderId) {
    return {
      success: false,
      orderId: '',
      orderNumber: '',
      transactionId: '',
      status: 'failed',
      message: 'Invalid order reference.',
    };
  }

  // If live Cloud Function exists, invoke it
  if (!isPlaceholderConfig) {
    try {
      const verifyPaymentFn = httpsCallable<any, any>(functions, 'verifyPayment');
      const response = await verifyPaymentFn({
        orderId,
        paymentTransactionId,
        paymentStatus: simulatedSuccess ? 'paid' : 'failed',
      });
      if (response.data && response.data.success) {
        return {
          success: true,
          orderId,
          orderNumber: response.data.data.orderNumber,
          transactionId: paymentTransactionId,
          status: 'paid',
        };
      }
    } catch (err) {
      console.warn('Cloud function verification fallback to client verified transaction:', err);
    }
  }

  // Local verification handler
  if (simulatedSuccess) {
    const updatedOrder = await confirmOrderPayment(orderId, paymentTransactionId);
    return {
      success: true,
      orderId: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      transactionId: paymentTransactionId,
      status: 'paid',
    };
  } else {
    await markOrderPaymentFailed(orderId, 'User cancelled or gateway timeout');
    return {
      success: false,
      orderId,
      orderNumber: '',
      transactionId: paymentTransactionId,
      status: 'failed',
      message: 'Payment verification failed or was cancelled.',
    };
  }
}

/**
 * 3. Handle Payment Success
 */
export async function handlePaymentSuccess(
  orderId: string,
  transactionId: string
): Promise<Order> {
  return await confirmOrderPayment(orderId, transactionId);
}

/**
 * 4. Handle Payment Failure
 */
export async function handlePaymentFailure(
  orderId: string,
  reason?: string
): Promise<Order> {
  return await markOrderPaymentFailed(orderId, reason);
}
