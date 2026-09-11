import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  IndianRupee,
  CheckCircle2,
  Clock,
  TrendingUp,
  PlusCircle,
  ExternalLink,
  ArrowRight,
  Eye,
  Sparkles,
  Users
} from 'lucide-react';
import { StatCard } from '../../components/admin/StatCard';
import { Badge } from '../../components/common/Badge';
import { getAllProducts, seedInitialProducts } from '../../services/productService';
import { getAllOrders } from '../../services/orderService';
import type { Product, Order } from '../../types';

export const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      await seedInitialProducts();
      const [pData, oData] = await Promise.all([getAllProducts(), getAllOrders()]);
      setProducts(pData);
      setOrders(oData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute Metrics
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === 'active').length;
  const totalOrders = orders.length;
  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
  const pendingOrders = orders.filter((o) => o.paymentStatus === 'pending');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Action */}
      <div className="bg-gradient-to-r from-[#1E1A17] to-[#342D26] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg border border-[#D4AF37]/30">
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WhatsApp Commerce Control Tower</span>
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#FAF8F5]">
            Namaste, 90s Chya Athavani Admin
          </h2>
          <p className="text-xs sm:text-sm text-[#D8CDBE] max-w-xl">
            Real-time analytics for your Indian imitation jewellery storefront and WhatsApp automation links.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/products/new"
            className="bg-gold-gradient text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md flex items-center gap-2 hover:opacity-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add New Product</span>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-[#2A231C] hover:bg-[#382E25] text-[#FAF8F5] border border-[#4E4135] font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl transition-all flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
            <span>Manage Orders</span>
          </Link>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          icon={IndianRupee}
          colorVariant="gold"
          trend="+18.4% this month"
          subtitle="Verified paid transactions"
        />

        <StatCard
          title="Paid Orders"
          value={paidOrders.length}
          icon={CheckCircle2}
          colorVariant="emerald"
          subtitle={`${paidOrders.length} of ${totalOrders} orders completed`}
        />

        <StatCard
          title="Pending Payments"
          value={pendingOrders.length}
          icon={Clock}
          colorVariant="amber"
          subtitle="Awaiting customer completion"
        />

        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={ShoppingBag}
          colorVariant="blue"
          subtitle="All-time initiated orders"
        />

        <StatCard
          title="Active Products"
          value={activeProducts}
          icon={Package}
          colorVariant="gold"
          subtitle={`${activeProducts} live in store catalogue`}
        />

        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={Sparkles}
          colorVariant="emerald"
          subtitle={`${totalProducts - activeProducts} inactive or draft`}
        />
      </div>

      {/* Analytics Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Performance Chart (SVG Visualization) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFE9DF]">
            <div>
              <h3 className="font-display font-bold text-lg text-[#1E1A17]">
                Sales & Revenue Trajectory
              </h3>
              <p className="text-xs text-[#73685C]">Direct WhatsApp customer conversion trends</p>
            </div>
            <span className="text-xs font-semibold bg-[#FAF3E0] text-[#947127] px-2.5 py-1 rounded-full border border-[#E8DCBE]">
              Last 7 Days
            </span>
          </div>

          {/* Simple Visual Bar Chart */}
          <div className="pt-4">
            <div className="h-44 flex items-end justify-between gap-3 sm:gap-6 px-2">
              {[
                { day: 'Mon', rev: 3200, height: '40%' },
                { day: 'Tue', rev: 4800, height: '60%' },
                { day: 'Wed', rev: 2400, height: '30%' },
                { day: 'Thu', rev: 7200, height: '85%' },
                { day: 'Fri', rev: 5900, height: '70%' },
                { day: 'Sat', rev: 8900, height: '100%' },
                { day: 'Sun', rev: 6400, height: '75%' },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-[#BA9541] opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{item.rev}
                  </span>
                  <div className="w-full bg-[#FAF3E0] rounded-xl overflow-hidden h-32 flex items-end">
                    <div
                      className="w-full bg-gold-gradient rounded-xl transition-all duration-500 group-hover:brightness-110"
                      style={{ height: item.height }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#5A4F42]">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Best Selling Products Mini-List */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE9DF]">
              <h3 className="font-display font-bold text-lg text-[#1E1A17]">
                Best Sellers
              </h3>
              <Link to="/admin/products" className="text-xs font-bold text-[#BA9541] hover:underline">
                View All
              </Link>
            </div>

            <div className="divide-y divide-[#F2ECE1] pt-1">
              {products.slice(0, 4).map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={p.primaryImage || p.images?.[0]}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover border border-[#E0D8C8] bg-white shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs text-[#1E1A17] truncate">{p.name}</h4>
                      <span className="text-[11px] font-bold text-[#805E25]">₹{p.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <Badge status={p.status} />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#EFE9DF]">
            <Link
              to="/admin/products/new"
              className="w-full py-2.5 px-3 rounded-xl bg-[#FAF6EE] hover:bg-[#F5ECDA] text-[#805E25] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Product Link</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EFE9DF]">
          <div>
            <h3 className="font-display font-bold text-lg text-[#1E1A17]">
              Recent Orders
            </h3>
            <p className="text-xs text-[#73685C]">Live incoming customer orders from WhatsApp</p>
          </div>

          <Link
            to="/admin/orders"
            className="flex items-center gap-1 text-xs font-bold text-[#BA9541] hover:underline"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-10 text-xs text-[#73685C]">
            No orders placed yet. Products created will generate customer orders here.
          </div>
        ) : (
          <>
            {/* Mobile Cards View (< 768px) */}
            <div className="md:hidden divide-y divide-[#F2ECE1]">
              {recentOrders.map((ord) => (
                <div key={ord.id} className="py-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[#1E1A17]">{ord.orderNumber}</span>
                    <span className="font-bold text-xs text-[#1E1A17]">₹{ord.total.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[#8C8072] block text-[11px]">Customer:</span>
                      <strong className="text-[#1E1A17]">{ord.customerSnapshot?.name}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[#8C8072] block text-[11px]">Product:</span>
                      <span className="text-[#1E1A17] font-medium truncate max-w-[150px] inline-block">{ord.productName}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#F8F4EE]">
                    <div className="flex items-center gap-1.5">
                      <Badge status={ord.paymentStatus} type="payment" />
                      <Badge status={ord.orderStatus} type="order" />
                    </div>

                    <Link
                      to={`/admin/orders/${ord.id}`}
                      className="inline-flex items-center gap-1 font-bold text-xs text-[#805E25] bg-[#FAF3E0] px-2.5 py-1 rounded-lg"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Manage</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-[#73685C] uppercase font-bold tracking-wider border-b border-[#E8E2D8]">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE1]">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#1E1A17]">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#1E1A17]">{ord.customerSnapshot?.name}</div>
                        <div className="text-[11px] text-[#8C8072]">{ord.customerSnapshot?.mobile}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#1E1A17] truncate max-w-[180px]">
                          {ord.productName}
                        </div>
                        <div className="text-[11px] text-[#8C8072]">Qty: {ord.quantity}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#1E1A17]">
                        ₹{ord.total.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge status={ord.paymentStatus} type="payment" />
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge status={ord.orderStatus} type="order" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/admin/orders/${ord.id}`}
                          className="inline-flex items-center gap-1 font-bold text-xs text-[#805E25] hover:text-[#1E1A17] bg-[#FAF3E0] hover:bg-[#F3E7C9] px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Manage</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
