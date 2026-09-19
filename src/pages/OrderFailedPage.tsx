import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { XCircle, RefreshCw, MessageCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { SeoMeta } from '../components/common/SeoMeta';
import { getOrderById } from '../services/orderService';
import type { Order } from '../types';

export const OrderFailedPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const reason = searchParams.get('reason') || 'Transaction declined or session timed out.';
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId).then(setOrder);
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <SeoMeta title="Payment Failed | 90s chya athavani Jewellery" />
      <Header />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-rose-200 shadow-xl text-center space-y-6 w-full">
          {/* Failure icon */}
          <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-600 border-2 border-rose-200 flex items-center justify-center mx-auto shadow-inner">
            <XCircle className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-rose-600 tracking-widest uppercase block mb-1">
              Payment Incomplete
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#1E1A17]">
              Payment Failed
            </h1>
            <p className="text-sm text-[#73685C] max-w-md mx-auto mt-2 leading-relaxed">
              Your order has not been confirmed. No money has been deducted, or if debited, your bank will automatically reverse the transaction within 24-48 hours.
            </p>
          </div>

          {/* Reason Alert */}
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-left text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-rose-800">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Decline Reason:</span>
            </div>
            <p className="text-rose-700 font-mono text-[11px]">{reason}</p>
            {order && (
              <p className="text-rose-900 font-semibold pt-1">
                Order Ref: {order.orderNumber} (Pending)
              </p>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {order ? (
              <Link
                to={`/checkout/${order.productId}?qty=${order.quantity}`}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1E1A17] hover:bg-black text-white px-7 py-3.5 rounded-xl font-display font-bold text-sm shadow-md transition-all active:scale-95"
              >
                <RefreshCw className="w-4 h-4 text-[#D4AF37]" />
                <span>Try Payment Again</span>
              </Link>
            ) : (
              <Link
                to="/"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1E1A17] hover:bg-black text-white px-7 py-3.5 rounded-xl font-display font-bold text-sm shadow-md transition-all active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Catalogue</span>
              </Link>
            )}

            <a
              href={`https://wa.me/917507629997?text=Hi%2090s%20chya%20athavani%20Jewellery,%20my%20payment%20failed%20for%20order%20${order?.orderNumber || 'reference'}.%20Please%20help.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20be5a] text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Contact Us on WhatsApp</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
