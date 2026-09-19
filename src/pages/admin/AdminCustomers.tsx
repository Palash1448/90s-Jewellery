import React, { useState, useEffect } from 'react';
import { Search, Users, MessageCircle, Phone, Mail, ShoppingBag, Eye, X, ArrowRight } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { getAllCustomers } from '../../services/customerService';
import { getAllOrders } from '../../services/orderService';
import { getAdminToCustomerWhatsAppLink } from '../../services/whatsappService';
import type { Customer, Order } from '../../types';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const orders = await getAllOrders();
        setAllOrders(orders);
        const custs = await getAllCustomers(orders);
        setCustomers(custs);
      } catch (err) {
        console.error('Error fetching customer data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = customers.filter((c) => {
    return (
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile.includes(search) ||
      c.whatsapp.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const getCustomerOrders = (customer: Customer) => {
    return allOrders.filter(
      (o) =>
        (o.customerId === customer.id ||
          o.customerSnapshot?.mobile?.replace(/[^0-9]/g, '') === customer.mobile.replace(/[^0-9]/g, '')) &&
        (o.paymentStatus === 'paid' || o.paymentMethod === 'COD')
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCustomer(null);
      }
    };
    if (selectedCustomer) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCustomer]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1E1A17]">
            Customer Directory
          </h2>
          <p className="text-xs text-[#73685C]">
            Aggregated WhatsApp customer metrics, order histories & lifetime value ({customers.length} total)
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E2D8] shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-[#8C8072] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, mobile, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-xs text-[#1E1A17] focus:outline-none"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#73685C]">Loading customer directory...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#73685C]">
            No customers found. Customer records are generated automatically during checkout.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#73685C] uppercase font-bold tracking-wider border-b border-[#E8E2D8]">
                <tr>
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Mobile & WhatsApp</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4 text-center">Orders Placed</th>
                  <th className="py-3.5 px-4">Lifetime Spend</th>
                  <th className="py-3.5 px-4">Last Order</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE1]">
                {filtered.map((cust) => {
                  const waChatLink = getAdminToCustomerWhatsAppLink(
                    cust.whatsapp || cust.mobile,
                    'GENERAL',
                    cust.name
                  );

                  return (
                    <tr key={cust.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-sm text-[#1E1A17]">{cust.name}</div>
                        <div className="text-[10px] text-[#8C8072] font-mono">ID: {cust.id.slice(0, 14)}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-[#1E1A17]">
                          <Phone className="w-3 h-3 text-[#BA9541]" />
                          <span>{cust.mobile}</span>
                        </div>
                        {cust.whatsapp && (
                          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 mt-0.5">
                            <MessageCircle className="w-3 h-3 fill-current" />
                            <span>{cust.whatsapp}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-[#5A4F42]">
                        {cust.email || '—'}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="font-bold px-2 py-0.5 rounded-full bg-[#FAF3E0] text-[#947127] border border-[#E8DCBE]">
                          {cust.totalOrders || 0}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-sm text-emerald-800">
                        ₹{(cust.totalSpent || 0).toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 text-[#8C8072]">
                        {cust.lastOrderDate || '—'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={waChatLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                            title="Chat with customer on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4 fill-current" />
                          </a>

                          <button
                            onClick={() => setSelectedCustomer(cust)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FAF6EE] hover:bg-[#F0E6D2] text-[#805E25] font-bold text-xs transition-colors border border-[#E0D4BC]"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Order History</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Order History Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E8E2D8] relative space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black p-1.5 rounded-full bg-[#FAF8F5]"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-[#BA9541] uppercase tracking-widest block">
                CUSTOMER PROFILE
              </span>
              <h3 className="font-display font-bold text-2xl text-[#1E1A17]">
                {selectedCustomer.name}
              </h3>
              <p className="text-xs text-[#73685C] mt-0.5">
                Mobile: {selectedCustomer.mobile} • WhatsApp: {selectedCustomer.whatsapp} • Lifetime Spend: ₹{(selectedCustomer.totalSpent || 0).toLocaleString('en-IN')}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-display font-bold text-sm text-[#1E1A17] pb-2 border-b border-[#EFE9DF]">
                Past Purchase Orders ({getCustomerOrders(selectedCustomer).length})
              </h4>

              {getCustomerOrders(selectedCustomer).length === 0 ? (
                <p className="text-xs text-[#73685C] py-4 text-center">No orders linked to this customer yet.</p>
              ) : (
                <div className="divide-y divide-[#F2ECE1]">
                  {getCustomerOrders(selectedCustomer).map((ord) => (
                    <div key={ord.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={ord.productImage}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover border border-[#E0D8C8] bg-white shrink-0"
                        />
                        <div className="min-w-0">
                          <h5 className="font-bold text-xs text-[#1E1A17] truncate">{ord.productName}</h5>
                          <span className="font-mono text-[10px] text-[#8C8072] block">{ord.orderNumber}</span>
                          <span className="text-xs font-semibold text-[#1E1A17]">
                            ₹{ord.total.toLocaleString('en-IN')} (Qty: {ord.quantity})
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <Badge status={ord.orderStatus} type="order" />
                        <Badge status={ord.paymentStatus} type="payment" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
