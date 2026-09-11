import React from 'react';
import { CreditCard, Banknote, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export type PaymentMethod = 'ONLINE' | 'COD';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  totalAmount: number;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onChange,
  totalAmount,
}) => {
  return (
    <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1E1A17] text-[#FAF8F5] flex items-center justify-center text-xs font-bold font-sans">
            3
          </div>
          <h2 className="font-display font-bold text-base sm:text-xl text-[#1E1A17]">
            Payment Method
          </h2>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Secure</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Option 1: Online Payment (Razorpay) */}
        <div
          onClick={() => onChange('ONLINE')}
          className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
            selectedMethod === 'ONLINE'
              ? 'border-[#BA9541] bg-[#FAF3E0] shadow-xs'
              : 'border-[#E0D7C7] bg-white hover:border-[#BA9541]/50'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                selectedMethod === 'ONLINE' ? 'bg-[#BA9541] text-white' : 'bg-[#FAF6EE] text-[#695D4F]'
              }`}>
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold text-[#1E1A17]">
                    Online Payment
                  </span>
                  <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded uppercase">
                    Recommended
                  </span>
                </div>
                <p className="text-[11px] text-[#73685C] mt-0.5 leading-snug">
                  UPI (GPay, PhonePe, Paytm), Cards, NetBanking
                </p>
              </div>
            </div>

            <input
              type="radio"
              name="paymentMethod"
              checked={selectedMethod === 'ONLINE'}
              onChange={() => onChange('ONLINE')}
              className="mt-1 text-[#BA9541] focus:ring-[#BA9541] w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 text-[10px] text-[#806B43] pt-1 border-t border-[#E8DCC0]">
            <Sparkles className="w-3 h-3 text-[#BA9541]" />
            <span>Instant order confirmation & priority express dispatch</span>
          </div>
        </div>

        {/* Option 2: Cash on Delivery (COD) */}
        <div
          onClick={() => onChange('COD')}
          className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
            selectedMethod === 'COD'
              ? 'border-[#BA9541] bg-[#FAF3E0] shadow-xs'
              : 'border-[#E0D7C7] bg-white hover:border-[#BA9541]/50'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                selectedMethod === 'COD' ? 'bg-[#BA9541] text-white' : 'bg-[#FAF6EE] text-[#695D4F]'
              }`}>
                <Banknote className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-[#1E1A17] block">
                  Cash on Delivery
                </span>
                <p className="text-[11px] text-[#73685C] mt-0.5 leading-snug">
                  Pay cash at your doorstep upon delivery
                </p>
              </div>
            </div>

            <input
              type="radio"
              name="paymentMethod"
              checked={selectedMethod === 'COD'}
              onChange={() => onChange('COD')}
              className="mt-1 text-[#BA9541] focus:ring-[#BA9541] w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1 text-[10px] text-[#7A6E60] pt-1 border-t border-[#E8DCC0]">
            <span>Pay ₹{totalAmount.toLocaleString('en-IN')} to courier on delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};
