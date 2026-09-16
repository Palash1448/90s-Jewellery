import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MessageCircle,
  Truck,
  ShieldCheck,
  User,
  MapPin,
  Package,
  CreditCard,
  Printer,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  Banknote
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { OrderTimeline } from '../../components/admin/OrderTimeline';
import { getOrderById, updateOrderStatus, updateOrderPaymentStatus } from '../../services/orderService';
import { getAdminToCustomerWhatsAppLink } from '../../services/whatsappService';
import { formatOrderDateTime } from '../../utils/dateUtils';
import type { Order, OrderStatus, PaymentStatus } from '../../types';

export const AdminOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      getOrderById(id).then((data) => {
        setOrder(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    if (!id || !order) return;
    setIsUpdating(true);
    try {
      const updated = await updateOrderStatus(id, newStatus);
      setOrder(updated);
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePaymentStatus = async (newPaymentStatus: PaymentStatus) => {
    if (!id || !order) return;
    setIsUpdating(true);
    try {
      const updated = await updateOrderPaymentStatus(id, newPaymentStatus);
      setOrder(updated);
    } catch (err: any) {
      alert(`Failed to update payment status: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-[#73685C]">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="p-12 text-center space-y-3">
        <p className="text-sm font-bold text-rose-600">Order not found</p>
        <button
          onClick={() => navigate('/admin/orders')}
          className="text-xs bg-[#1E1A17] text-white px-4 py-2 rounded-xl"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const isCod = order.paymentMethod === 'COD';
  const customerPhone = order.customerSnapshot?.whatsapp || order.customerSnapshot?.mobile;
  const waLink = customerPhone
    ? getAdminToCustomerWhatsAppLink(customerPhone, order.orderNumber, order.customerSnapshot?.name || 'Valued Customer')
    : '#';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders"
            className="p-2 rounded-xl bg-white border border-[#E8E2D8] hover:bg-[#F5EFE6] transition-colors text-[#1E1A17]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1E1A17]">
                Order #{order.orderNumber}
              </h2>
              {isCod ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  💵 COD (+₹{order.codCharge || 40})
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ⚡ PREPAID (Razorpay)
                </span>
              )}
              <Badge status={order.orderStatus} type="order" />
              <Badge status={order.paymentStatus} type="payment" />
            </div>
            <p className="text-xs text-[#73685C] mt-0.5">
              Placed on {formatOrderDateTime(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20be5a] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Message on WhatsApp</span>
          </a>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-white hover:bg-[#F5EFE6] border border-[#D9CFBE] text-[#1E1A17] text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Packing Slip</span>
          </button>
        </div>
      </div>

      {/* Fulfillment Status Progression Tracker */}
      <OrderTimeline
        currentStatus={order.orderStatus}
        paymentStatus={order.paymentStatus}
        onUpdateStatus={handleUpdateStatus}
        isUpdating={isUpdating}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer & Shipping Details Snapshot */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#EFE9DF]">
            <User className="w-4 h-4 text-[#BA9541]" />
            <h3 className="font-display font-bold text-base text-[#1E1A17]">
              Customer & Address Snapshot
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[#8C8072] block uppercase font-bold text-[10px]">Customer Name:</span>
              <strong className="text-sm text-[#1E1A17]">{order.customerSnapshot?.name}</strong>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-[#8C8072] block uppercase font-bold text-[10px]">Mobile:</span>
                <span className="text-[#1E1A17] font-semibold flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#BA9541]" />
                  <span>{order.customerSnapshot?.mobile}</span>
                </span>
              </div>
              <div>
                <span className="text-[#8C8072] block uppercase font-bold text-[10px]">WhatsApp:</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 fill-current" />
                  <span>{order.customerSnapshot?.whatsapp || order.customerSnapshot?.mobile}</span>
                </span>
              </div>
            </div>

            {order.customerSnapshot?.email && (
              <div>
                <span className="text-[#8C8072] block uppercase font-bold text-[10px]">Email:</span>
                <span className="text-[#1E1A17] flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#BA9541]" />
                  <span>{order.customerSnapshot?.email}</span>
                </span>
              </div>
            )}

            <div className="pt-3 border-t border-[#EFE9DF]">
              <div className="flex items-center gap-1.5 text-[#BA9541] font-bold uppercase text-[10px] mb-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Shipping Destination:</span>
              </div>
              <p className="text-[#1E1A17] font-medium leading-relaxed bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E2D8]">
                {order.addressSnapshot?.addressLine}
                <br />
                {order.addressSnapshot?.area}
                {order.addressSnapshot?.landmark ? `, ${order.addressSnapshot.landmark}` : ''}
                <br />
                <strong>
                  {order.addressSnapshot?.city}, {order.addressSnapshot?.state} — {order.addressSnapshot?.pincode}
                </strong>
                <br />
                <span className="text-[#73685C] text-[11px]">{order.addressSnapshot?.country || 'India'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Product & Payment Summary */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#EFE9DF]">
            <Package className="w-4 h-4 text-[#BA9541]" />
            <h3 className="font-display font-bold text-base text-[#1E1A17]">
              Financial Summary & Payment
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Product Item Card */}
            <div className="flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2D8]">
              <img
                src={order.productImage}
                alt={order.productName}
                className="w-16 h-16 rounded-lg object-cover border border-[#E0D8C8] bg-white shrink-0"
              />
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-[#1E1A17] line-clamp-1">{order.productName}</h4>
                <p className="text-[#8C8072] mt-0.5">
                  Unit Price: <strong>₹{order.unitPrice.toLocaleString('en-IN')}</strong> × {order.quantity}
                </p>
              </div>
            </div>

            {/* Price Calculations Breakdown */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex justify-between text-[#73685C]">
                <span>Item Subtotal ({order.quantity} pcs)</span>
                <span className="font-semibold text-[#1E1A17]">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-[#8C2D3B] font-semibold">
                  <span>Discount Applied</span>
                  <span>- ₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-[#73685C]">
                <span>Shipping Charge</span>
                <span className="font-semibold text-[#1E1A17]">
                  {order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
                </span>
              </div>

              {isCod && (
                <div className="flex justify-between text-[#805E25]">
                  <span>Cash on Delivery Handling Fee</span>
                  <span className="font-semibold">+₹{order.codCharge || 40}</span>
                </div>
              )}

              <div className="pt-2 border-t-2 border-[#1E1A17] flex justify-between items-baseline font-bold text-sm sm:text-base text-[#1E1A17]">
                <span>{isCod ? 'Total to Collect on Delivery' : 'Total Amount Paid'}</span>
                <span className="font-display text-xl sm:text-2xl text-[#1E1A17]">
                  ₹{order.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Payment Transaction Details */}
            <div className="pt-3 border-t border-[#EFE9DF] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#8C8072]">Payment Mode:</span>
                <span className="text-xs font-bold text-[#1E1A17] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E8E2D8]">
                  {isCod ? '💵 Cash on Delivery (COD)' : '⚡ Online (Razorpay)'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#8C8072]">Payment Status:</span>
                <div className="flex items-center gap-2">
                  <Badge status={order.paymentStatus} type="payment" />
                  {isCod && order.paymentStatus !== 'paid' && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleUpdatePaymentStatus('paid')}
                      className="text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 rounded transition-colors"
                    >
                      Mark as Cash Collected
                    </button>
                  )}
                  {isCod && order.paymentStatus === 'paid' && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleUpdatePaymentStatus('pending')}
                      className="text-[10px] font-medium text-amber-700 hover:underline"
                    >
                      Revert to Pending
                    </button>
                  )}
                </div>
              </div>

              {order.razorpayOrderId && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#8C8072]">Razorpay Order ID:</span>
                  <span className="font-mono text-xs font-semibold text-[#1E1A17] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E8E2D8]">
                    {order.razorpayOrderId}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#8C8072]">Payment ID / TXN:</span>
                <span className="font-mono text-xs font-semibold text-[#1E1A17] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E8E2D8]">
                  {order.razorpayPaymentId || order.paymentTransactionId || (isCod ? 'COD_PENDING' : 'PENDING')}
                </span>
              </div>

              {order.paymentVerified && (
                <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 pt-1">
                  <span>✓ Cryptographically verified with Razorpay HMAC-SHA256 signature</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
