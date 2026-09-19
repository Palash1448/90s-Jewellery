import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, RotateCcw, HeartHandshake, PhoneCall, Mail, MessageCircle } from 'lucide-react';
import { getStoreSettings } from '../../services/settingsService';
import type { StoreSettings } from '../../types';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    getStoreSettings().then(setSettings);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
      }
    };
    if (activeModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModal]);

  const brandName = settings?.brandName || import.meta.env.VITE_BRAND_NAME || '90s chya athavani Jewellery';

  return (
    <footer className="bg-[#191512] text-[#E8E2D8] border-t border-[#342D26] mt-16 pt-12 pb-20 sm:pb-12">
      {/* Trust Badges Bar */}
      <div className="max-w-6xl mx-auto px-4 pb-10 border-b border-[#2C251F]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#27211C] flex items-center justify-center text-[#D4AF37] mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-sm text-[#FAF8F5]">Premium Quality</h4>
            <p className="text-xs text-[#A89F95] mt-1">24K Micro Gold & Anti-Tarnish Finish</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#27211C] flex items-center justify-center text-[#D4AF37] mb-3">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-sm text-[#FAF8F5]">Free Shipping</h4>
            <p className="text-xs text-[#A89F95] mt-1">Insured 3-5 days delivery across India</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#27211C] flex items-center justify-center text-[#D4AF37] mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-sm text-[#FAF8F5]">7-Day Replacement</h4>
            <p className="text-xs text-[#A89F95] mt-1">Hassle-free guarantee for transit damage</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#27211C] flex items-center justify-center text-[#D4AF37] mb-3">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-sm text-[#FAF8F5]">100% Handcrafted</h4>
            <p className="text-xs text-[#A89F95] mt-1">Made by master artisans in India</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div>
          <h3 className="font-display font-bold text-lg text-[#FAF8F5] mb-2">{brandName}</h3>
          <p className="text-xs text-[#A89F95] leading-relaxed">
            Crafting magnificent imitation jewellery designed for Indian weddings, festive celebrations, and contemporary elegance. Direct ordering via WhatsApp automation.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-[#FAF8F5] mb-3 uppercase tracking-wider text-xs">Customer Policies</h4>
          <ul className="space-y-2 text-xs text-[#C2B7A8]">
            <li>
              <button onClick={() => setActiveModal('shipping')} className="hover:text-[#D4AF37] transition-colors underline-offset-4 hover:underline">
                Shipping & Delivery Policy
              </button>
            </li>
            <li>
              <button onClick={() => setActiveModal('returns')} className="hover:text-[#D4AF37] transition-colors underline-offset-4 hover:underline">
                Return & Replacement Guarantee
              </button>
            </li>
            <li>
              <button onClick={() => setActiveModal('privacy')} className="hover:text-[#D4AF37] transition-colors underline-offset-4 hover:underline">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => setActiveModal('terms')} className="hover:text-[#D4AF37] transition-colors underline-offset-4 hover:underline">
                Terms of Service
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-[#FAF8F5] mb-3 uppercase tracking-wider text-xs">WhatsApp & Support</h4>
          <div className="space-y-2 text-xs text-[#C2B7A8]">
            <p className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp: +{settings?.whatsappNumber || '91 7507629997'}</span>
            </p>
            <p className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
              <span>Helpline: {settings?.contactNumber || '+91 75076 29997'}</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#D4AF37]" />
              <span>Email: {settings?.email || 'orders@90schyaathavanijewellery.com'}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6 border-t border-[#2C251F] text-center text-xs text-[#7A7167]">
        © {new Date().getFullYear()} {brandName}. Handcrafted in India. All Rights Reserved.
      </div>

      {/* Policy Modal */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-[#FAF8F5] text-[#1E1A17] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-[#D4AF37]/30 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl font-bold w-8 h-8 rounded-full bg-[#EAE4D9] flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
            <h3 className="font-display font-bold text-xl text-[#1E1A17] mb-4 capitalize">
              {activeModal === 'shipping' && 'Shipping & Delivery Policy'}
              {activeModal === 'returns' && 'Return & Replacement Policy'}
              {activeModal === 'privacy' && 'Privacy Policy'}
              {activeModal === 'terms' && 'Terms & Conditions'}
            </h3>
            <div className="text-xs text-[#4A4036] leading-relaxed max-h-80 overflow-y-auto pr-2 space-y-3">
              {activeModal === 'shipping' && (settings?.shippingPolicy || 'We dispatch within 24 hours. Transit takes 3-5 days across India.')}
              {activeModal === 'returns' && (settings?.returnPolicy || '7-day replacement for defective or damaged items upon unboxing video.')}
              {activeModal === 'privacy' && (settings?.privacyPolicy || 'Your personal data is encrypted and used only for WhatsApp delivery updates.')}
              {activeModal === 'terms' && (settings?.termsConditions || 'All items are high quality imitation fashion jewellery. Prices include GST.')}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
