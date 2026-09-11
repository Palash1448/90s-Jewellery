import React, { useState, useRef } from 'react';
import { ZoomIn, X, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import type { Product } from '../../types';

interface ProductGalleryProps {
  product: Product;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ product }) => {
  const allImages = product.images && product.images.length > 0
    ? product.images
    : [product.primaryImage || 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1000&q=85'];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const activeImage = allImages[activeIndex] || allImages[0];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      // Swiped Left -> Next
      handleNext();
    } else if (diff < -45) {
      // Swiped Right -> Prev
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="w-full">
      {/* Main Image Frame with Swipe Support */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#F5EFE6] border border-[#E8E2D8] shadow-md group select-none"
      >
        <img
          src={activeImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="eager"
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.discountPercentage > 0 && (
            <span className="bg-[#8C2D3B] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md shadow uppercase tracking-wider">
              {product.discountPercentage}% OFF
            </span>
          )}
          <span className="bg-[#1E1A17]/85 backdrop-blur-sm text-[#D4AF37] text-[9px] sm:text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 shadow">
            <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
            <span>24K Micro Polish</span>
          </span>
        </div>

        {/* Zoom trigger */}
        <button
          onClick={() => setIsZoomOpen(true)}
          className="absolute bottom-3 right-3 sm:bottom-3.5 sm:right-3.5 bg-white/90 hover:bg-white text-[#1E1A17] p-2 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 active:scale-95 z-10 cursor-pointer"
          title="Zoom image"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Image navigation arrows if multiple images */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="hidden sm:flex absolute left-2.5 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#1E1A17] p-1.5 rounded-full shadow backdrop-blur-sm transition-all opacity-80 hover:opacity-100 z-10 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="hidden sm:flex absolute right-2.5 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#1E1A17] p-1.5 rounded-full shadow backdrop-blur-sm transition-all opacity-80 hover:opacity-100 z-10 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Mobile Pagination Dots */}
        {allImages.length > 1 && (
          <div className="sm:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full z-10">
            {allImages.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === activeIndex ? 'bg-white w-3' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails strip */}
      {allImages.length > 1 && (
        <div className="flex gap-2 sm:gap-3 mt-3 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                idx === activeIndex
                  ? 'border-[#BA9541] shadow-md ring-2 ring-[#BA9541]/30 scale-105'
                  : 'border-transparent opacity-65 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover object-center" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Zoom Lightbox Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-[#D4AF37] p-2 rounded-full bg-white/10 text-xl transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activeImage}
            alt={product.name}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

