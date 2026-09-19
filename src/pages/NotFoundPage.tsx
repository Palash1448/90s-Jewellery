import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, MessageCircle } from 'lucide-react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { SeoMeta } from '../components/common/SeoMeta';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <SeoMeta title="Page Not Found | 90s chya athavani Jewellery" />
      <Header />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-16 flex items-center justify-center text-center">
        <div className="bg-white rounded-3xl p-8 border border-[#E8E2D8] shadow-lg space-y-4 w-full">
          <div className="w-16 h-16 rounded-full bg-[#FAF3E0] text-[#BA9541] flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8" />
          </div>
          <h1 className="font-display font-bold text-3xl text-[#1E1A17]">
            404 - Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[#73685C] leading-relaxed">
            The page or product link you requested is not available. Explore our latest luxury collections or get in touch with our WhatsApp team.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Link
              to="/"
              className="w-full sm:w-auto bg-[#1E1A17] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
            >
              Browse Catalogue
            </Link>
            <a
              href="https://wa.me/917507629997"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#25D366] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Support</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
