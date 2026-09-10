import React from 'react';
import type { PaymentStatus, OrderStatus, ProductStatus } from '../../types';

interface BadgeProps {
  status: PaymentStatus | OrderStatus | ProductStatus | string;
  type?: 'payment' | 'order' | 'product' | 'discount' | 'stock';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, type = 'product', className = '' }) => {
  let colorClasses = 'bg-gray-100 text-gray-800 border-gray-200';

  // Payment statuses
  if (status === 'paid') {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (status === 'pending' || status === 'processing') {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (status === 'failed') {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (status === 'refunded') {
    colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
  }

  // Order statuses
  else if (status === 'confirmed' || status === 'delivered') {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (status === 'shipped') {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (status === 'cancelled' || status === 'returned') {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (status === 'new') {
    colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  }

  // Product statuses
  else if (status === 'active') {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (status === 'inactive') {
    colorClasses = 'bg-gray-100 text-gray-600 border-gray-200';
  } else if (status === 'out_of_stock') {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  }

  // Discount / Stock Tag
  if (type === 'discount') {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-[#8C2D3B] text-white tracking-wide ${className}`}>
        {status}
      </span>
    );
  }

  const formatText = (str: string) => {
    return str.replace(/_/g, ' ').toUpperCase();
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border uppercase ${colorClasses} ${className}`}
    >
      {formatText(status)}
    </span>
  );
};
