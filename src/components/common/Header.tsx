import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MessageCircle, ShieldCheck, Truck, Lock } from 'lucide-react';
import { getStoreSettings } from '../../services/settingsService';
import type { StoreSettings } from '../../types';

export const Header: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    getStoreSettings().then(setSettings);
  }, []);

  const brandName = settings?.brandName || import.meta.env.VITE_BRAND_NAME || '90s chya athavani Jewellery';
  const whatsappNumber = settings?.whatsappNumber || import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/98 backdrop-blur-md border-b border-[#E8E2D8] transition-all">
      {/* Top micro-announcement bar */}
      <div className="bg-[#1E1A17] text-[#FAF8F5] text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 font-medium">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 truncate">
            <span className="flex items-center gap-1 text-[#D4AF37] truncate">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Free Shipping on All Orders</span>
            </span>
            <span className="hidden md:inline text-white/40">|</span>
            <span className="hidden md:flex items-center gap-1 text-white/80 shrink-0">
              <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>3-5 Days All-India Delivery</span>
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden xs:flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Authentic</span>
            </span>
            <Link
              to="/admin"
              className="text-white/60 hover:text-[#D4AF37] flex items-center gap-1 transition-colors"
              title="Admin Portal"
            >
              <Lock className="w-3 h-3" />
              <span className="text-[11px]">Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Brand Navigation Bar */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#947127] to-[#D4AF37] flex items-center justify-center text-white font-serif font-bold text-sm sm:text-base shadow-xs group-hover:scale-105 transition-transform shrink-0">
            90s
          </div>
          <div className="min-w-0">
            <span className="font-display font-bold text-base sm:text-xl tracking-wider text-[#1E1A17] uppercase block truncate">
              {brandName}
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-widest text-[#BA9541] uppercase font-semibold -mt-0.5 block truncate">
              Luxury Fashion Jewellery
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(brandName)},%20I%20have%20an%20inquiry.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-semibold py-1.5 sm:py-2 px-3 sm:px-4 rounded-full transition-all shadow-xs active:scale-95 shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-current shrink-0" />
            <span className="hidden sm:inline">WhatsApp Help</span>
            <span className="sm:hidden">Help</span>
          </a>
        </div>
      </div>
    </header>
  );
};
