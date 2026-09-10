import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, MessageCircle, Share2 } from 'lucide-react';
import type { Product } from '../../types';
import { buildWhatsAppLink } from '../../services/whatsappService';
import { ShareProductModal } from '../common/ShareProductModal';

interface StickyMobileCTAProps {
  product: Product;
}

export const StickyMobileCTA: React.FC<StickyMobileCTAProps> = ({ product }) => {
  const navigate = useNavigate();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const isAvailable = product.status === 'active' && product.stock > 0;

  const handleBuyNow = () => {
    navigate(`/checkout/${product.slug}`);
  };

  const brandName = import.meta.env.VITE_BRAND_NAME || '90s chya athavani Jewellery';
  const whatsappLink = buildWhatsAppLink(
    import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210',
    `Hi ${brandName}, I want to purchase ${product.name} (₹${product.price}). Link: ${window.location.href}`
  );

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/98 backdrop-blur-lg border-t border-[#D4AF37]/40 px-3 pt-2.5 pb-[max(10px,env(safe-area-inset-bottom))] shadow-2xl lg:hidden">
        <div className="max-w-md mx-auto flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={() => setIsShareOpen(true)}
            id="mobile-sticky-share-btn"
            type="button"
            className="p-3 rounded-xl bg-[#FAF3E0] hover:bg-[#F2E6CE] text-[#805E25] border border-[#E0D0B4] flex items-center justify-center shrink-0 shadow-xs active:scale-95 transition-transform cursor-pointer"
            title="Share Product Link"
          >
            <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow active:scale-95 transition-transform"
            title="Order via WhatsApp"
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
          </a>

          {isAvailable ? (
            <button
              onClick={handleBuyNow}
              id="mobile-sticky-buy-btn"
              className="flex-1 py-3 sm:py-3.5 px-3.5 sm:px-4 rounded-xl bg-[#1E1A17] hover:bg-black text-white font-display font-bold text-xs sm:text-sm tracking-wide shadow-lg active:scale-[0.98] transition-transform flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-1.5 truncate">
                <ShoppingBag className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="truncate">BUY NOW</span>
              </span>
              <span className="text-[#FAF8F5] text-sm sm:text-base font-sans font-bold shrink-0 ml-2">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </button>
          ) : (
            <button
              disabled
              className="flex-1 py-3 sm:py-3.5 px-4 rounded-xl bg-gray-200 text-gray-500 font-display font-bold text-xs sm:text-sm text-center"
            >
              OUT OF STOCK
            </button>
          )}
        </div>
      </div>

      <ShareProductModal
        product={product}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </>
  );
};
