import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Minus,
  Plus,
  ShoppingBag,
  Flame,
  Award,
  Share2
} from 'lucide-react';
import type { Product } from '../../types';
import { WhatsAppButton } from './WhatsAppButton';
import { ShareProductModal } from '../common/ShareProductModal';

interface ProductHeroProps {
  product: Product;
}

export const ProductHero: React.FC<ProductHeroProps> = ({ product }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const isAvailable = product.status === 'active' && product.stock > 0;
  const isOutOfStock = product.status === 'out_of_stock' || product.stock <= 0;
  const isLowStock = isAvailable && product.stock <= 5;

  const handleBuyNow = () => {
    navigate(`/checkout/${product.slug}?qty=${quantity}`);
  };

  const incrementQty = () => {
    if (quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  return (
    <div className="flex flex-col space-y-4 sm:space-y-5">
      {/* Category & SKU & Share */}
      <div className="flex items-center justify-between text-xs text-[#85786A] uppercase tracking-wider font-semibold">
        <span>{product.category || 'Fine Jewellery'}</span>
        <div className="flex items-center gap-3">
          {product.sku && <span>SKU: {product.sku}</span>}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1 text-[11px] font-bold text-[#805E25] hover:text-[#1E1A17] bg-[#FAF3E0] hover:bg-[#F2E6CE] px-2.5 py-1 rounded-full border border-[#E0D0B4] transition-colors cursor-pointer"
            title="Share Product Link"
          >
            <Share2 className="w-3 h-3 text-[#BA9541]" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Product Title */}
      <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-[#1E1A17] leading-tight tracking-tight">
        {product.name}
      </h1>

      {/* Authentic Indian Trust Seal (No fake star numbers) */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 py-1 text-xs">
        <div className="flex items-center gap-1.5 bg-[#FAF3E0] text-[#947127] font-semibold px-2.5 py-1 rounded-full border border-[#D4AF37]/40">
          <Award className="w-3.5 h-3.5 text-[#BA9541]" />
          <span>Hallmark Finish Certified</span>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 font-medium px-2.5 py-1 rounded-full border border-emerald-200/60">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Skin-Friendly Hypoallergenic</span>
        </div>
      </div>

      {/* Pricing Block */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-[#FAF6EE] to-[#F5ECE0] border border-[#E8DCBE]">
        <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
          <span className="font-display font-bold text-2xl sm:text-4xl text-[#1E1A17]">
            ₹{product.price.toLocaleString('en-IN')}
          </span>

          {product.mrp > product.price && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm sm:text-lg text-[#8C8074] line-through font-medium">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
              <span className="bg-[#8C2D3B] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded shadow-xs whitespace-nowrap">
                SAVE ₹{(product.mrp - product.price).toLocaleString('en-IN')} ({product.discountPercentage}% OFF)
              </span>
            </div>
          )}
        </div>

        <p className="text-[11px] text-[#6E6458] mt-1.5 flex flex-wrap items-center gap-1">
          <span>Inclusive of all taxes.</span>
          <span className="font-semibold text-emerald-700">
            ✓ Free Delivery in Maharashtra (Flat ₹50 Other States)
          </span>
        </p>
      </div>

      {/* Short Description */}
      <p className="text-xs sm:text-sm text-[#473E35] leading-relaxed">
        {product.shortDescription}
      </p>

      {/* Stock Status Notification */}
      <div className="py-0.5 sm:py-1">
        {isOutOfStock ? (
          <div className="flex items-center gap-2 text-rose-700 font-semibold text-xs sm:text-sm bg-rose-50 px-3 py-2 rounded-lg border border-rose-200">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Currently Out of Stock. Inquire on WhatsApp for next batch.</span>
          </div>
        ) : isLowStock ? (
          <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-300 animate-pulse">
            <Flame className="w-4 h-4 text-amber-600 shrink-0" />
            <span>High Demand! Only {product.stock} pieces remaining in stock.</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-emerald-800 font-medium text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>In Stock — Ready to Dispatch within 24 Hours</span>
          </div>
        )}
      </div>

      {/* Quantity Selector */}
      {isAvailable && (
        <div className="flex items-center gap-3 sm:gap-4 pt-1">
          <span className="text-xs font-semibold text-[#1E1A17] uppercase tracking-wider">Quantity:</span>
          <div className="flex items-center border border-[#D0C5B4] rounded-lg bg-white overflow-hidden shadow-xs">
            <button
              onClick={decrementQty}
              disabled={quantity <= 1}
              className="p-2.5 sm:p-2 hover:bg-[#F3EDE4] text-[#1E1A17] disabled:opacity-30 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 sm:px-4 py-1 text-sm font-bold text-[#1E1A17] min-w-[32px] text-center">
              {quantity}
            </span>
            <button
              onClick={incrementQty}
              disabled={quantity >= product.stock}
              className="p-2.5 sm:p-2 hover:bg-[#F3EDE4] text-[#1E1A17] disabled:opacity-30 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Action CTA Buttons */}
      <div className="flex flex-col gap-2.5 sm:gap-3 pt-2">
        {isAvailable ? (
          <button
            onClick={handleBuyNow}
            id="product-buy-now-btn"
            className="w-full py-3.5 sm:py-4 px-5 sm:px-6 rounded-xl font-display font-bold text-base sm:text-lg text-white bg-[#1E1A17] hover:bg-[#0F0D0B] active:scale-[0.99] transition-all shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform text-[#D4AF37]" />
            <span>BUY NOW — ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
          </button>
        ) : (
          <button
            disabled
            className="w-full py-3 sm:py-3.5 px-6 rounded-xl font-display font-bold text-sm sm:text-base text-gray-500 bg-gray-200 cursor-not-allowed"
          >
            OUT OF STOCK
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
          <WhatsAppButton product={product} size="md" className="w-full" />
          
          <button
            onClick={() => setIsShareModalOpen(true)}
            id="share-product-hero-btn"
            type="button"
            className="w-full py-2.5 sm:py-3 px-4 rounded-xl border border-[#D9CFBE] bg-[#FAF8F5] hover:bg-[#F3ECE0] text-[#1E1A17] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-2xs cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-[#BA9541]" />
            <span>Share Product Link</span>
          </button>
        </div>
      </div>

      {/* Delivery micro-perks */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#E8E2D8] text-xs text-[#52473B]">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#BA9541] shrink-0" />
          <span>Fast Delhivery / BlueDart</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#BA9541] shrink-0" />
          <span>Complimentary Gift Packaging</span>
        </div>
      </div>

      {/* Share Product Modal */}
      <ShareProductModal
        product={product}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};
