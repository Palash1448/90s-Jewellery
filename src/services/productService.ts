import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db, isPlaceholderConfig } from '../firebase/config';
import type { Product, ProductStatus } from '../types';
import { DEMO_PRODUCTS } from './seedService';
import { parseFirebaseDate } from '../utils/dateUtils';

const LOCAL_PRODUCTS_KEY = 'kj_local_products';

const DEPRECATED_DUMMY_IDS = new Set([
  'prod-mangalsutra-01',
  'prod-kundan-choker-02',
  'prod-temple-jhumka-03',
  'prod-rose-gold-bracelet-04',
  'prod-polki-necklace-05',
  'prod-sheeshpatti-06',
  'prod-judapin-07',
]);

function getLocalProducts(): Product[] {
  const local = localStorage.getItem(LOCAL_PRODUCTS_KEY);
  if (local) {
    try {
      const parsed: Product[] = JSON.parse(local);
      // Cleanse removed dummy products
      const cleaned = parsed.filter((p) => !DEPRECATED_DUMMY_IDS.has(p.id));
      const existingIds = new Set(cleaned.map((p) => p.id));
      const missing = DEMO_PRODUCTS.filter((p) => !existingIds.has(p.id));
      if (missing.length > 0 || cleaned.length !== parsed.length) {
        const merged = [...cleaned, ...missing];
        localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(merged));
        return merged;
      }
      return cleaned;
    } catch {
      // ignore
    }
  }
  // Initialize with DEMO_PRODUCTS
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(DEMO_PRODUCTS));
  return DEMO_PRODUCTS;
}

function saveLocalProducts(products: Product[]): void {
  const cleaned = products.filter((p) => !DEPRECATED_DUMMY_IDS.has(p.id));
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(cleaned));
}

/**
 * Generate a URL-friendly slug from string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Ensure the slug is unique across existing products
 */
export async function getUniqueSlug(baseText: string, currentProductId?: string): Promise<string> {
  let baseSlug = generateSlug(baseText) || 'jewellery-item';
  let slug = baseSlug;
  let counter = 1;

  const products = await getAllProducts();

  while (products.some((p) => p.slug === slug && p.id !== currentProductId)) {
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(mrp: number, price: number): number {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}


function normalizeProductDates(data: any, id: string): Product {
  const createdAt = parseFirebaseDate(data.createdAt).toISOString();
  const updatedAt = parseFirebaseDate(data.updatedAt).toISOString();
  return {
    ...data,
    id,
    createdAt,
    updatedAt,
  } as Product;
}

export async function getAllProducts(onlyActive = false): Promise<Product[]> {
  let list: Product[] = [];

  if (!isPlaceholderConfig) {
    try {
      const colRef = collection(db, 'products');
      const snap = await getDocs(colRef);
      list = snap.docs
        .map((d) => normalizeProductDates(d.data(), d.id))
        .filter((p) => !DEPRECATED_DUMMY_IDS.has(p.id));
      
      if (list.length > 0) {
        // Sort newest first
        list.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });

        if (onlyActive) {
          list = list.filter((p) => p.status === 'active');
        }

        saveLocalProducts(list);
        return list;
      }
    } catch (err) {
      console.warn('Firestore products fetch warning, using local cache:', err);
    }
  }

  list = getLocalProducts();
  if (onlyActive) {
    return list.filter((p) => p.status === 'active');
  }
  return list;
}

/**
 * Fetch a single product by its unique slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const cleanSlug = slug.trim().toLowerCase();

  if (!isPlaceholderConfig) {
    try {
      const colRef = collection(db, 'products');
      const q = query(colRef, where('slug', '==', cleanSlug));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const docSnap = snap.docs[0];
        return normalizeProductDates(docSnap.data(), docSnap.id);
      }
    } catch (err) {
      console.warn('Firestore getProductBySlug warning:', err);
    }
  }

  const localList = getLocalProducts();
  const match = localList.find((p) => p.slug.toLowerCase() === cleanSlug);
  return match || null;
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  if (!isPlaceholderConfig) {
    try {
      const docRef = doc(db, 'products', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return normalizeProductDates(snap.data(), snap.id);
      }
    } catch (err) {
      console.warn('Firestore getProductById warning:', err);
    }
  }

  const localList = getLocalProducts();
  return localList.find((p) => p.id === id) || null;
}

/**
 * Create a new product
 */
export async function createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  const finalSlug = await getUniqueSlug(productData.slug || productData.name);
  const discount = calculateDiscount(productData.mrp, productData.price);

  const newProduct: Product = {
    ...productData,
    id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    slug: finalSlug,
    discountPercentage: discount,
    primaryImage: productData.primaryImage || (productData.images && productData.images[0]) || '',
    images: productData.images || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 1. Save to Local Cache
  const list = getLocalProducts();
  list.unshift(newProduct);
  saveLocalProducts(list);

  // 2. Save to Firestore
  if (!isPlaceholderConfig) {
    try {
      const docRef = doc(db, 'products', newProduct.id);
      await setDoc(docRef, {
        ...newProduct,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Failed to create product in Firestore:', err);
    }
  }

  return newProduct;
}

/**
 * Update an existing product
 */
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const current = await getProductById(id);
  if (!current) {
    throw new Error(`Product with ID ${id} not found.`);
  }

  let finalSlug = current.slug;
  if (updates.slug && updates.slug !== current.slug) {
    finalSlug = await getUniqueSlug(updates.slug, id);
  } else if (updates.name && !updates.slug && updates.name !== current.name) {
    // If name changed without explicit slug, keep existing or generate
  }

  const price = updates.price !== undefined ? updates.price : current.price;
  const mrp = updates.mrp !== undefined ? updates.mrp : current.mrp;
  const discount = calculateDiscount(mrp, price);

  const updated: Product = {
    ...current,
    ...updates,
    slug: finalSlug,
    discountPercentage: discount,
    primaryImage: updates.primaryImage || updates.images?.[0] || current.primaryImage,
    updatedAt: new Date().toISOString(),
  };

  // 1. Update Local Cache
  const list = getLocalProducts();
  const index = list.findIndex((p) => p.id === id);
  if (index !== -1) {
    list[index] = updated;
    saveLocalProducts(list);
  }

  // 2. Update Firestore
  if (!isPlaceholderConfig) {
    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, {
        ...updates,
        slug: finalSlug,
        discountPercentage: discount,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Failed to update product in Firestore:', err);
    }
  }

  return updated;
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<boolean> {
  // 1. Remove from Local Cache
  const list = getLocalProducts();
  const filtered = list.filter((p) => p.id !== id);
  saveLocalProducts(filtered);

  // 2. Remove from Firestore
  if (!isPlaceholderConfig) {
    try {
      const docRef = doc(db, 'products', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error('Failed to delete product in Firestore:', err);
    }
  }

  return true;
}

/**
 * Duplicate a product
 */
export async function duplicateProduct(id: string): Promise<Product> {
  const current = await getProductById(id);
  if (!current) throw new Error('Product not found to duplicate.');

  const duplicatedData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
    ...current,
    name: `${current.name} (Copy)`,
    sku: `${current.sku}-COPY`,
    slug: `${current.slug}-copy`,
  };

  return await createProduct(duplicatedData);
}

/**
 * Update stock and status atomically
 */
export async function updateProductStock(id: string, quantityToDeduct: number): Promise<Product> {
  const product = await getProductById(id);
  if (!product) throw new Error('Product not found.');

  const newStock = Math.max(0, product.stock - quantityToDeduct);
  const newStatus: ProductStatus = newStock === 0 ? 'out_of_stock' : product.status;

  return await updateProduct(id, { stock: newStock, status: newStatus });
}

/**
 * Seed initial products if catalog is empty
 */
export async function seedInitialProducts(): Promise<void> {
  try {
    if (!isPlaceholderConfig) {
      const colRef = collection(db, 'products');
      const snap = await getDocs(colRef);
      // Clean up any deprecated dummy products from Firestore
      for (const d of snap.docs) {
        if (DEPRECATED_DUMMY_IDS.has(d.id)) {
          try {
            await deleteDoc(doc(db, 'products', d.id));
          } catch {
            // ignore
          }
        }
      }

      const activeDocs = snap.docs.filter((d) => !DEPRECATED_DUMMY_IDS.has(d.id));
      if (activeDocs.length === 0) {
        for (const p of DEMO_PRODUCTS) {
          const docRef = doc(db, 'products', p.id);
          await setDoc(docRef, p);
        }
        saveLocalProducts(DEMO_PRODUCTS);
        return;
      }
    }
  } catch (err) {
    console.warn('Seed initial products warning:', err);
  }

  const existing = await getAllProducts();
  if (existing.length === 0) {
    saveLocalProducts(DEMO_PRODUCTS);
  }
}
