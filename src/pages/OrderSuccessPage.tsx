import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  Truck,
  MessageCircle,
  ShoppingBag,
  Clock,
  ShieldCheck,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { Badge } from '../components/common/Badge';
import { SeoMeta } from '../components/common/SeoMeta';
import { getOrderById } from '../services/orderService';
import { getOrderWhatsAppLink } from '../services/whatsappService';
import type { Order } from '../types';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [waLink, setWaLink] = useState('#');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fire festive celebratory confetti blast!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#BA9541', '#8C2D3B', '#133E31', '#F5ECDA'],
    });

    if (orderId) {
      getOrderById(orderId).then((data) => {
        setOrder(data);
        setLoading(false);
        if (data) {
          getOrderWhatsAppLink(data).then(setWaLink);
        }
      });
    }
  }, [orderId]);

  const copyOrderNumber = () => {
    if (order?.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-[#BA9541]/30 border-t-[#BA9541] rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium text-[#73685C]">Loading your order confirmation...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4 text-center">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-[#E8E2D8] shadow-md space-y-3">
            <h2 className="font-display font-bold text-2xl text-[#1E1A17]">Order Details Unavailable</h2>
            <p className="text-xs text-[#73685C]">We could not locate this order reference.</p>
            <Link to="/" className="inline-block bg-[#1E1A17] text-white px-5 py-2.5 rounded-xl text-xs font-bold">
              Return to Store
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <SeoMeta title={`Order Confirmed #${order.orderNumber} | 90s chya athavani Jewellery`} />
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DCBE] shadow-xl text-center space-y-6">
          {/* Confirmed Icon */}
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-300 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-700 tracking-widest uppercase block mb-1">
              Payment Verified & Confirmed
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#1E1A17]">
              🎉 Order Confirmed!
            </h1>
            <p className="text-sm text-[#73685C] max-w-md mx-auto mt-2 leading-relaxed">
              Thank you for your order, <strong>{order.customerSnapshot?.name}</strong>! We are carefully packaging your jewellery in our signature velvet keepsake box.
            </p>
          </div>

          {/* Order Number Banner */}
          <div className="bg-[#FAF6EE] border border-[#E5D7BD] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div>
              <span className="text-[11px] font-bold text-[#8A7D6E] uppercase tracking-wider block">
                Order Tracking Number:
              </span>
              <span className="font-mono font-bold text-base sm:text-lg text-[#1E1A17]">
                {order.orderNumber}
              </span>
            </div>

            <button
              onClick={copyOrderNumber}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white border border-[#D9CFBE] hover:bg-[#F2ECE1] rounded-lg text-[#1E1A17] transition-all shadow-2xs"
            >
              <Copy className="w-3.5 h-3.5 text-[#BA9541]" />
              <span>{copied ? '✓ Copied' : 'Copy Order #'}</span>
            </button>
          </div>

          {/* Product & Receipt Snapshot */}
          <div className="rounded-2xl border border-[#E8E2D8] p-5 text-left space-y-4">
            <h3 className="font-display font-bold text-sm text-[#1E1A17] pb-2 border-b border-[#EFE9DF] uppercase tracking-wider">
              Order Summary
            </h3>

            <div className="flex items-center gap-4">
              <img
                src={order.productImage}
                alt={order.productName}
                className="w-20 h-20 rounded-xl object-cover border border-[#E0D8C8] bg-white shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-[#1E1A17]">{order.productName}</h4>
                <p className="text-xs text-[#7A6F62] mt-0.5">Quantity: {order.quantity}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge status={order.paymentStatus} type="payment" />
                  <Badge status={order.orderStatus} type="order" />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EFE9DF] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[#8C8072] block">Customer:</span>
                <strong className="text-[#1E1A17]">{order.customerSnapshot?.name}</strong>
              </div>
              <div>
                <span className="text-[#8C8072] block">Delivery City:</span>
                <strong className="text-[#1E1A17]">{order.addressSnapshot?.city}, {order.addressSnapshot?.pincode}</strong>
              </div>
              <div>
                <span className="text-[#8C8072] block">Total Paid:</span>
                <strong className="text-[#1E1A17] font-bold text-emerald-800">₹{order.total.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span className="text-[#8C8072] block">Transaction ID:</span>
                <span className="font-mono text-[10px] text-[#73685C] truncate block">{order.paymentTransactionId || 'TXN_VERIFIED'}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20be5a] text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Chat on WhatsApp</span>
            </a>

            <Link
              to="/"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1E1A17] hover:bg-black text-white px-7 py-3.5 rounded-xl font-display font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <span>Continue Shopping</span>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-[#73685C] pt-2">
            <Truck className="w-4 h-4 text-[#BA9541]" />
            <span>Our automated WhatsApp concierge will send shipping updates to {order.customerSnapshot?.whatsapp || order.customerSnapshot?.mobile}.</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
