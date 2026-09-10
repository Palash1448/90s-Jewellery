import React from 'react';
import { ProductForm } from '../../components/admin/ProductForm';
import { createProduct } from '../../services/productService';
import type { Product } from '../../types';

export const AdminAddProduct: React.FC = () => {
  const handleCreateProduct = async (
    data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Product> => {
    return await createProduct(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1E1A17]">
          Add New Product
        </h2>
        <p className="text-xs text-[#73685C]">
          Configure pricing, specifications, and upload images to Firebase Storage.
        </p>
      </div>

      <ProductForm onSubmit={handleCreateProduct} isEditing={false} />
    </div>
  );
};
