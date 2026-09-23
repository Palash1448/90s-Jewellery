import type { Product } from '../types';

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'prod-hair-extension-01',
    name: 'Seamless Clip-in Natural Black Hair Extensions (7 Pieces / 120g)',
    slug: 'seamless-clip-in-hair-extensions',
    sku: '90S-HE-001',
    shortDescription: '100% natural texture premium clip-in hair extensions for instant bridal volume, extra length, and effortless styling without damage.',
    description: `Transform your hairstyle instantly with 90s chya athavani Premium Clip-in Hair Extensions. 
Crafted from ultra-soft, tangle-resistant high-temperature heat-friendly natural fibers that blend seamlessly with Indian hair textures. 
Features silicone-cushioned stainless steel snap clips that hold firmly without slipping or tugging delicate hair roots. 
Can be heat-styled, washed, and blow-dried for wedding hairstyles, traditional braids, high ponytails, and voluminous open waves.`,
    price: 999,
    mrp: 2999,
    discountPercentage: 67,
    primaryImage: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=85',
    ],
    category: 'Hair Extensions & Care',
    material: 'Heat-Resistant Premium Natural Silky Fiber / Hair Blend',
    finish: 'Natural Matte Finish (No Synthetic Shine)',
    color: 'Natural Jet Black #1B',
    size: '22 Inches Length (Set of 7 Pieces with 16 Clips)',
    weight: '120 grams',
    occasion: 'Weddings, Receptions, Parties, Festive Styling, Daily Volume',
    packageContents: '1 x 7-Piece Hair Extension Set, 2 x Replacement Snap Clips, 1 x Storage Pouch',
    careInstructions: 'Gently detangle with a wide-tooth comb before and after use. Wash with mild sulfate-free shampoo in lukewarm water. Air dry naturally.',
    stock: 25,
    shippingCharge: 0,
    status: 'active',
    seoTitle: 'Seamless Clip-in Natural Black Hair Extensions | 90s chya athavani',
    seoDescription: 'Buy premium 7-piece clip-in hair extensions at ₹999 with free delivery across India. Easy WhatsApp ordering.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
