import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Lock, ShoppingBag, ChevronDown } from 'lucide-react';
import { useProduct } from '../hooks/useProduct';
import { Footer } from '../components/common/Footer';
import { CustomerForm, type CustomerFormData } from '../components/checkout/CustomerForm';
import { AddressForm } from '../components/checkout/AddressForm';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { PaymentModal } from '../components/checkout/PaymentModal';
import { SeoMeta } from '../components/common/SeoMeta';
import { createPayment, verifyPayment } from '../services/paymentService';
import type { Address, Order } from '../types';

export const CheckoutPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const quantity = Math.max(1, parseInt(searchParams.get('qty') || '1', 10));

  const { product, loading } = useProduct(slug);

  // Form State
  const [customerData, setCustomerData] = useState<CustomerFormData>({
    name: '',
    mobile: '',
    whatsapp: '',
    email: '',
    isWhatsAppSame: true,
  });

  const [addressData, setAddressData] = useState<Address>({
    addressLine: '',
    area: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  // Validation
  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!customerData.name.trim()) {
      errs.name = 'Full name is required.';
    }

    if (!customerData.mobile.trim()) {
      errs.mobile = 'Mobile number is required.';
    } else if (customerData.mobile.replace(/[^0-9]/g, '').length !== 10) {
      errs.mobile = 'Mobile number must be exactly 10 digits.';
    }

    if (!customerData.isWhatsAppSame) {
      if (!customerData.whatsapp.trim()) {
        errs.whatsapp = 'WhatsApp number is required.';
      } else if (customerData.whatsapp.replace(/[^0-9]/g, '').length !== 10) {
        errs.whatsapp = 'WhatsApp number must be exactly 10 digits.';
      }
    }

    if (customerData.email.trim() && !/^\S+@\S+\.\S+$/.test(customerData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!addressData.addressLine.trim()) {
      errs.addressLine = 'Flat / House No. / Building is required.';
    }

    if (!addressData.area.trim()) {
      errs.area = 'Area / Street is required.';
    }

    if (!addressData.city.trim()) {
      errs.city = 'City is required.';
    }

    if (!addressData.state.trim()) {
      errs.state = 'Please select your state.';
    }

    if (!addressData.pincode.trim()) {
      errs.pincode = 'Pincode is required.';
    } else if (addressData.pincode.replace(/[^0-9]/g, '').length !== 6) {
      errs.pincode = 'Pincode must be exactly 6 digits.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToPayment = async () => {
    if (!validate()) {
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    if (!product) return;

    setIsSubmitting(true);

    try {
      // 1. Initialize Order in pending state
      const res = await createPayment({
        product,
        quantity,
        customer: {
          name: customerData.name,
          mobile: customerData.mobile,
          whatsapp: customerData.isWhatsAppSame ? customerData.mobile : customerData.whatsapp,
          email: customerData.email,
        },
        address: addressData,
      });

      if (res && res.success) {
        // Construct pending order snapshot for payment modal
        const unitPrice = product.price;
        const mrp = product.mrp || product.price;
        const discount = Math.max(0, mrp - unitPrice) * quantity;
        const subtotal = unitPrice * quantity;
        const shipping = subtotal >= 999 ? 0 : (product.shippingCharge || 50);
        const total = subtotal + shipping;

        const orderObj: Order = {
          id: res.orderId,
          orderNumber: res.orderNumber,
          customerId: `cust_${customerData.mobile}`,
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
            name: customerData.name,
            mobile: customerData.mobile,
            whatsapp: customerData.isWhatsAppSame ? customerData.mobile : customerData.whatsapp,
            email: customerData.email,
          },
          addressSnapshot: addressData,
          paymentStatus: 'pending',
          paymentTransactionId: '',
          orderStatus: 'new',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setPendingOrder(orderObj);
        setIsPaymentModalOpen(true);
      }
    } catch (err: any) {
      alert(`Error initializing order: ${err.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (transactionId: string) => {
    if (!pendingOrder) return;

    try {
      const verification = await verifyPayment({
        orderId: pendingOrder.id,
        paymentTransactionId: transactionId,
        simulatedSuccess: true,
      });

      if (verification.success) {
        setIsPaymentModalOpen(false);
        navigate(`/order-success/${pendingOrder.id}`);
      } else {
        setIsPaymentModalOpen(false);
        navigate(`/order-failed?orderId=${pendingOrder.id}&reason=${encodeURIComponent(verification.message || 'Payment Verification Failed')}`);
      }
    } catch (err: any) {
      console.error('Payment confirmation error:', err);
      navigate(`/order-failed?orderId=${pendingOrder.id}&reason=PaymentProcessingError`);
    }
  };

  const handlePaymentFailure = async (reason: string) => {
    if (!pendingOrder) return;

    await verifyPayment({
      orderId: pendingOrder.id,
      paymentTransactionId: `FAIL_${Date.now()}`,
      simulatedSuccess: false,
    });

    setIsPaymentModalOpen(false);
    navigate(`/order-failed?orderId=${pendingOrder.id}&reason=${encodeURIComponent(reason)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-[#BA9541]/30 border-t-[#BA9541] rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium text-[#73685C]">Preparing secure checkout...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="font-display font-bold text-2xl mb-2">Product Not Found</h2>
        <Link to="/" className="text-[#BA9541] underline font-bold text-sm">
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const unitPrice = product.price;
  const subtotal = unitPrice * quantity;
  const shippingFee = subtotal >= 999 ? 0 : (product.shippingCharge || 50);
  const totalAmount = subtotal + shippingFee;

  const brandName = import.meta.env.VITE_BRAND_NAME || '90s chya athavani Jewellery';

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <SeoMeta title={`Checkout — ${product.name} | ${brandName}`} />

      {/* Simplified High-Trust Checkout Header */}
      <header className="bg-[#FAF8F5]/98 backdrop-blur-md border-b border-[#E8E2D8] py-3.5 px-3 sm:px-6 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <Link to={`/p/${product.slug}`} className="flex items-center gap-1 text-xs font-bold text-[#73685C] hover:text-[#1E1A17] shrink-0">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>

          <div className="flex items-center gap-2 text-center truncate">
            <span className="font-display font-bold text-sm sm:text-lg text-[#1E1A17] tracking-wider truncate uppercase">
              {brandName}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">256-Bit SSL Encrypted</span>
            <span className="sm:hidden">Secure</span>
          </div>
        </div>
      </header>

      {/* Mobile Sticky Top Order Dropdown */}
      <div className="lg:hidden bg-[#FAF3E0] border-b border-[#E6D7BA] px-4 py-2.5">
        <button
          onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
          className="w-full flex items-center justify-between text-xs font-semibold text-[#694D18]"
        >
          <span className="flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-[#BA9541]" />
            <span>{mobileSummaryOpen ? 'Hide' : 'Show'} Order Details ({quantity} item)</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileSummaryOpen ? 'rotate-180' : ''}`} />
          </span>
          <span className="font-bold text-sm text-[#1E1A17]">₹{totalAmount.toLocaleString('en-IN')}</span>
        </button>

        {mobileSummaryOpen && (
          <div className="pt-3 pb-1 border-t border-[#E8DCBE] mt-2 space-y-2 text-xs text-[#524436] animate-in fade-in">
            <div className="flex items-center gap-3">
              <img
                src={product.primaryImage || product.images?.[0]}
                alt={product.name}
                className="w-12 h-12 rounded-lg object-cover bg-white border border-[#D9CFBE]"
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold truncate text-[#1E1A17]">{product.name}</p>
                <p className="text-[#8C8072]">Qty: {quantity} × ₹{product.price.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="flex justify-between pt-1">
              <span>Subtotal:</span>
              <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span className="font-semibold text-emerald-700">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
            </div>
          </div>
        )}
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 lg:px-8 py-5 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Columns: Forms */}
          <div className="lg:col-span-7 space-y-6">
            <CustomerForm
              data={customerData}
              onChange={setCustomerData}
              errors={errors}
            />

            <AddressForm
              data={addressData}
              onChange={setAddressData}
              errors={errors}
            />
          </div>

          {/* Right Columns: Summary */}
          <div className="lg:col-span-5">
            <OrderSummary
              product={product}
              quantity={quantity}
              isSubmitting={isSubmitting}
              onProceedToPayment={handleProceedToPayment}
            />
          </div>
        </div>
      </main>

      {/* Payment Gateway Modal Simulator */}
      {pendingOrder && (
        <PaymentModal
          order={pendingOrder}
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailure={handlePaymentFailure}
        />
      )}

      <Footer />
    </div>
  );
};
