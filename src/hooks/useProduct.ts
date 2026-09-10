import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../types';
import { getProductBySlug } from '../services/productService';

export function useProduct(slug?: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getProductBySlug(slug);
      if (!data) {
        setError('Product not found');
        setProduct(null);
      } else {
        setProduct(data);
      }
    } catch (err: any) {
      console.error('Error loading product:', err);
      setError(err?.message || 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
}
