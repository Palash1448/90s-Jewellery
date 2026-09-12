import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, ShieldAlert, ArrowLeft, MessageCircle } from 'lucide-react';
import { useProduct } from '../hooks/useProduct';
import { Header } from '../components/common/Header';
import { ProductPageSkeleton } from '../components/common/LoadingSkeleton';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductHero } from '../components/product/ProductHero';
import { StickyMobileCTA } from '../components/product/StickyMobileCTA';
import { SeoMeta } from '../components/common/SeoMeta';

export const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { product, loading, error } = useProduct(slug);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
        <Header />
        <main className="flex-1">
          <ProductPageSkeleton />
        </main>
      </div>
    );
  }

  // 1. Not Found State
  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
        <SeoMeta title="Product Not Found | 90s chya athavani Jewellery" />
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl border border-[#E8E2D8] shadow-lg space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF3E0] text-[#BA9541] flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="font-display font-bold text-2xl text-[#1E1A17]">
              Product Not Found
            </h1>
            <p className="text-xs sm:text-sm text-[#73685C] leading-relaxed">
              The jewellery piece you are looking for does not exist or the link may have expired.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <Link
                to="/"
                className="w-full sm:w-auto bg-[#1E1A17] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
              >
                Browse Catalogue
              </Link>
              <a
                href="https://wa.me/919876543210?text=Hi,%20I%20am%20looking%20for%20a%20product%20link."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-[#25D366] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp Help</span>
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 2. Inactive State
  if (product.status === 'inactive') {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
        <SeoMeta product={product} />
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl border border-amber-200 shadow-lg space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="font-display font-bold text-2xl text-[#1E1A17]">
              Currently Unavailable
            </h1>
            <p className="text-xs sm:text-sm text-[#73685C] leading-relaxed">
              <strong>{product.name}</strong> is temporarily unavailable in our warehouse. Please contact us on WhatsApp to check when it will be back in stock.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/919876543210?text=Hi,%20is%20${encodeURIComponent(product.name)}%20available%20soon?`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20be5a] text-white px-6 py-3 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col pb-mobile-cta">
      {/* Inject dynamic SEO and OpenGraph tags for WhatsApp */}
      <SeoMeta product={product} />

      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8 lg:py-10">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between text-xs text-[#8A7D6E] mb-6">
          <Link to="/" className="hover:text-[#1E1A17] flex items-center gap-1 font-medium transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Catalogue</span>
            <span className="text-[#C8BEAD]">/</span>
            <span className="text-[#1E1A17] font-semibold">{product.category}</span>
          </Link>
        </div>

        {/* Above The Fold Hero: Gallery + Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <ProductGallery product={product} />
          <ProductHero product={product} />
        </div>
      </main>

      {/* Sticky Mobile Bottom CTA Bar */}
      <StickyMobileCTA product={product} />
    </div>
  );
};
