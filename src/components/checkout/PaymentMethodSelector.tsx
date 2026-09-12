import React from 'react';
import { ShieldCheck, Zap, Sparkles, CheckCircle2, CreditCard } from 'lucide-react';

export type PaymentMethod = 'ONLINE';

interface PaymentMethodSelectorProps {
  totalAmount: number;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
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
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Secure</span>
        </span>
      </div>

      {/* Online Payment Card (Prepaid Only) */}
      <div className="p-4 sm:p-5 rounded-2xl border-2 border-[#BA9541] bg-[#FAF3E0] shadow-xs space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#BA9541] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-bold text-[#1E1A17]">
                  Instant Online Payment
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase">
                  Razorpay Verified
                </span>
              </div>
              <p className="text-xs text-[#6B5E50] mt-1 leading-relaxed">
                UPI (GPay, PhonePe, Paytm), Credit & Debit Cards, NetBanking
              </p>
            </div>
          </div>

          <div className="w-5 h-5 rounded-full bg-[#BA9541] text-white flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-4 h-4 fill-current text-white" />
          </div>
        </div>

        <div className="pt-2.5 border-t border-[#E8DCC0] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#7A673F]">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#BA9541] shrink-0" />
            <span>Insured delivery & keepsake packaging</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>256-Bit Bank-Grade encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};
