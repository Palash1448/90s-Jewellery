import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Save,
  ArrowLeft,
  Sparkles,
  Link as LinkIcon,
  Tag,
  DollarSign,
  PackageCheck,
  Search,
  CheckCircle,
  Copy
} from 'lucide-react';
import type { Product, ProductStatus } from '../../types';
import { generateSlug, calculateDiscount, getUniqueSlug } from '../../services/productService';
import { ImageUploader } from './ImageUploader';

interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
  isEditing?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  isEditing = false,
}) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form State
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [isCustomSlug, setIsCustomSlug] = useState(Boolean(initialData?.slug));
  const [sku, setSku] = useState(initialData?.sku || '');
  const [category, setCategory] = useState(initialData?.category || 'Mangalsutra');
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || '');
  const [description, setDescription] = useState(initialData?.description || '');

  // Pricing
  const [mrp, setMrp] = useState<number>(initialData?.mrp || 1999);
  const [price, setPrice] = useState<number>(initialData?.price || 799);
  const [shippingCharge, setShippingCharge] = useState<number>(initialData?.shippingCharge || 0);

  // Details
  const [material, setMaterial] = useState(initialData?.material || 'Premium Brass Alloy with 24K Micro Gold Plating');
  const [finish, setFinish] = useState(initialData?.finish || 'High Lustre Gold Polish with Anti-Tarnish Coat');
  const [color, setColor] = useState(initialData?.color || 'Yellow Gold');
  const [size, setSize] = useState(initialData?.size || 'Standard Fit');
  const [weight, setWeight] = useState(initialData?.weight || '25 grams');
  const [occasion, setOccasion] = useState(initialData?.occasion || 'Festive, Wedding, Daily Wear');
  const [packageContents, setPackageContents] = useState(initialData?.packageContents || '1 x Jewellery Piece, 1 x Velvet Box');
  const [careInstructions, setCareInstructions] = useState(
    initialData?.careInstructions || 'Keep away from moisture, perfumes and alcohol sprays. Store in airtight velvet box.'
  );

  // Images
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [primaryImage, setPrimaryImage] = useState<string>(initialData?.primaryImage || '');

  // Inventory
  const [stock, setStock] = useState<number>(initialData?.stock ?? 25);
  const [status, setStatus] = useState<ProductStatus>(initialData?.status || 'active');

  // SEO
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || '');

  // Automatically update slug when name changes (unless user manually touched slug)
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isCustomSlug && !isEditing) {
      const generated = generateSlug(val);
      setSlug(generated);
      const brandName = import.meta.env.VITE_BRAND_NAME || '90s chya athavani Jewellery';
      if (!seoTitle) setSeoTitle(`${val} | ${brandName}`);
    }
  };

  const discountPercentage = calculateDiscount(mrp, price);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Product name is required.');
      return;
    }

    if (!price || price <= 0) {
      alert('Valid selling price is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const finalSlug = slug.trim() ? generateSlug(slug) : generateSlug(name);

      const productPayload: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
        name: name.trim(),
        slug: finalSlug,
        sku: sku.trim() || `KJ-${Date.now().toString().slice(-4)}`,
        category,
        shortDescription: shortDescription.trim() || name.trim(),
        description: description.trim(),
        mrp: Number(mrp),
        price: Number(price),
        discountPercentage,
        shippingCharge: Number(shippingCharge),
        material,
        finish,
        color,
        size,
        weight,
        occasion,
        packageContents,
        careInstructions,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1000&q=85'],
        primaryImage: primaryImage || images[0] || 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1000&q=85',
        stock: Number(stock),
        status: Number(stock) === 0 ? 'out_of_stock' : status,
        seoTitle: seoTitle.trim() || `${name} | 90s chya athavani Jewellery`,
        seoDescription: seoDescription.trim() || shortDescription.trim(),
      };

      const saved = await onSubmit(productPayload);
      setCreatedProduct(saved);
    } catch (err: any) {
      alert(`Error saving product: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const productUrl = createdProduct
    ? `${window.location.origin}/p/${createdProduct.slug}`
    : '';

  const copyProductLink = () => {
    if (productUrl) {
      navigator.clipboard.writeText(productUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // If newly created, show Requirement 6 "Product Created Successfully" modal card
  if (createdProduct && !isEditing) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-emerald-300 shadow-xl text-center space-y-5 animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8" />
        </div>

        <div>
          <h2 className="font-display font-bold text-2xl text-[#1E1A17]">
            Product Created Successfully!
          </h2>
          <p className="text-xs text-[#73685C] mt-1">
            Your unique product automation landing link is ready for WhatsApp marketing.
          </p>
        </div>

        {/* URL Box */}
        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] text-left space-y-2">
          <span className="text-[11px] font-bold text-[#8A7D6E] uppercase tracking-wider block">
            Product URL:
          </span>
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-white border border-[#D9CFBE] font-mono text-xs text-[#1E1A17] break-all">
            <span>{productUrl}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={copyProductLink}
            id="product-created-copy-btn"
            className="flex items-center gap-2 bg-[#1E1A17] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow"
          >
            <Copy className="w-4 h-4 text-[#D4AF37]" />
            <span>{copiedLink ? '✓ Copied to Clipboard!' : 'Copy Link'}</span>
          </button>

          <a
            href={`/p/${createdProduct.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gold-gradient text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow hover:opacity-95"
          >
            <LinkIcon className="w-4 h-4" />
            <span>Open Product Page</span>
          </a>

          <a
            href={`https://wa.me/?text=Check%20out%20${encodeURIComponent(createdProduct.name)}%20(₹${createdProduct.price})%20on%2090s%20chya%20athavani%20Jewellery:%20${encodeURIComponent(productUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20be5a] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow"
          >
            <span>Share on WhatsApp</span>
          </a>
        </div>

        <div className="pt-4 border-t border-[#EFE9DF] flex justify-between">
          <button
            onClick={() => {
              setCreatedProduct(null);
              setName('');
              setSlug('');
            }}
            className="text-xs font-bold text-[#805E25] hover:underline"
          >
            + Create Another Product
          </button>

          <button
            onClick={() => navigate('/admin/products')}
            className="text-xs font-bold text-[#1E1A17] hover:underline"
          >
            View All Products →
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="flex items-center gap-1 text-xs font-bold text-[#73685C] hover:text-[#1E1A17] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          id="product-form-save-btn"
          className="flex items-center gap-2 bg-[#1E1A17] hover:bg-black text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
        >
          <Save className="w-4 h-4 text-[#D4AF37]" />
          <span>{isSubmitting ? 'Saving Product...' : isEditing ? 'Update Product' : 'Save & Publish Product'}</span>
        </button>
      </div>

      {/* 1. Basic Information */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8E2D8] shadow-sm space-y-4">
        <h3 className="font-display font-bold text-base sm:text-lg text-[#1E1A17] pb-3 border-b border-[#EFE9DF]">
          1. Basic Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider mb-1.5">
              Product Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Classic 24K Gold-Plated Mangalsutra"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-sm font-medium text-[#1E1A17] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider mb-1.5">
              SKU (Stock Keeping Unit)
            </label>
            <input
              type="text"
              placeholder="e.g. KJ-MS-001"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-sm text-[#1E1A17] font-mono focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider">
                Product Category
              </label>
              <span className="text-[11px] text-[#BA9541] font-semibold">Includes Hair & Jewellery</span>
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-sm text-[#1E1A17] focus:outline-none"
            >
              <optgroup label="✨ Hair Products & Accessories">
                <option value="Hair Accessories">Hair Accessories (General)</option>
                <option value="Hair Jewellery & Judapin">Hair Jewellery & Juda Pins</option>
                <option value="Mathapatti & Sheeshpatti">Mathapatti & Sheeshpatti</option>
                <option value="Maang Tikka & Hair Chains">Maang Tikka & Hair Chains</option>
                <option value="Hair Extensions & Care">Hair Extensions & Care</option>
              </optgroup>
              <optgroup label="💎 Traditional & Luxury Jewellery">
                <option value="Mangalsutra">Mangalsutra</option>
                <option value="Necklace Sets">Necklace Sets / Chokers</option>
                <option value="Earrings">Earrings / Jhumkas</option>
                <option value="Bracelets & Kadas">Bracelets & Kadas</option>
                <option value="Bridal Jewellery">Bridal Jewellery</option>
                <option value="Rings">Finger Rings</option>
                <option value="Anklets">Payal / Anklets</option>
              </optgroup>
              <optgroup label="⚙️ Custom">
                <option value="Other / Custom">Other / Custom Category...</option>
              </optgroup>
            </select>

            {category === 'Other / Custom' && (
              <input
                type="text"
                placeholder="Type your custom category name..."
                onChange={(e) => setCategory(e.target.value || 'Other / Custom')}
                className="mt-2 w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#BA9541] rounded-xl text-xs text-[#1E1A17] focus:outline-none"
              />
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider mb-1.5">
              Short Description (Above the fold teaser)
            </label>
            <textarea
              rows={2}
              placeholder="Brief 1-2 sentence luxury summary for fast reading..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-sm text-[#1E1A17] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider mb-1.5">
              Full Craftsmanship Description
            </label>
            <textarea
              rows={4}
              placeholder="Comprehensive details regarding the artisan inspiration, materials, gemstone settings, and styling advice..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-sm text-[#1E1A17] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Pricing & Financials */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8E2D8] shadow-sm space-y-4">
        <h3 className="font-display font-bold text-base sm:text-lg text-[#1E1A17] pb-3 border-b border-[#EFE9DF]">
          2. Pricing & Discounts
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider mb-1.5">
              MRP (Original Price ₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              required
              placeholder="2499"
              value={mrp}
              onChange={(e) => setMrp(Number(e.target.value))}
              className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-sm font-bold text-[#1E1A17] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider mb-1.5">
              Selling Price (Offer Price ₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              required
              placeholder="899"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-sm font-bold text-[#1E1A17] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider mb-1.5">
              Shipping Charge (₹)
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={shippingCharge}
              onChange={(e) => setShippingCharge(Number(e.target.value))}
              className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-sm font-medium text-[#1E1A17] focus:outline-none"
            />
          </div>
        </div>

        {/* Live Calculated Discount Preview */}
        <div className="p-3.5 rounded-xl bg-[#FAF3E0] border border-[#E8DCBE] flex items-center justify-between text-xs text-[#805E25]">
          <span>
            Calculated Savings: <strong>₹{Math.max(0, mrp - price).toLocaleString('en-IN')}</strong>
          </span>
          <span className="font-bold bg-[#8C2D3B] text-white px-2.5 py-0.5 rounded shadow-xs">
            {discountPercentage}% DISCOUNT
          </span>
        </div>
      </div>

      {/* 3. Images (Firebase Storage) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8E2D8] shadow-sm space-y-4">
        <h3 className="font-display font-bold text-base sm:text-lg text-[#1E1A17] pb-3 border-b border-[#EFE9DF]">
          3. Product Photography (Firebase Storage)
        </h3>
        <ImageUploader
          images={images}
          primaryImage={primaryImage}
          slug={slug || 'product'}
          onChange={(newImages, newPrimary) => {
            setImages(newImages);
            setPrimaryImage(newPrimary);
          }}
        />
      </div>

      {/* 4. Product Details & Specs */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8E2D8] shadow-sm space-y-4">
        <h3 className="font-display font-bold text-base sm:text-lg text-[#1E1A17] pb-3 border-b border-[#EFE9DF]">
          4. Technical Specifications
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-[#3B3229] uppercase mb-1">Base Material</label>
            <input
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9CFBE] rounded-xl text-[#1E1A17]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#3B3229] uppercase mb-1">Polish / Plating</label>
            <input
              type="text"
              value={finish}
              onChange={(e) => setFinish(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9CFBE] rounded-xl text-[#1E1A17]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#3B3229] uppercase mb-1">Color / Stones</label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9CFBE] rounded-xl text-[#1E1A17]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#3B3229] uppercase mb-1">Size / Dimensions</label>
            <input
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9CFBE] rounded-xl text-[#1E1A17]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#3B3229] uppercase mb-1">Weight</label>
            <input
              type="text"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9CFBE] rounded-xl text-[#1E1A17]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#3B3229] uppercase mb-1">Occasion</label>
            <input
              type="text"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9CFBE] rounded-xl text-[#1E1A17]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-[#3B3229] uppercase mb-1">Package Contents</label>
            <input
              type="text"
              value={packageContents}
              onChange={(e) => setPackageContents(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9CFBE] rounded-xl text-[#1E1A17]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-[#3B3229] uppercase mb-1">Care Instructions</label>
            <textarea
              rows={2}
              value={careInstructions}
              onChange={(e) => setCareInstructions(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9CFBE] rounded-xl text-[#1E1A17]"
            />
          </div>
        </div>
      </div>

      {/* 5. Inventory & Status */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8E2D8] shadow-sm space-y-4">
        <h3 className="font-display font-bold text-base sm:text-lg text-[#1E1A17] pb-3 border-b border-[#EFE9DF]">
          5. Inventory & Visibility
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider mb-1.5">
              Available Stock Quantity <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              required
              value={stock}
              onChange={(e) => {
                const s = Number(e.target.value);
                setStock(s);
                if (s === 0) setStatus('out_of_stock');
                else if (status === 'out_of_stock') setStatus('active');
              }}
              className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-sm font-bold text-[#1E1A17] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider mb-1.5">
              Product Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProductStatus)}
              className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-sm font-medium text-[#1E1A17] focus:outline-none"
            >
              <option value="active">Active (Visible & Buyable)</option>
              <option value="inactive">Inactive (Hidden from Store)</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* 6. URL Slug & SEO (WhatsApp Sharing) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8E2D8] shadow-sm space-y-4">
        <h3 className="font-display font-bold text-base sm:text-lg text-[#1E1A17] pb-3 border-b border-[#EFE9DF]">
          6. Unique URL Slug & SEO (WhatsApp Automation)
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider mb-1.5">
              URL Slug (/p/:slug) <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center rounded-xl border border-[#D9CFBE] bg-[#FAF8F5] overflow-hidden">
              <span className="px-3 text-xs font-mono text-[#8C8072] bg-[#EFE8DC] py-3 border-r border-[#D9CFBE]">
                /p/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => {
                  setIsCustomSlug(true);
                  setSlug(e.target.value);
                }}
                className="w-full px-3 py-3 bg-transparent text-sm font-mono font-semibold text-[#1E1A17] focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-[#73685C] mt-1">
              Example: <code>{window.location.origin}/p/{slug || 'product-slug'}</code>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider mb-1.5">
                SEO & WhatsApp Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Product Name | 90s chya athavani Jewellery"
                className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D9CFBE] rounded-xl text-xs text-[#1E1A17]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider mb-1.5">
                SEO & WhatsApp Description
              </label>
              <input
                type="text"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Buy handcrafted jewellery at best price with free shipping..."
                className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D9CFBE] rounded-xl text-xs text-[#1E1A17]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Save Action */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-[#1E1A17] hover:bg-black text-white px-8 py-3.5 rounded-xl text-sm font-bold shadow-xl transition-all cursor-pointer"
        >
          <Save className="w-4 h-4 text-[#D4AF37]" />
          <span>{isSubmitting ? 'Saving Product...' : isEditing ? 'Update Product' : 'Save & Publish Product'}</span>
        </button>
      </div>
    </form>
  );
};
