import React, { useState } from 'react';
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

  const activeImage = allImages[activeIndex] || allImages[0];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="w-full">
      {/* Main Image Frame */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#F5EFE6] border border-[#E8E2D8] shadow-md group">
        <img
          src={activeImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="eager"
        />

        {/* Floating Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
          {product.discountPercentage > 0 && (
            <span className="bg-[#8C2D3B] text-white text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-md shadow uppercase tracking-wider">
              {product.discountPercentage}% OFF
            </span>
          )}
          <span className="bg-[#1E1A17]/85 backdrop-blur-sm text-[#D4AF37] text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 shadow">
            <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
            <span>24K Micro Polish</span>
          </span>
        </div>

        {/* Zoom trigger */}
        <button
          onClick={() => setIsZoomOpen(true)}
          className="absolute bottom-3.5 right-3.5 bg-white/90 hover:bg-white text-[#1E1A17] p-2 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 active:scale-95 z-10"
          title="Zoom image"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Image navigation arrows if multiple images */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#1E1A17] p-1.5 rounded-full shadow backdrop-blur-sm transition-all opacity-80 hover:opacity-100 z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#1E1A17] p-1.5 rounded-full shadow backdrop-blur-sm transition-all opacity-80 hover:opacity-100 z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails strip */}
      {allImages.length > 1 && (
        <div className="flex gap-2.5 sm:gap-3 mt-3.5 overflow-x-auto pb-1 scrollbar-none">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
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
            className="absolute top-4 right-4 text-white hover:text-[#D4AF37] p-2 rounded-full bg-white/10 text-xl transition-all"
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
