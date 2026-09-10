import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductForm } from '../../components/admin/ProductForm';
import { getProductById, updateProduct } from '../../services/productService';
import type { Product } from '../../types';

export const AdminEditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getProductById(id).then((data) => {
        setProduct(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleUpdate = async (
    data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Product> => {
    if (!id) throw new Error('Invalid product ID');
    const updated = await updateProduct(id, data);
    alert('Product updated successfully!');
    navigate('/admin/products');
    return updated;
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-[#73685C]">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-12 text-center">
        <p className="text-sm text-rose-600 font-bold mb-3">Product not found</p>
        <button
          onClick={() => navigate('/admin/products')}
          className="text-xs bg-[#1E1A17] text-white px-4 py-2 rounded-xl"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1E1A17]">
          Edit Product: {product.name}
        </h2>
        <p className="text-xs text-[#73685C]">
          Update images, stock levels, specifications or pricing.
        </p>
      </div>

      <ProductForm initialData={product} onSubmit={handleUpdate} isEditing={true} />
    </div>
  );
};
