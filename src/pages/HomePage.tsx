import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MessageCircle, ArrowRight, ShieldCheck, Star, Award, Search, ShoppingBag, Share2 } from 'lucide-react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { Badge } from '../components/common/Badge';
import { SeoMeta } from '../components/common/SeoMeta';
import { ShareProductModal } from '../components/common/ShareProductModal';
import { getAllProducts } from '../services/productService';
import type { Product } from '../types';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sharingProduct, setSharingProduct] = useState<Product | null>(null);

  useEffect(() => {
    getAllProducts(true).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const defaultCategories = [
    'All',
    'Hair Accessories',
    'Mangalsutra',
    'Necklace Sets',
    'Earrings',
    'Bracelets & Kadas',
    'Bridal Jewellery',
  ];

  // Dynamically include any new categories added via Admin/Firestore
  const categories = [
    'All',
    ...Array.from(
      new Set([
        ...defaultCategories.slice(1),
        ...products.map((p) => p.category).filter(Boolean),
      ])
    ),
  ];

  const filtered = products.filter((p) => {
    let matchesCategory = false;
    if (selectedCategory === 'All') {
      matchesCategory = true;
    } else if (selectedCategory === 'Hair Accessories') {
      matchesCategory =
        p.category === 'Hair Accessories' ||
        p.category.toLowerCase().includes('hair') ||
        p.category.toLowerCase().includes('mathapatti') ||
        p.category.toLowerCase().includes('sheeshpatti') ||
        p.category.toLowerCase().includes('juda');
    } else {
      matchesCategory = p.category === selectedCategory;
    }

    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <SeoMeta
        title="90s chya athavani Jewellery | Luxury Imitation, Bridal & Hair Accessories"
        description="Shop 24K gold plated mangalsutras, royal kundan choker sets, bridal sheeshpatti, hair accessories, and designer jewellery with direct WhatsApp ordering."
      />
      <Header />

      <main className="flex-1">
        {/* Luxury Hero Banner */}
        <section className="relative overflow-hidden bg-[#1E1A17] text-[#FAF8F5] py-14 sm:py-20 border-b border-[#D4AF37]/30">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="max-w-6xl mx-auto px-4 relative z-10 text-center space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF3E0]/10 border border-[#D4AF37]/40 text-xs font-semibold text-[#D4AF37]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Authentic Indian Heritage Jewellery • Free Shipping Across India</span>
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-[#FAF8F5] tracking-tight max-w-3xl mx-auto leading-tight">
              Elegance Crafted For Your Most Precious Moments
            </h1>

            <p className="font-serif italic text-base sm:text-xl text-[#D8CDBE] max-w-2xl mx-auto">
              24K Micro Gold Plated • Hypoallergenic • Doorstep Delivery Across India
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="#catalog"
                className="bg-gold-gradient text-white px-7 py-3.5 rounded-full font-display font-bold text-sm shadow-lg hover:opacity-95 transition-all"
              >
                Explore Catalogue
              </a>

              <a
                href="https://wa.me/919876543210?text=Hi%2090s%20chya%20athavani%20Jewellery,%20please%20share%20your%20latest%20jewellery%20catalogue."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20be5a] text-white px-6 py-3.5 rounded-full font-bold text-sm shadow transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>

        {/* Product Catalog Section */}
        <section id="catalog" className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-[#BA9541] tracking-widest uppercase block">
                Exclusive Collection
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#1E1A17]">
                Featured Jewellery & Hair Accessories
              </h2>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#8A7D6E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search mangalsutra, hair accessory, choker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-xs text-[#1E1A17] focus:outline-none shadow-xs"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#1E1A17] text-white shadow-sm'
                    : 'bg-white text-[#594E42] border border-[#E0D8C8] hover:bg-[#F5EFE6]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6 animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#E8E2D8] p-3 sm:p-4 space-y-3">
                  <div className="aspect-square bg-[#EAE3D5] rounded-xl"></div>
                  <div className="h-3.5 bg-[#EAE3D5] rounded w-3/4"></div>
                  <div className="h-3.5 bg-[#EAE3D5] rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-[#E8E2D8] p-6 sm:p-8">
              <p className="text-[#73685C] text-xs sm:text-sm">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6">
              {filtered.map((product) => {
                const img = product.primaryImage || product.images?.[0];
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl sm:rounded-2xl border border-[#E8E2D8] overflow-hidden luxury-hover-shadow flex flex-col justify-between group shadow-2xs"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-square overflow-hidden bg-[#F5EFE6] block">
                      <Link to={`/p/${product.slug}`} className="w-full h-full block">
                        <img
                          src={img}
                          alt={product.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </Link>

                      {product.discountPercentage > 0 && (
                        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#8C2D3B] text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded shadow uppercase pointer-events-none">
                          {product.discountPercentage}% OFF
                        </span>
                      )}

                      {/* Quick Share Icon Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSharingProduct(product);
                        }}
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-[#1E1A17] shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-10 cursor-pointer"
                        title="Share Product Link"
                        aria-label="Share Product Link"
                      >
                        <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#805E25]" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
                      <div>
                        <span className="text-[9px] sm:text-[11px] font-semibold text-[#8C7F70] uppercase tracking-wider block truncate">
                          {product.category}
                        </span>
                        <Link to={`/p/${product.slug}`} className="hover:text-[#BA9541] transition-colors">
                          <h3 className="font-display font-bold text-xs sm:text-base text-[#1E1A17] line-clamp-2 mt-0.5 sm:mt-1 leading-snug">
                            {product.name}
                          </h3>
                        </Link>
                      </div>

                      {/* Pricing & Buy Action */}
                      <div className="pt-2 border-t border-[#F2ECE1] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-baseline gap-1.5 sm:gap-2">
                          <span className="font-display font-bold text-sm sm:text-xl text-[#1E1A17]">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          {product.mrp > product.price && (
                            <span className="text-[10px] sm:text-xs text-[#8C8074] line-through">
                              ₹{product.mrp.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 sm:gap-1.5 w-full sm:w-auto">
                          <button
                            onClick={() => setSharingProduct(product)}
                            className="p-1.5 sm:p-2 rounded-lg bg-[#FAF3E0] hover:bg-[#F2E6CE] text-[#805E25] border border-[#E0D0B4] transition-colors shrink-0"
                            title="Share"
                          >
                            <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>

                          <Link
                            to={`/p/${product.slug}`}
                            className="flex-1 sm:flex-initial bg-[#1E1A17] hover:bg-black text-white text-[11px] sm:text-xs font-bold py-1.5 sm:py-2 px-2.5 sm:px-3.5 rounded-lg flex items-center justify-center gap-1 transition-all"
                          >
                            <span>Buy</span>
                            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37]" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Share Product Modal */}
      {sharingProduct && (
        <ShareProductModal
          product={sharingProduct}
          isOpen={Boolean(sharingProduct)}
          onClose={() => setSharingProduct(null)}
        />
      )}

      <Footer />
    </div>
  );
};
