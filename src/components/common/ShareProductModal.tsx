import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  MessageCircle,
  X,
  Sparkles,
  Send,
  Mail,
  ExternalLink,
  QrCode
} from 'lucide-react';
import type { Product } from '../../types';

interface ShareProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareProductModal: React.FC<ShareProductModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const productUrl = `${window.location.origin}/p/${product.slug}`;
  const brandName = import.meta.env.VITE_BRAND_NAME || '90s chya athavani Jewellery';

  const shareText = `✨ Check out *${product.name}* on ${brandName}! \n\n💰 Price: ₹${product.price.toLocaleString('en-IN')}${product.mrp > product.price ? ` (MRP: ₹${product.mrp.toLocaleString('en-IN')}, ${product.discountPercentage}% OFF)` : ''} \n📦 Fast All-India Insured Delivery\n\n👉 Order here: ${productUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = productUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} | ${brandName}`,
          text: `Check out ${product.name} for ₹${product.price} on ${brandName}`,
          url: productUrl,
        });
      } catch (err) {
        console.log('User cancelled or share error', err);
      }
    }
  };

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`;
  const emailShareUrl = `mailto:?subject=${encodeURIComponent(`Check out ${product.name} on ${brandName}`)}&body=${encodeURIComponent(shareText)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(productUrl)}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-[#FAF8F5] text-[#1E1A17] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative border border-[#D4AF37]/40 space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8C8072] hover:text-[#1E1A17] w-8 h-8 rounded-full bg-[#EFE9DF] hover:bg-[#E2D8C8] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#947127] to-[#D4AF37] flex items-center justify-center text-white shadow-md shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-[#1E1A17]">
              Share Product Link
            </h3>
            <p className="text-xs text-[#7A6F62]">
              Share this handcrafted jewellery piece with friends or family
            </p>
          </div>
        </div>

        {/* Product Snapshot Mini-Card */}
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-[#E8DCBE] shadow-xs">
          <img
            src={product.primaryImage || (product.images && product.images[0]) || ''}
            alt={product.name}
            className="w-14 h-14 rounded-xl object-cover border border-[#E0D8C8] shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-xs sm:text-sm text-[#1E1A17] truncate">
              {product.name}
            </h4>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-bold text-sm text-[#805E25]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.price && (
                <span className="text-[11px] text-[#8C8072] line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
              {product.discountPercentage > 0 && (
                <span className="text-[10px] font-bold text-[#8C2D3B] bg-[#FAF0F2] px-1.5 py-0.2 rounded">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 1-Click WhatsApp Share Button (Primary) */}
        <a
          href={whatsappShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20be5a] text-white py-3.5 px-4 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span>Share on WhatsApp</span>
        </a>

        {/* Link Copy Box */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-[#73685C] uppercase tracking-wider">
            Direct Product Link:
          </label>
          <div className="flex items-center rounded-xl bg-white border border-[#D9CFBE] p-1.5 shadow-2xs">
            <input
              type="text"
              readOnly
              value={productUrl}
              className="flex-1 bg-transparent px-2.5 text-xs text-[#1E1A17] font-mono outline-none truncate"
            />
            <button
              onClick={handleCopyLink}
              id="copy-product-link-btn"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#1E1A17] hover:bg-black text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Secondary Sharing Channels */}
        <div className="space-y-2 pt-1">
          <span className="block text-[11px] font-bold text-[#73685C] uppercase tracking-wider">
            More Options:
          </span>
          <div className="grid grid-cols-3 gap-2">
            {/* Telegram */}
            <a
              href={telegramShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white border border-[#E0D8C8] hover:border-[#229ED9] hover:bg-[#F0F8FC] text-[#332B24] transition-colors"
            >
              <Send className="w-4 h-4 text-[#229ED9]" />
              <span className="text-[11px] font-semibold">Telegram</span>
            </a>

            {/* Email */}
            <a
              href={emailShareUrl}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white border border-[#E0D8C8] hover:border-[#D4AF37] hover:bg-[#FAF6EE] text-[#332B24] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#BA9541]" />
              <span className="text-[11px] font-semibold">Email</span>
            </a>

            {/* QR Code Toggle */}
            <button
              onClick={() => setShowQr(!showQr)}
              className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border transition-colors cursor-pointer ${
                showQr
                  ? 'bg-[#FAF3E0] border-[#BA9541] text-[#785718]'
                  : 'bg-white border-[#E0D8C8] hover:bg-[#FAF8F5] text-[#332B24]'
              }`}
            >
              <QrCode className="w-4 h-4 text-[#8C7549]" />
              <span className="text-[11px] font-semibold">QR Code</span>
            </button>
          </div>
        </div>

        {/* Mobile Native Share Button (if supported) */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="w-full py-2.5 px-4 rounded-xl border border-[#D9CFBE] bg-white hover:bg-[#F5EFE6] text-xs font-bold text-[#1E1A17] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#BA9541]" />
            <span>Open System Share Menu</span>
          </button>
        )}

        {/* QR Code Drawer */}
        {showQr && (
          <div className="p-4 rounded-2xl bg-white border border-[#D9CFBE] text-center space-y-2 animate-in fade-in duration-200">
            <p className="text-[11px] font-bold text-[#73685C] uppercase tracking-wider">
              Scan to open product directly
            </p>
            <div className="p-2 bg-white rounded-xl inline-block border border-gray-100 shadow-inner">
              <img
                src={qrCodeUrl}
                alt="Product QR Code"
                className="w-36 h-36 mx-auto object-contain"
              />
            </div>
            <p className="text-[10px] text-[#8C8072]">
              Point your smartphone camera to immediately open this product page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
