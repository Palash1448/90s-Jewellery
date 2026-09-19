import React from 'react';
import { ShieldCheck, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

export type PaymentMethod = 'ONLINE';

interface PaymentMethodSelectorProps {
  paymentMethod?: PaymentMethod | string;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = () => {
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
          <span>100% Safe Checkout</span>
        </span>
      </div>

      <div className="space-y-3">
        {/* Instant Online Payment Card (Razorpay: UPI / Cards / NetBanking) */}
        <div className="p-4 sm:p-5 rounded-2xl border-2 border-[#BA9541] bg-[#FAF3E0] shadow-sm ring-1 ring-[#BA9541]/40 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs mt-0.5 bg-[#BA9541] text-white">
                <Zap className="w-5 h-5 fill-current" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm sm:text-base font-bold text-[#1E1A17]">
                    Instant Online Payment
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase">
                    ₹0 Extra Fee • Guaranteed Fast Dispatch
                  </span>
                </div>
                <p className="text-xs text-[#6B5E50] mt-1 leading-relaxed">
                  UPI (GPay, PhonePe, Paytm, BHIM), Credit & Debit Cards, NetBanking
                </p>
              </div>
            </div>

            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-xs bg-[#BA9541] text-white">
              <CheckCircle2 className="w-4 h-4 fill-current text-white" />
            </div>
          </div>

          <div className="pt-2.5 border-t border-[#E8DCC0] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#7A673F]">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#BA9541] shrink-0" />
              <span>Insured express delivery & keepsake box</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>256-Bit Bank-Grade SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
