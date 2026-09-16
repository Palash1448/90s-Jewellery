import React from 'react';
import { ShieldCheck, Zap, Sparkles, CheckCircle2, Banknote, AlertCircle, Truck } from 'lucide-react';

export type PaymentMethod = 'ONLINE' | 'COD';

interface PaymentMethodSelectorProps {
  paymentMethod: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  codCharge?: number;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethod,
  onChange,
  codCharge = 40,
}) => {
  return (
    <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1E1A17] text-[#FAF8F5] flex items-center justify-center text-xs font-bold font-sans">
            3
          </div>
          <h2 className="font-display font-bold text-base sm:text-xl text-[#1E1A17]">
            Select Payment Method
          </h2>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Safe Checkout</span>
        </span>
      </div>

      <div className="space-y-3">
        {/* 1. Online Payment Card (Prepaid Razorpay) */}
        <div
          onClick={() => onChange('ONLINE')}
          className={`cursor-pointer p-4 sm:p-5 rounded-2xl border-2 transition-all space-y-3 ${
            paymentMethod === 'ONLINE'
              ? 'border-[#BA9541] bg-[#FAF3E0] shadow-sm ring-1 ring-[#BA9541]/40'
              : 'border-[#E8E2D8] bg-white hover:border-[#D4AF37]/60 hover:bg-[#FAF8F5]'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs mt-0.5 transition-colors ${
                  paymentMethod === 'ONLINE'
                    ? 'bg-[#BA9541] text-white'
                    : 'bg-[#FAF3E0] text-[#BA9541]'
                }`}
              >
                <Zap className="w-5 h-5 fill-current" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm sm:text-base font-bold text-[#1E1A17]">
                    Instant Online Payment
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase">
                    Recommended • ₹0 Extra Fee
                  </span>
                </div>
                <p className="text-xs text-[#6B5E50] mt-1 leading-relaxed">
                  UPI (GPay, PhonePe, Paytm), Credit & Debit Cards, NetBanking
                </p>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-xs transition-colors ${
                paymentMethod === 'ONLINE'
                  ? 'bg-[#BA9541] text-white'
                  : 'border-2 border-[#D0C5B4] bg-white'
              }`}
            >
              {paymentMethod === 'ONLINE' && (
                <CheckCircle2 className="w-4 h-4 fill-current text-white" />
              )}
            </div>
          </div>

          <div className="pt-2.5 border-t border-[#E8DCC0] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#7A673F]">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#BA9541] shrink-0" />
              <span>Insured express delivery & keepsake box</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>256-Bit Bank-Grade encryption</span>
            </div>
          </div>
        </div>

        {/* 2. Cash on Delivery (COD) Card */}
        <div
          onClick={() => onChange('COD')}
          className={`cursor-pointer p-4 sm:p-5 rounded-2xl border-2 transition-all space-y-3 ${
            paymentMethod === 'COD'
              ? 'border-[#BA9541] bg-[#FAF3E0] shadow-sm ring-1 ring-[#BA9541]/40'
              : 'border-[#E8E2D8] bg-white hover:border-[#D4AF37]/60 hover:bg-[#FAF8F5]'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs mt-0.5 transition-colors ${
                  paymentMethod === 'COD'
                    ? 'bg-[#1E1A17] text-[#D4AF37]'
                    : 'bg-[#FAF3E0] text-[#7A673F]'
                }`}
              >
                <Banknote className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm sm:text-base font-bold text-[#1E1A17]">
                    Cash on Delivery (COD)
                  </span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded uppercase border border-amber-200">
                    +₹{codCharge} Extra Handling Fee
                  </span>
                </div>
                <p className="text-xs text-[#6B5E50] mt-1 leading-relaxed">
                  Pay via Cash or UPI at your doorstep upon package arrival
                </p>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-xs transition-colors ${
                paymentMethod === 'COD'
                  ? 'bg-[#BA9541] text-white'
                  : 'border-2 border-[#D0C5B4] bg-white'
              }`}
            >
              {paymentMethod === 'COD' && (
                <CheckCircle2 className="w-4 h-4 fill-current text-white" />
              )}
            </div>
          </div>

          {paymentMethod === 'COD' && (
            <div className="pt-2.5 border-t border-[#E8DCC0] space-y-2 text-xs text-[#7A673F] animate-in fade-in">
              <div className="flex items-start gap-1.5 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/80 text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  A flat <strong>₹{codCharge} handling fee</strong> is added by our courier partners for cash collection verification.
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#524436]">
                <Truck className="w-3.5 h-3.5 text-[#BA9541] shrink-0" />
                <span>Please ensure an exact cash amount or active UPI app is ready during delivery.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
