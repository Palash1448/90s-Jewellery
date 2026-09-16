import React, { useState } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import type { OrderStatus, PaymentStatus } from '../../types';

interface InlineOrderStatusSelectProps {
  orderId: string;
  currentStatus: OrderStatus;
  onUpdate: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  size?: 'sm' | 'xs';
}

const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  new: { label: 'New', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  confirmed: { label: 'Confirmed', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  processing: { label: 'Processing', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  shipped: { label: 'Shipped', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  delivered: { label: 'Delivered', bg: 'bg-emerald-100', text: 'text-emerald-900', border: 'border-emerald-300' },
  cancelled: { label: 'Cancelled', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  returned: { label: 'Returned', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
};

export const InlineOrderStatusSelect: React.FC<InlineOrderStatusSelectProps> = ({
  orderId,
  currentStatus,
  onUpdate,
  size = 'xs',
}) => {
  const [loading, setLoading] = useState(false);
  const config = ORDER_STATUS_CONFIG[currentStatus] || ORDER_STATUS_CONFIG.new;

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    if (newStatus === currentStatus) return;

    setLoading(true);
    try {
      await onUpdate(orderId, newStatus);
    } catch (err) {
      console.error('Failed to update order status:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-flex items-center" onClick={(e) => e.stopPropagation()}>
      <select
        value={currentStatus}
        disabled={loading}
        onChange={handleChange}
        className={`appearance-none cursor-pointer font-bold tracking-wide uppercase rounded-full border transition-all pl-2.5 pr-6 focus:outline-none focus:ring-2 focus:ring-[#BA9541]/40 ${
          size === 'xs' ? 'py-1 text-[10px]' : 'py-1.5 text-xs'
        } ${config.bg} ${config.text} ${config.border} disabled:opacity-60`}
      >
        <option value="new" className="bg-white text-[#1E1A17] font-semibold">
          🔵 New
        </option>
        <option value="confirmed" className="bg-white text-[#1E1A17] font-semibold">
          🟢 Confirmed
        </option>
        <option value="processing" className="bg-white text-[#1E1A17] font-semibold">
          🟡 Processing
        </option>
        <option value="shipped" className="bg-white text-[#1E1A17] font-semibold">
          🚚 Shipped
        </option>
        <option value="delivered" className="bg-white text-[#1E1A17] font-semibold">
          ✅ Delivered
        </option>
        <option value="cancelled" className="bg-white text-[#1E1A17] font-semibold">
          ❌ Cancelled
        </option>
        <option value="returned" className="bg-white text-[#1E1A17] font-semibold">
          🔄 Returned
        </option>
      </select>

      <div className="pointer-events-none absolute right-2 flex items-center">
        {loading ? (
          <Loader2 className="w-3 h-3 animate-spin text-current" />
        ) : (
          <ChevronDown className="w-3 h-3 text-current opacity-70" />
        )}
      </div>
    </div>
  );
};

interface InlinePaymentStatusSelectProps {
  orderId: string;
  currentStatus: PaymentStatus;
  onUpdate: (orderId: string, newStatus: PaymentStatus) => Promise<void>;
  size?: 'sm' | 'xs';
}

const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  paid: { label: 'Paid', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  processing: { label: 'Processing', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  failed: { label: 'Failed', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  refunded: { label: 'Refunded', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
};

export const InlinePaymentStatusSelect: React.FC<InlinePaymentStatusSelectProps> = ({
  orderId,
  currentStatus,
  onUpdate,
  size = 'xs',
}) => {
  const [loading, setLoading] = useState(false);
  const config = PAYMENT_STATUS_CONFIG[currentStatus] || PAYMENT_STATUS_CONFIG.pending;

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as PaymentStatus;
    if (newStatus === currentStatus) return;

    setLoading(true);
    try {
      await onUpdate(orderId, newStatus);
    } catch (err) {
      console.error('Failed to update payment status:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-flex items-center" onClick={(e) => e.stopPropagation()}>
      <select
        value={currentStatus}
        disabled={loading}
        onChange={handleChange}
        className={`appearance-none cursor-pointer font-bold tracking-wide uppercase rounded-full border transition-all pl-2.5 pr-6 focus:outline-none focus:ring-2 focus:ring-[#BA9541]/40 ${
          size === 'xs' ? 'py-1 text-[10px]' : 'py-1.5 text-xs'
        } ${config.bg} ${config.text} ${config.border} disabled:opacity-60`}
      >
        <option value="paid" className="bg-white text-[#1E1A17] font-semibold">
          🟢 Paid
        </option>
        <option value="pending" className="bg-white text-[#1E1A17] font-semibold">
          🟡 Pending
        </option>
        <option value="failed" className="bg-white text-[#1E1A17] font-semibold">
          🔴 Failed
        </option>
        <option value="refunded" className="bg-white text-[#1E1A17] font-semibold">
          🟣 Refunded
        </option>
      </select>

      <div className="pointer-events-none absolute right-2 flex items-center">
        {loading ? (
          <Loader2 className="w-3 h-3 animate-spin text-current" />
        ) : (
          <ChevronDown className="w-3 h-3 text-current opacity-70" />
        )}
      </div>
    </div>
  );
};
