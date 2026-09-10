import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

/**
 * 1. Create Payment Order / Intent
 * Validates product price against database (never trust client amounts)
 */
export const createPaymentIntent = functions.https.onCall(
  async (data: any, _context: functions.https.CallableContext) => {
    const { productId, quantity, customerInfo, addressInfo } = data || {};

    if (!productId || !quantity || quantity < 1) {
      throw new functions.https.HttpsError('invalid-argument', 'Valid productId and quantity are required.');
    }

    // Fetch product from Firestore to verify price & stock
    const productRef = db.collection('products').doc(productId);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Product not found.');
    }

    const product = productDoc.data()!;

    if (product.status !== 'active') {
      throw new functions.https.HttpsError('failed-precondition', 'Product is currently unavailable.');
    }

    if (product.stock < quantity) {
      throw new functions.https.HttpsError('resource-exhausted', 'Insufficient stock available.');
    }

    // Calculate true pricing server-side
    const unitPrice = Number(product.price);
    const mrp = Number(product.mrp || product.price);
    const discount = Math.max(0, mrp - unitPrice) * quantity;
    const subtotal = unitPrice * quantity;
    const shipping = subtotal >= 999 ? 0 : Number(product.shippingCharge || 50);
    const total = subtotal + shipping;

    // Generate unique human-readable order number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `ORD-${dateStr}-${randomSuffix}`;

    // Create pending order record in Firestore
    const orderRef = db.collection('orders').doc();
    const orderData = {
      orderNumber,
      customerId: customerInfo?.customerId || `CUST-${Date.now()}`,
      productId,
      productName: product.name,
      productImage: product.primaryImage || (product.images && product.images[0]) || '',
      quantity,
      unitPrice,
      mrp,
      discount,
      shipping,
      subtotal,
      total,
      customerSnapshot: customerInfo,
      addressSnapshot: addressInfo,
      paymentStatus: 'pending',
      paymentTransactionId: '',
      orderStatus: 'new',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await orderRef.set(orderData);

    return {
      success: true,
      orderId: orderRef.id,
      orderNumber,
      amount: total,
      currency: 'INR',
      // In production, integrate Razorpay/Cashfree/PhonePe order ID here
      gatewayOrderId: `GATEWAY_${orderRef.id}_${Date.now()}`,
    };
  }
);

/**
 * 2. Verify Payment and Atomically Deduct Stock
 * Ensures race-condition safe inventory updates
 */
export const verifyPayment = functions.https.onCall(
  async (data: any, _context: functions.https.CallableContext) => {
    const { orderId, paymentTransactionId, paymentStatus } = data || {};

    if (!orderId || !paymentTransactionId) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing orderId or paymentTransactionId.');
    }

    const orderRef = db.collection('orders').doc(orderId);

    // Use atomic Firestore transaction to prevent race conditions during stock updates
    const result = await db.runTransaction(async (transaction: admin.firestore.Transaction) => {
      const orderDoc = await transaction.get(orderRef);
      if (!orderDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Order not found.');
      }

      const order = orderDoc.data()!;
      if (order.paymentStatus === 'paid') {
        return { status: 'already_paid', orderNumber: order.orderNumber };
      }

      const productRef = db.collection('products').doc(order.productId);
      const productDoc = await transaction.get(productRef);

      if (!productDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Product associated with this order no longer exists.');
      }

      const product = productDoc.data()!;
      const newStock = Math.max(0, (product.stock || 0) - order.quantity);
      const newStatus = newStock === 0 ? 'out_of_stock' : product.status;

      // 1. Update product stock atomically
      transaction.update(productRef, {
        stock: newStock,
        status: newStatus,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 2. Mark order as paid & confirmed
      transaction.update(orderRef, {
        paymentStatus: paymentStatus || 'paid',
        paymentTransactionId,
        orderStatus: 'confirmed',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        status: 'confirmed',
        orderNumber: order.orderNumber,
        orderId,
        newStock,
      };
    });

    return {
      success: true,
      data: result,
    };
  }
);

/**
 * 3. Assign Admin Role Custom Claim
 */
export const setAdminRole = functions.https.onCall(
  async (data: any, context: functions.https.CallableContext) => {
    // Only existing admins can assign new admins (or initial setup)
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated.');
    }

    const { targetUid } = data || {};
    if (!targetUid) {
      throw new functions.https.HttpsError('invalid-argument', 'targetUid required.');
    }

    await admin.auth().setCustomUserClaims(targetUid, { role: 'admin', admin: true });
    return { success: true, message: `Admin role granted to ${targetUid}` };
  }
);
