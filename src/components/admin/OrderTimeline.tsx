import React from 'react';
import { CheckCircle2, Clock, Truck, Package, ShieldCheck, XCircle } from 'lucide-react';
import type { OrderStatus, PaymentStatus } from '../../types';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  onUpdateStatus: (newStatus: OrderStatus) => void;
  isUpdating?: boolean;
}

const STEPS: { status: OrderStatus; label: string; icon: any; desc: string }[] = [
  { status: 'new', label: 'Order Placed', icon: Clock, desc: 'Pending admin review' },
  { status: 'confirmed', label: 'Confirmed', icon: CheckCircle2, desc: 'Payment verified & booked' },
  { status: 'processing', label: 'Crafting / Packaging', icon: Package, desc: 'Quality check & velvet box pack' },
  { status: 'shipped', label: 'Dispatched', icon: Truck, desc: 'Handed to courier partner' },
  { status: 'delivered', label: 'Delivered', icon: ShieldCheck, desc: 'Received by customer' },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({
  currentStatus,
  paymentStatus,
  onUpdateStatus,
  isUpdating = false,
}) => {
  const isCancelled = currentStatus === 'cancelled' || currentStatus === 'returned';

  const getStepIndex = (status: OrderStatus) => {
    return STEPS.findIndex((s) => s.status === status);
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8E2D8] shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#EFE9DF]">
        <h3 className="font-display font-bold text-base sm:text-lg text-[#1E1A17]">
          Fulfillment Timeline & Status Progression
        </h3>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full uppercase bg-[#FAF3E0] text-[#947127] border border-[#E8DCBE]">
          Current: {currentStatus.toUpperCase()}
        </span>
      </div>

      {isCancelled ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
          <XCircle className="w-6 h-6 shrink-0 text-rose-600" />
          <div>
            <h4 className="font-bold text-sm">Order Marked as {currentStatus.toUpperCase()}</h4>
            <p className="text-xs text-rose-600">This order is not actively in the fulfillment pipeline.</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Progress Bar Line */}
          <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-[#E8E2D8] -z-0">
            <div
              className="h-full bg-[#BA9541] transition-all duration-500"
              style={{
                width: `${(Math.max(0, currentIndex) / (STEPS.length - 1)) * 100}%`,
              }}
            />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
            {STEPS.map((step, idx) => {
              const isPast = idx <= currentIndex;
              const isCurrent = idx === currentIndex;
              const StepIcon = step.icon;

              return (
                <div key={step.status} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(step.status)}
                    disabled={isUpdating}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
                      isCurrent
                        ? 'bg-[#1E1A17] text-[#D4AF37] ring-4 ring-[#D4AF37]/30 scale-110'
                        : isPast
                        ? 'bg-[#BA9541] text-white hover:opacity-90'
                        : 'bg-[#F2ECE1] text-[#9E9182] hover:bg-[#E8DFC2]'
                    }`}
                  >
                    <StepIcon className="w-5 h-5" />
                  </button>

                  <div>
                    <h5
                      className={`text-xs font-bold ${
                        isCurrent ? 'text-[#1E1A17]' : isPast ? 'text-[#5E4B23]' : 'text-[#8C8072]'
                      }`}
                    >
                      {step.label}
                    </h5>
                    <p className="text-[10px] text-[#A39686] hidden sm:block mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Admin Quick Action Buttons */}
      <div className="pt-4 border-t border-[#EFE9DF] flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-[#73685C]">Click on any step or select action to update status:</span>

        <div className="flex flex-wrap items-center gap-2">
          {currentStatus === 'new' && (
            <button
              onClick={() => onUpdateStatus('confirmed')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#BA9541] hover:bg-[#A07B30] shadow-sm transition-colors"
            >
              Mark Confirmed
            </button>
          )}

          {currentStatus === 'confirmed' && (
            <button
              onClick={() => onUpdateStatus('processing')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#1E1A17] hover:bg-black shadow-sm transition-colors"
            >
              Start Processing / Pack
            </button>
          )}

          {currentStatus === 'processing' && (
            <button
              onClick={() => onUpdateStatus('shipped')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 shadow-sm transition-colors"
            >
              Mark Dispatched / Shipped
            </button>
          )}

          {currentStatus === 'shipped' && (
            <button
              onClick={() => onUpdateStatus('delivered')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm transition-colors"
            >
              Mark Delivered
            </button>
          )}

          {!isCancelled && (
            <button
              onClick={() => onUpdateStatus('cancelled')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
