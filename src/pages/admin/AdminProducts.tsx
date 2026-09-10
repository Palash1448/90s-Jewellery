import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Copy,
  Check,
  ExternalLink,
  Edit2,
  Trash2,
  CopyPlus,
  Power,
  PowerOff,
  Filter,
  Share2
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { ShareProductModal } from '../../components/common/ShareProductModal';
import {
  getAllProducts,
  deleteProduct,
  updateProduct,
  duplicateProduct
} from '../../services/productService';
import type { Product } from '../../types';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sharingProduct, setSharingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const list = await getAllProducts();
      setProducts(list);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCopyLink = (slug: string, id: string) => {
    const url = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleStatus = async (product: Product) => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    try {
      await updateProduct(product.id, { status: newStatus });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        alert('Failed to delete product.');
      }
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const copy = await duplicateProduct(id);
      setProducts((prev) => [copy, ...prev]);
      alert(`Product duplicated successfully! New slug: ${copy.slug}`);
    } catch (err: any) {
      alert(`Error duplicating: ${err.message}`);
    }
  };

  const filtered = products.filter((p) => {
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Mangalsutra', 'Necklace Sets', 'Earrings', 'Bracelets & Kadas', 'Bridal Jewellery'];

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1E1A17]">
            Products Catalog
          </h2>
          <p className="text-xs text-[#73685C]">
            Manage inventory, custom WhatsApp slugs & pricing ({products.length} total)
          </p>
        </div>

        <Link
          to="/admin/products/new"
          id="admin-add-product-btn"
          className="bg-[#1E1A17] hover:bg-black text-white px-5 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 self-stretch sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>+ Add Product</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E2D8] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#8C8072] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, SKU, or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-xs text-[#1E1A17] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-[#73685C] flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                categoryFilter === c
                  ? 'bg-[#BA9541] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#594E42] border border-[#E0D8C8] hover:bg-[#F2ECE1]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Products Catalog View */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#73685C]">Loading catalogue...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-[#73685C] text-sm">No products found matching your filters.</p>
            <Link
              to="/admin/products/new"
              className="inline-block bg-gold-gradient text-white font-bold text-xs px-4 py-2 rounded-xl"
            >
              Create Product
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile Cards View (Visible on < 768px) */}
            <div className="md:hidden divide-y divide-[#F2ECE1]">
              {filtered.map((prod) => {
                const img = prod.primaryImage || prod.images?.[0];
                return (
                  <div key={prod.id} className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={img}
                        alt={prod.name}
                        className="w-16 h-16 rounded-xl object-cover border border-[#E0D8C8] bg-white shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold text-[#8C7F70] uppercase">{prod.category}</span>
                        <h4 className="font-bold text-sm text-[#1E1A17] line-clamp-1">{prod.name}</h4>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="font-bold text-sm text-[#1E1A17]">₹{prod.price.toLocaleString('en-IN')}</span>
                          {prod.mrp > prod.price && (
                            <span className="text-xs text-[#8C8072] line-through">₹{prod.mrp}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge status={prod.status} />
                          <span className="text-[11px] font-semibold text-[#6E6152]">Stock: {prod.stock}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F5EFE6]">
                      <button
                        onClick={() => handleCopyLink(prod.slug, prod.id)}
                        className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#FAF3E0] text-[#805E25] font-bold text-xs flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                      >
                        {copiedId === prod.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setSharingProduct(prod)}
                        className="p-2 rounded-lg bg-[#FAF3E0] text-[#805E25] border border-[#E0D0B4] hover:bg-[#F2E6CE]"
                        title="Share Options"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      <Link
                        to={`/p/${prod.slug}`}
                        target="_blank"
                        className="p-2 rounded-lg bg-[#FAF8F5] border border-[#E8E2D8] text-[#1E1A17]"
                        title="View Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <Link
                        to={`/admin/products/${prod.id}/edit`}
                        className="p-2 rounded-lg bg-[#FAF8F5] border border-[#E8E2D8] text-[#BA9541]"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleToggleStatus(prod)}
                        className={`p-2 rounded-lg border ${
                          prod.status === 'active' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-gray-100 border-gray-200 text-gray-500'
                        }`}
                        title="Toggle Status"
                      >
                        {prod.status === 'active' ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (Visible on >= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-[#73685C] uppercase font-bold tracking-wider border-b border-[#E8E2D8]">
                  <tr>
                    <th className="py-3.5 px-4">Image</th>
                    <th className="py-3.5 px-4">Product Name & Slug</th>
                    <th className="py-3.5 px-4">SKU</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">Copy Link</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE1]">
                  {filtered.map((prod) => {
                    const img = prod.primaryImage || prod.images?.[0];
                    return (
                      <tr key={prod.id} className="hover:bg-[#FAF8F5] transition-colors">
                        {/* Thumbnail */}
                        <td className="py-3 px-4">
                          <img
                            src={img}
                            alt={prod.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[#E0D8C8] bg-white"
                          />
                        </td>

                        {/* Name & Slug */}
                        <td className="py-3 px-4 max-w-[240px]">
                          <h4 className="font-bold text-sm text-[#1E1A17] line-clamp-1">{prod.name}</h4>
                          <div className="flex items-center gap-1 font-mono text-[11px] text-[#8C8072] truncate">
                            <span>/p/{prod.slug}</span>
                          </div>
                        </td>

                        {/* SKU */}
                        <td className="py-3 px-4 font-mono text-[#5A4F42] font-semibold">
                          {prod.sku || '—'}
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-sm text-[#1E1A17]">₹{prod.price.toLocaleString('en-IN')}</div>
                          {prod.mrp > prod.price && (
                            <div className="text-[10px] text-[#8C8072] line-through">MRP: ₹{prod.mrp}</div>
                          )}
                        </td>

                        {/* Stock */}
                        <td className="py-3 px-4">
                          <span
                            className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                              prod.stock === 0
                                ? 'bg-rose-100 text-rose-800'
                                : prod.stock <= 5
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {prod.stock} in stock
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <Badge status={prod.status} />
                        </td>

                        {/* Copy Link Button */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleCopyLink(prod.slug, prod.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF3E0] hover:bg-[#F2E5C5] text-[#805E25] font-semibold text-[11px] transition-all shadow-2xs"
                            title="Copy WhatsApp direct link"
                          >
                            {copiedId === prod.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700 font-bold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSharingProduct(prod)}
                              className="p-1.5 rounded-lg text-[#805E25] hover:text-[#1E1A17] hover:bg-[#FAF3E0] cursor-pointer"
                              title="Share Product Link & WhatsApp Template"
                            >
                              <Share2 className="w-4 h-4 text-[#BA9541]" />
                            </button>

                            <Link
                              to={`/p/${prod.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg text-[#8C8072] hover:text-[#1E1A17] hover:bg-[#F0EAE0]"
                              title="Preview Customer Page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            <Link
                              to={`/admin/products/${prod.id}/edit`}
                              className="p-1.5 rounded-lg text-[#8C8072] hover:text-[#BA9541] hover:bg-[#FAF3E0]"
                              title="Edit Product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleDuplicate(prod.id)}
                              className="p-1.5 rounded-lg text-[#8C8072] hover:text-blue-600 hover:bg-blue-50"
                              title="Duplicate Product"
                            >
                              <CopyPlus className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleToggleStatus(prod)}
                              className={`p-1.5 rounded-lg ${
                                prod.status === 'active'
                                  ? 'text-emerald-600 hover:bg-emerald-50'
                                  : 'text-gray-400 hover:bg-gray-100'
                              }`}
                              title={prod.status === 'active' ? 'Disable Product' : 'Enable Product'}
                            >
                              {prod.status === 'active' ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                            </button>

                            <button
                              onClick={() => handleDelete(prod.id, prod.name)}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Share Product Modal */}
      {sharingProduct && (
        <ShareProductModal
          product={sharingProduct}
          isOpen={Boolean(sharingProduct)}
          onClose={() => setSharingProduct(null)}
        />
      )}
    </div>
  );
};
