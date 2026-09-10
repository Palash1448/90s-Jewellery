import type { Product, Order } from '../types';
import { getStoreSettings } from './settingsService';

/**
 * Generate a clean, internationally formatted WhatsApp direct click-to-chat URL
 */
export function buildWhatsAppLink(phone: string, text: string): string {
  // Strip spaces, dashes, parentheses and plus sign
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Generate WhatsApp inquiry link for a specific product
 */
export async function getProductWhatsAppLink(product: Product): Promise<string> {
  const settings = await getStoreSettings();
  const phone = settings.whatsappNumber || import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';
  const baseUrl = window.location.origin;
  const productUrl = `${baseUrl}/p/${product.slug}`;

  const message = `Hi ${settings.brandName || '90s chya athavani Jewellery'}, I am interested in purchasing ${product.name}.

Price: ₹${product.price.toLocaleString('en-IN')}
SKU: ${product.sku || 'N/A'}

Product Link:
${productUrl}

Please share availability and payment details.`;

  return buildWhatsAppLink(phone, message);
}

/**
 * Generate WhatsApp confirmation / support inquiry link for an order
 */
export async function getOrderWhatsAppLink(order: Order): Promise<string> {
  const settings = await getStoreSettings();
  const phone = settings.whatsappNumber || import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';

  const message = `Hi ${settings.brandName || '90s chya athavani Jewellery'}, I have a question regarding my Order #${order.orderNumber}.

Product: ${order.productName}
Quantity: ${order.quantity}
Total Paid: ₹${order.total.toLocaleString('en-IN')}
Customer: ${order.customerSnapshot?.name} (${order.customerSnapshot?.mobile})
City: ${order.addressSnapshot?.city}

Kindly share the shipping & tracking update. Thank you!`;

  return buildWhatsAppLink(phone, message);
}

/**
 * Generate WhatsApp direct chat link for Admin to contact Customer
 */
export function getAdminToCustomerWhatsAppLink(customerPhone: string, orderNumber: string, customerName: string): string {
  const message = `Namaste ${customerName}, this is from 90s chya athavani Jewellery regarding your Order #${orderNumber}. We have dispatched your parcel.`;
  return buildWhatsAppLink(customerPhone, message);
}
