import React from 'react';
import { ShieldCheck, Truck, Sparkles, Lock, ArrowRight } from 'lucide-react';
import type { Product } from '../../types';

interface OrderSummaryProps {
  product: Product;
  quantity: number;
  paymentMethod?: 'ONLINE' | 'COD';
  isSubmitting?: boolean;
  submittingText?: string;
  onProceedToPayment: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  product,
  quantity,
  paymentMethod = 'ONLINE',
  isSubmitting = false,
  submittingText,
  onProceedToPayment,
}) => {
  const unitPrice = product.price;
  const mrp = product.mrp || product.price;
  const subtotal = unitPrice * quantity;
  const totalMrp = mrp * quantity;
  const discountSavings = Math.max(0, totalMrp - subtotal);
  const shippingFee = subtotal >= 999 ? 0 : (product.shippingCharge || 50);
  const finalTotal = subtotal + shippingFee;

  const productImage = product.primaryImage || (product.images && product.images[0]) || '';

  const buttonLabel = paymentMethod === 'ONLINE' ? 'PROCEED TO PAYMENT' : 'PLACE ORDER (COD)';

  return (
    <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl p-5 sm:p-6 shadow-md space-y-5 sticky top-24">
      <h3 className="font-display font-bold text-lg sm:text-xl text-[#1E1A17] pb-3 border-b border-[#E8E2D8]">
        Order Summary
      </h3>

      {/* Product Mini Card */}
      <div className="flex gap-3.5 items-center pb-4 border-b border-[#EFE9DF]">
        <img
          src={productImage}
          alt={product.name}
          className="w-20 h-20 rounded-xl object-cover border border-[#E0D8C8] bg-white shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-[#1E1A17] truncate">{product.name}</h4>
          <p className="text-xs text-[#7A6F62] mt-0.5">
            Qty: <span className="font-bold text-[#1E1A17]">{quantity}</span> × ₹{unitPrice.toLocaleString('en-IN')}
          </p>
          {product.sku && <p className="text-[10px] text-[#A39686] mt-0.5 uppercase">SKU: {product.sku}</p>}
        </div>
      </div>

      {/* Price Calculations */}
      <div className="space-y-2.5 text-xs sm:text-sm">
        <div className="flex justify-between text-[#5C5042]">
          <span>Total MRP</span>
          <span className="line-through">₹{totalMrp.toLocaleString('en-IN')}</span>
        </div>

        {discountSavings > 0 && (
          <div className="flex justify-between text-[#8C2D3B] font-semibold">
            <span>Special Festive Discount</span>
            <span>- ₹{discountSavings.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="flex justify-between text-[#5C5042]">
          <span>Subtotal</span>
          <span className="font-semibold text-[#1E1A17]">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between items-center text-[#5C5042]">
          <span className="flex items-center gap-1">
            <span>Express Shipping</span>
            {shippingFee === 0 && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                FREE
              </span>
            )}
          </span>
          <span className={shippingFee === 0 ? 'text-emerald-700 font-bold' : 'font-semibold text-[#1E1A17]'}>
            {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
          </span>
        </div>

        {/* Free Shipping Progress helper if under ₹999 */}
        {subtotal < 999 && (
          <div className="p-2.5 rounded-lg bg-[#FAF2DC] border border-[#EADBBD] text-[11px] text-[#785E25] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#BA9541] shrink-0" />
            <span>Add ₹{(999 - subtotal).toLocaleString('en-IN')} more to unlock FREE Express Shipping!</span>
          </div>
        )}

        {/* Total calculation */}
        <div className="pt-3 border-t-2 border-[#1E1A17] flex justify-between items-baseline">
          <span className="font-display font-bold text-base sm:text-lg text-[#1E1A17]">
            Total Amount
          </span>
          <span className="font-display font-bold text-2xl sm:text-3xl text-[#1E1A17]">
            ₹{finalTotal.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Big Action CTA */}
      <button
        onClick={onProceedToPayment}
        disabled={isSubmitting}
        id="checkout-proceed-payment-btn"
        className="w-full py-4 px-6 rounded-xl font-display font-bold text-base sm:text-lg text-white bg-[#1E1A17] hover:bg-black active:scale-[0.99] disabled:opacity-50 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>{submittingText || 'Processing...'}</span>
          </div>
        ) : (
          <>
            <Lock className="w-4 h-4 text-[#D4AF37]" />
            <span>{buttonLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Trust & Guarantee indicators */}
      <div className="space-y-2 pt-2 border-t border-[#E8E2D8] text-[11px] text-[#6E6356]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>256-Bit Bank-Grade SSL Encrypted Checkout</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#BA9541] shrink-0" />
          <span>Insured Doorstep Delivery & 7-Day Replacement</span>
        </div>
      </div>
    </div>
  );
};
