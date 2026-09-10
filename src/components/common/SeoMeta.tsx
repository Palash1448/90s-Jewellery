import React, { useEffect } from 'react';
import type { Product } from '../../types';

interface SeoMetaProps {
  title?: string;
  description?: string;
  image?: string;
  product?: Product;
}

export const SeoMeta: React.FC<SeoMetaProps> = ({ title, description, image, product }) => {
  useEffect(() => {
    const defaultBrand = import.meta.env.VITE_BRAND_NAME || '90s chya athavani Jewellery';
    const finalTitle = product?.seoTitle || title || (product ? `${product.name} | ${defaultBrand}` : `${defaultBrand} | Indian Luxury Fashion Jewellery`);
    const finalDesc = product?.seoDescription || description || product?.shortDescription || 'Exquisite handcrafted Indian imitation jewellery. Order directly via WhatsApp.';
    const finalImage = product?.primaryImage || image || 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1000&q=85';

    document.title = finalTitle;

    // Helper to set or create meta tag
    const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('name', 'description', finalDesc);
    setMeta('property', 'og:title', finalTitle);
    setMeta('property', 'og:description', finalDesc);
    setMeta('property', 'og:image', finalImage);
    setMeta('property', 'og:type', product ? 'og:product' : 'website');
    setMeta('property', 'og:url', window.location.href);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', finalTitle);
    setMeta('name', 'twitter:description', finalDesc);
    setMeta('name', 'twitter:image', finalImage);

    // If product, add JSON-LD Schema
    if (product) {
      const scriptId = 'product-schema-jsonld';
      let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = scriptId;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify({
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: product.name,
        image: product.images,
        description: product.shortDescription,
        sku: product.sku,
        offers: {
          '@type': 'Offer',
          url: window.location.href,
          priceCurrency: 'INR',
          price: product.price,
          availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
        },
      });
    }
  }, [title, description, image, product]);

  return null;
};
