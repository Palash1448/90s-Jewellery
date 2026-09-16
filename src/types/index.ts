export type ProductStatus = 'active' | 'inactive' | 'out_of_stock';

export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';

export type OrderStatus = 'new' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  price: number;
  mrp: number;
  discountPercentage: number;
  images: string[];
  primaryImage: string;
  category: string;
  material: string;
  finish: string;
  color: string;
  size: string;
  weight: string;
  occasion: string;
  packageContents: string;
  careInstructions: string;
  stock: number;
  shippingCharge: number;
  status: ProductStatus;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string | number | any;
  updatedAt: string | number | any;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  whatsapp: string;
  email: string;
  createdAt: string | number | any;
  updatedAt: string | number | any;
  // Computed aggregations for admin dashboard
  totalOrders?: number;
  totalSpent?: number;
  lastOrderDate?: string;
}

export interface Address {
  id?: string;
  customerId?: string;
  addressLine: string;
  area: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  createdAt?: string | number | any;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  mrp: number;
  discount: number;
  shipping: number;
  codCharge?: number;
  subtotal: number;
  total: number;
  customerSnapshot: {
    name: string;
    mobile: string;
    whatsapp: string;
    email: string;
  };
  addressSnapshot: Address;
  paymentMethod?: 'ONLINE' | 'COD' | string;
  paymentStatus: PaymentStatus;
  paymentVerified?: boolean;
  paymentTransactionId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  orderStatus: OrderStatus;
  paidAt?: string | number | any;
  createdAt: string | number | any;
  updatedAt: string | number | any;
}

export interface StoreSettings {
  brandName: string;
  logoUrl: string;
  faviconUrl: string;
  whatsappNumber: string;
  contactNumber: string;
  email: string;
  defaultShippingCharge: number;
  defaultCodCharge?: number;
  freeShippingThreshold: number;
  deliveryInfo: string;
  defaultWhatsAppMessage: string;
  orderConfirmationMessage: string;
  shippingPolicy: string;
  returnPolicy: string;
  privacyPolicy: string;
  termsConditions: string;
}

export interface PaymentInitiationResult {
  success: boolean;
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  gatewayOrderId?: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  orderId: string;
  orderNumber: string;
  transactionId: string;
  status: PaymentStatus;
  message?: string;
}
