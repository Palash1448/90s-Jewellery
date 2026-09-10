import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  HelpCircle,
  ChevronDown,
  Info,
  CheckCircle
} from 'lucide-react';
import type { Product } from '../../types';

interface ProductDetailsProps {
  product: Product;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    specs: true,
    desc: true,
    care: false,
    shipping: false,
    faq: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const specsList = [
    { label: 'Category', value: product.category },
    { label: 'Material', value: product.material },
    { label: 'Polish / Finish', value: product.finish },
    { label: 'Colour', value: product.color },
    { label: 'Size / Dimensions', value: product.size },
    { label: 'Weight', value: product.weight },
    { label: 'Ideal Occasion', value: product.occasion },
    { label: 'Package Contents', value: product.packageContents },
  ].filter((item) => item.value && item.value.trim() !== '');

  const faqs = [
    {
      q: 'Will the gold polish fade quickly?',
      a: 'We use high-grade 24K micron plating with an e-coating anti-tarnish protective layer. With basic care (keeping away from direct water, alcohol sprays, and perfumes), the shine lasts for years.',
    },
    {
      q: 'Is this jewellery hypoallergenic?',
      a: 'Yes, our jewellery is 100% nickel-free and lead-free, designed to be gentle and safe on sensitive Indian skin.',
    },
    {
      q: 'How do I track my order?',
      a: 'Once your order is confirmed, our automated WhatsApp concierge will send you live tracking updates and dispatch notifications directly on WhatsApp.',
    },
    {
      q: 'What if the product arrives damaged?',
      a: 'We offer an immediate free 7-day replacement. Simply share an unboxing video with our WhatsApp helpline and we will arrange a replacement immediately.',
    },
  ];

  return (
    <div className="w-full mt-10 space-y-4">
      {/* 1. Product Specifications */}
      <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection('specs')}
          className="w-full px-5 py-4 flex items-center justify-between font-display font-bold text-base sm:text-lg text-[#1E1A17] hover:bg-[#F5EFE6] transition-colors"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#BA9541]" />
            <span>Product Specifications</span>
          </span>
          <ChevronDown
            className={`w-5 h-5 text-[#8A7D6E] transition-transform duration-300 ${
              openSections.specs ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.specs && (
          <div className="px-5 pb-5 pt-1 border-t border-[#EFE9DF]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-xs sm:text-sm">
              {specsList.map((item, idx) => (
                <div key={idx} className="flex justify-between py-1.5 border-b border-[#F0EAE0]">
                  <span className="text-[#73685C] font-medium">{item.label}</span>
                  <span className="text-[#1E1A17] font-semibold text-right max-w-[60%]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Detailed Description */}
      {product.description && (
        <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection('desc')}
            className="w-full px-5 py-4 flex items-center justify-between font-display font-bold text-base sm:text-lg text-[#1E1A17] hover:bg-[#F5EFE6] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#BA9541]" />
              <span>About the Craftsmanship</span>
            </span>
            <ChevronDown
              className={`w-5 h-5 text-[#8A7D6E] transition-transform duration-300 ${
                openSections.desc ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.desc && (
            <div className="px-5 pb-5 pt-1 border-t border-[#EFE9DF] text-xs sm:text-sm text-[#473E35] leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          )}
        </div>
      )}

      {/* 3. Care Instructions */}
      {product.careInstructions && (
        <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection('care')}
            className="w-full px-5 py-4 flex items-center justify-between font-display font-bold text-base sm:text-lg text-[#1E1A17] hover:bg-[#F5EFE6] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#BA9541]" />
              <span>Care & Maintenance Guide</span>
            </span>
            <ChevronDown
              className={`w-5 h-5 text-[#8A7D6E] transition-transform duration-300 ${
                openSections.care ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.care && (
            <div className="px-5 pb-5 pt-2 border-t border-[#EFE9DF] text-xs sm:text-sm text-[#473E35] space-y-2">
              <p className="leading-relaxed">{product.careInstructions}</p>
              <ul className="space-y-1.5 pt-2 text-[#5E5245]">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#BA9541] shrink-0 mt-0.5" />
                  <span>Always apply perfumes and hairsprays before putting on your jewellery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#BA9541] shrink-0 mt-0.5" />
                  <span>Store each piece separately in an airtight zip pouch or velvet box.</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 4. Shipping & Returns */}
      <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection('shipping')}
          className="w-full px-5 py-4 flex items-center justify-between font-display font-bold text-base sm:text-lg text-[#1E1A17] hover:bg-[#F5EFE6] transition-colors"
        >
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#BA9541]" />
            <span>Shipping, Transit Insurance & Returns</span>
          </span>
          <ChevronDown
            className={`w-5 h-5 text-[#8A7D6E] transition-transform duration-300 ${
              openSections.shipping ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.shipping && (
          <div className="px-5 pb-5 pt-2 border-t border-[#EFE9DF] text-xs sm:text-sm text-[#473E35] space-y-3">
            <div className="flex items-start gap-2.5">
              <Truck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#1E1A17]">Express Nationwide Shipping</strong>
                <span>Dispatched within 24 hours. Transit takes 3-5 business days across all Indian pincodes via BlueDart, Delhivery & XpressBees.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <RotateCcw className="w-5 h-5 text-[#BA9541] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#1E1A17]">7-Day Easy Replacement</strong>
                <span>If your piece arrives defective or damaged in transit, we provide immediate doorstep replacement.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Frequently Asked Questions */}
      <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection('faq')}
          className="w-full px-5 py-4 flex items-center justify-between font-display font-bold text-base sm:text-lg text-[#1E1A17] hover:bg-[#F5EFE6] transition-colors"
        >
          <span className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#BA9541]" />
            <span>Frequently Asked Questions</span>
          </span>
          <ChevronDown
            className={`w-5 h-5 text-[#8A7D6E] transition-transform duration-300 ${
              openSections.faq ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.faq && (
          <div className="px-5 pb-5 pt-2 border-t border-[#EFE9DF] space-y-3.5">
            {faqs.map((faq, idx) => (
              <div key={idx} className="space-y-1">
                <h5 className="font-semibold text-xs sm:text-sm text-[#1E1A17]">{faq.q}</h5>
                <p className="text-xs text-[#5C5144] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
