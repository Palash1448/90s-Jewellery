import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, MessageCircle } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { getAllOrders } from '../../services/orderService';
import { getAdminToCustomerWhatsAppLink } from '../../services/whatsappService';
import { formatOrderDate } from '../../utils/dateUtils';
import type { Order } from '../../types';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerSnapshot?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerSnapshot?.mobile?.includes(search) ||
      o.productName.toLowerCase().includes(search.toLowerCase());

    const matchesPayment = paymentFilter === 'all' || o.paymentStatus === paymentFilter;
    const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter;

    return matchesSearch && matchesPayment && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1E1A17]">
            Orders & Sales
          </h2>
          <p className="text-xs text-[#73685C]">
            Track customer shipments, payments, and WhatsApp communication ({orders.length} total orders)
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E2D8] shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8C8072] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order #, Customer, Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-xs text-[#1E1A17] focus:outline-none"
          />
        </div>

        {/* Payment Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#73685C] shrink-0">Payment:</span>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9CFBE] rounded-xl text-xs text-[#1E1A17] focus:outline-none"
          >
            <option value="all">All Payment Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Order Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#73685C] shrink-0">Fulfillment:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9CFBE] rounded-xl text-xs text-[#1E1A17] focus:outline-none"
          >
            <option value="all">All Order Statuses</option>
            <option value="new">New</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List View */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#73685C]">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#73685C]">
            No orders found matching your search.
          </div>
        ) : (
          <>
            {/* Mobile Cards View (< 768px) */}
            <div className="md:hidden divide-y divide-[#F2ECE1]">
              {filtered.map((order) => {
                const dateStr = formatOrderDate(order.createdAt, {
                  day: 'numeric',
                  month: 'short',
                });

                const customerPhone = order.customerSnapshot?.whatsapp || order.customerSnapshot?.mobile;
                const customerName = order.customerSnapshot?.name || 'Customer';
                const waChatLink = customerPhone
                  ? getAdminToCustomerWhatsAppLink(customerPhone, order.orderNumber, customerName)
                  : '#';

                return (
                  <div key={order.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-[#1E1A17]">{order.orderNumber}</span>
                      <span className="text-[11px] text-[#8C8072]">{dateStr}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={order.productImage}
                        alt=""
                        className="w-14 h-14 rounded-xl object-cover border border-[#E0D8C8] bg-white shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-[#1E1A17] truncate">{order.productName}</h4>
                        <p className="text-[11px] text-[#8C8072]">
                          Customer: <strong className="text-[#1E1A17]">{order.customerSnapshot?.name}</strong>
                        </p>
                        <p className="text-sm font-bold text-[#1E1A17] mt-0.5">₹{order.total.toLocaleString('en-IN')} (Qty: {order.quantity})</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F5EFE6]">
                      <div className="flex items-center gap-1.5">
                        <Badge status={order.orderStatus} type="order" />
                        <Badge status={order.paymentStatus} type="payment" />
                      </div>

                      <div className="flex items-center gap-2">
                        {customerPhone && (
                          <a
                            href={waChatLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200"
                            title="WhatsApp Customer"
                          >
                            <MessageCircle className="w-4 h-4 fill-current" />
                          </a>
                        )}

                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="px-3 py-1.5 rounded-lg bg-[#1E1A17] text-white text-xs font-bold"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-[#73685C] uppercase font-bold tracking-wider border-b border-[#E8E2D8]">
                  <tr>
                    <th className="py-3.5 px-4">Order #</th>
                    <th className="py-3.5 px-4">Customer & Contact</th>
                    <th className="py-3.5 px-4">Product Details</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Order Status</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE1]">
                  {filtered.map((order) => {
                    const dateStr = formatOrderDate(order.createdAt);

                    const customerPhone = order.customerSnapshot?.whatsapp || order.customerSnapshot?.mobile;
                    const customerName = order.customerSnapshot?.name || 'Customer';
                    const waChatLink = customerPhone
                      ? getAdminToCustomerWhatsAppLink(customerPhone, order.orderNumber, customerName)
                      : '#';

                    return (
                      <tr key={order.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#1E1A17]">
                          {order.orderNumber}
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-sm text-[#1E1A17]">{order.customerSnapshot?.name}</div>
                          <div className="text-[11px] text-[#8C8072] flex items-center gap-1">
                            <span>{order.customerSnapshot?.mobile}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 max-w-[200px]">
                          <div className="flex items-center gap-2">
                            <img
                              src={order.productImage}
                              alt=""
                              className="w-9 h-9 rounded-lg object-cover border border-[#E0D8C8] bg-white shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-medium text-xs text-[#1E1A17] truncate">{order.productName}</div>
                              <div className="text-[10px] text-[#8C8072]">Qty: {order.quantity}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-bold text-sm text-[#1E1A17]">
                          ₹{order.total.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3 px-4">
                          <Badge status={order.paymentStatus} type="payment" />
                        </td>

                        <td className="py-3 px-4">
                          <Badge status={order.orderStatus} type="order" />
                        </td>

                        <td className="py-3 px-4 text-[#8C8072] whitespace-nowrap">
                          {dateStr}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {customerPhone && (
                              <a
                                href={waChatLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                                title="Chat with customer on WhatsApp"
                              >
                                <MessageCircle className="w-4 h-4 fill-current" />
                              </a>
                            )}

                            <Link
                              to={`/admin/orders/${order.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1E1A17] hover:bg-black text-white text-xs font-bold transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Details</span>
                            </Link>
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
    </div>
  );
};
