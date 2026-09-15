import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Eye,
  MessageCircle,
  Calendar,
  CalendarDays,
  X,
  RotateCcw,
  IndianRupee,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Filter,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { getAllOrders } from '../../services/orderService';
import { getAdminToCustomerWhatsAppLink } from '../../services/whatsappService';
import {
  formatOrderDate,
  formatOrderDateTime,
  getLocalDateKey,
  getTodayDateKey,
  getYesterdayDateKey,
  isSameDay,
  isDateInRange,
  formatFriendlyDateKey
} from '../../utils/dateUtils';
import type { Order } from '../../types';

type DatePreset = 'all' | 'today' | 'yesterday' | 'last7' | 'thisMonth' | 'specific' | 'range';
type ViewTab = 'paid' | 'unpaid';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<ViewTab>('paid');

  // Date filtering state
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [selectedDate, setSelectedDate] = useState<string>(''); // YYYY-MM-DD
  const [startDate, setStartDate] = useState<string>(''); // YYYY-MM-DD for range
  const [endDate, setEndDate] = useState<string>(''); // YYYY-MM-DD for range

  const todayKey = getTodayDateKey();
  const yesterdayKey = getYesterdayDateKey();

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

  // Split into Paid vs Incomplete checkouts
  const paidOrders = useMemo(() => {
    return orders.filter((o) => o.paymentStatus === 'paid');
  }, [orders]);

  const unpaidOrders = useMemo(() => {
    return orders.filter((o) => o.paymentStatus !== 'paid');
  }, [orders]);

  // Current working orders list based on active tab
  const currentTabOrders = activeTab === 'paid' ? paidOrders : unpaidOrders;

  // Precompute quick preset counts for the active tab
  const todayCount = useMemo(() => {
    return currentTabOrders.filter((o) => isSameDay(o.createdAt, todayKey)).length;
  }, [currentTabOrders, todayKey]);

  const yesterdayCount = useMemo(() => {
    return currentTabOrders.filter((o) => isSameDay(o.createdAt, yesterdayKey)).length;
  }, [currentTabOrders, yesterdayKey]);

  // Handler for selecting a specific date via calendar input
  const handleSpecificDateChange = (dateVal: string) => {
    setSelectedDate(dateVal);
    if (dateVal) {
      setDatePreset('specific');
    } else {
      setDatePreset('all');
    }
  };

  // Handler for setting preset
  const handlePresetSelect = (preset: DatePreset) => {
    setDatePreset(preset);
    if (preset === 'today') {
      setSelectedDate(todayKey);
    } else if (preset === 'yesterday') {
      setSelectedDate(yesterdayKey);
    } else if (preset === 'all') {
      setSelectedDate('');
      setStartDate('');
      setEndDate('');
    } else if (preset === 'last7') {
      const d = new Date();
      d.setDate(d.getDate() - 6);
      setStartDate(getLocalDateKey(d));
      setEndDate(todayKey);
      setSelectedDate('');
    } else if (preset === 'thisMonth') {
      const d = new Date();
      const firstDay = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
      setStartDate(firstDay);
      setEndDate(todayKey);
      setSelectedDate('');
    }
  };

  // Filter current tab orders
  const filtered = useMemo(() => {
    return currentTabOrders.filter((o) => {
      // 1. Text Search
      const matchesSearch =
        search === '' ||
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customerSnapshot?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.customerSnapshot?.mobile?.includes(search) ||
        o.productName.toLowerCase().includes(search.toLowerCase());

      // 2. Status Filter
      const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter;

      // 3. Date Filter
      let matchesDate = true;
      if (datePreset === 'today') {
        matchesDate = isSameDay(o.createdAt, todayKey);
      } else if (datePreset === 'yesterday') {
        matchesDate = isSameDay(o.createdAt, yesterdayKey);
      } else if (datePreset === 'specific') {
        matchesDate = selectedDate ? isSameDay(o.createdAt, selectedDate) : true;
      } else if (datePreset === 'last7' || datePreset === 'thisMonth' || datePreset === 'range') {
        matchesDate = isDateInRange(o.createdAt, startDate, endDate);
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [currentTabOrders, search, statusFilter, datePreset, selectedDate, startDate, endDate, todayKey, yesterdayKey]);

  // Aggregate stats for filtered result
  const filteredTotalRevenue = useMemo(() => {
    return filtered
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + (o.total || 0), 0);
  }, [filtered]);

  const hasActiveFilters =
    search !== '' ||
    statusFilter !== 'all' ||
    datePreset !== 'all' ||
    selectedDate !== '' ||
    startDate !== '' ||
    endDate !== '';

  const resetAllFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setDatePreset('all');
    setSelectedDate('');
    setStartDate('');
    setEndDate('');
  };

  // Quick click on table date to filter by that date
  const handleOrderDateClick = (rawDate: any) => {
    const key = getLocalDateKey(rawDate);
    if (key) {
      setSelectedDate(key);
      setDatePreset('specific');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1E1A17] flex items-center gap-2">
            <span>Orders & Sales</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{paidOrders.length} Paid Orders</span>
            </span>
          </h2>
          <p className="text-xs text-[#73685C]">
            Track verified prepaid customer shipments, order fulfillment, and WhatsApp communication
          </p>
        </div>

        {/* View Tabs: Paid Orders (Default) vs Incomplete */}
        <div className="flex items-center bg-[#FAF8F5] p-1 rounded-2xl border border-[#E8E2D8] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('paid');
              resetAllFilters();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'paid'
                ? 'bg-[#1E1A17] text-white shadow-xs'
                : 'text-[#73685C] hover:text-[#1E1A17]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Paid Orders ({paidOrders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('unpaid');
              resetAllFilters();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'unpaid'
                ? 'bg-[#1E1A17] text-white shadow-xs'
                : 'text-[#73685C] hover:text-[#1E1A17]'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>Incomplete / Failed ({unpaidOrders.length})</span>
          </button>
        </div>
      </div>

      {/* Date Filter & Preset Controls */}
      <div className="bg-white rounded-3xl p-5 border border-[#E8E2D8] shadow-xs space-y-4">
        {/* Row 1: Date Presets & Date Picker */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Quick Date Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-[#73685C] mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#BA9541]" />
              <span>Date:</span>
            </span>

            <button
              type="button"
              onClick={() => handlePresetSelect('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                datePreset === 'all'
                  ? 'bg-[#1E1A17] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#5A4F42] hover:bg-[#F2ECE1] border border-[#E8E2D8]'
              }`}
            >
              All Time
            </button>

            <button
              type="button"
              onClick={() => handlePresetSelect('today')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                datePreset === 'today'
                  ? 'bg-[#BA9541] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#5A4F42] hover:bg-[#FAF3E0] hover:text-[#805E25] border border-[#E8E2D8]'
              }`}
            >
              <span>Today</span>
              {todayCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    datePreset === 'today' ? 'bg-white/20 text-white' : 'bg-[#FAF3E0] text-[#947127]'
                  }`}
                >
                  {todayCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handlePresetSelect('yesterday')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                datePreset === 'yesterday'
                  ? 'bg-[#BA9541] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#5A4F42] hover:bg-[#FAF3E0] hover:text-[#805E25] border border-[#E8E2D8]'
              }`}
            >
              <span>Yesterday</span>
              {yesterdayCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    datePreset === 'yesterday' ? 'bg-white/20 text-white' : 'bg-[#FAF3E0] text-[#947127]'
                  }`}
                >
                  {yesterdayCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handlePresetSelect('last7')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                datePreset === 'last7'
                  ? 'bg-[#BA9541] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#5A4F42] hover:bg-[#F2ECE1] border border-[#E8E2D8]'
              }`}
            >
              Last 7 Days
            </button>

            <button
              type="button"
              onClick={() => handlePresetSelect('thisMonth')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                datePreset === 'thisMonth'
                  ? 'bg-[#BA9541] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#5A4F42] hover:bg-[#F2ECE1] border border-[#E8E2D8]'
              }`}
            >
              This Month
            </button>

            <button
              type="button"
              onClick={() => {
                setDatePreset('range');
                if (!startDate) setStartDate(todayKey);
                if (!endDate) setEndDate(todayKey);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                datePreset === 'range'
                  ? 'bg-[#BA9541] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#5A4F42] hover:bg-[#F2ECE1] border border-[#E8E2D8]'
              }`}
            >
              Custom Range
            </button>
          </div>

          {/* Date Picker Input (Exact Particular Date / Range) */}
          <div className="flex flex-wrap items-center gap-2">
            {datePreset === 'range' ? (
              <div className="flex items-center gap-2 bg-[#FAF8F5] p-1.5 rounded-2xl border border-[#D9CFBE]">
                <div className="flex items-center gap-1 px-2">
                  <span className="text-[11px] font-semibold text-[#73685C]">From:</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-white border border-[#D9CFBE] rounded-lg px-2 py-1 text-xs text-[#1E1A17] focus:outline-none focus:border-[#BA9541]"
                  />
                </div>
                <div className="flex items-center gap-1 px-2">
                  <span className="text-[11px] font-semibold text-[#73685C]">To:</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-white border border-[#D9CFBE] rounded-lg px-2 py-1 text-xs text-[#1E1A17] focus:outline-none focus:border-[#BA9541]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('all')}
                  className="p-1 rounded-lg text-[#8C8072] hover:bg-[#EFE9DF] transition-colors cursor-pointer"
                  title="Clear Range"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative flex items-center">
                <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#D9CFBE] focus-within:border-[#BA9541] rounded-2xl px-3 py-1.5">
                  <CalendarDays className="w-4 h-4 text-[#BA9541] shrink-0" />
                  <label htmlFor="order-date-picker" className="text-xs font-semibold text-[#73685C] shrink-0 cursor-pointer">
                    Select Date:
                  </label>
                  <input
                    id="order-date-picker"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleSpecificDateChange(e.target.value)}
                    className="bg-white border border-[#D9CFBE] rounded-xl px-2.5 py-1 text-xs font-medium text-[#1E1A17] focus:outline-none focus:border-[#BA9541] cursor-pointer"
                  />
                  {selectedDate && (
                    <button
                      type="button"
                      onClick={() => handlePresetSelect('all')}
                      className="p-1 rounded-lg text-[#8C8072] hover:text-[#8C2A2A] hover:bg-[#FDF2F2] transition-colors cursor-pointer"
                      title="Clear Selected Date"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Search Bar & Fulfillment Filter */}
        <div className="pt-3 border-t border-[#F2ECE1] grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8C8072] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Order #, Customer Name, Phone number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-xs text-[#1E1A17] focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8072] hover:text-[#1E1A17] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Fulfillment Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#73685C] shrink-0">Fulfillment:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9CFBE] rounded-xl text-xs text-[#1E1A17] focus:outline-none focus:border-[#BA9541]"
            >
              <option value="all">All Fulfillment Statuses</option>
              <option value="new">New (Awaiting Pack)</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped (Dispatched)</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Row 3: Active Filters & Filtered Summary Banner */}
        <div className="pt-3 border-t border-[#F2ECE1] flex flex-wrap items-center justify-between gap-3 bg-[#FAF8F5] -mx-5 -mb-5 p-4 rounded-b-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-[#73685C]">
              Showing <strong className="text-[#1E1A17]">{filtered.length}</strong> of{' '}
              <span className="text-[#73685C]">{currentTabOrders.length} {activeTab === 'paid' ? 'paid orders' : 'unpaid records'}</span>
            </span>

            {/* Active Date Badge */}
            {datePreset === 'specific' && selectedDate && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF3E0] text-[#805E25] font-semibold border border-[#E8DCBE]">
                <Calendar className="w-3 h-3 text-[#BA9541]" />
                <span>Date: {formatFriendlyDateKey(selectedDate)}</span>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('all')}
                  className="hover:text-red-700 ml-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {datePreset === 'today' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF3E0] text-[#805E25] font-semibold border border-[#E8DCBE]">
                <Calendar className="w-3 h-3 text-[#BA9541]" />
                <span>Today ({formatOrderDate(new Date())})</span>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('all')}
                  className="hover:text-red-700 ml-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {datePreset === 'yesterday' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF3E0] text-[#805E25] font-semibold border border-[#E8DCBE]">
                <Calendar className="w-3 h-3 text-[#BA9541]" />
                <span>Yesterday</span>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('all')}
                  className="hover:text-red-700 ml-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {datePreset === 'last7' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF3E0] text-[#805E25] font-semibold border border-[#E8DCBE]">
                <Calendar className="w-3 h-3 text-[#BA9541]" />
                <span>Last 7 Days</span>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('all')}
                  className="hover:text-red-700 ml-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {datePreset === 'thisMonth' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF3E0] text-[#805E25] font-semibold border border-[#E8DCBE]">
                <Calendar className="w-3 h-3 text-[#BA9541]" />
                <span>This Month</span>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('all')}
                  className="hover:text-red-700 ml-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {datePreset === 'range' && startDate && endDate && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF3E0] text-[#805E25] font-semibold border border-[#E8DCBE]">
                <Calendar className="w-3 h-3 text-[#BA9541]" />
                <span>Range: {startDate} to {endDate}</span>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('all')}
                  className="hover:text-red-700 ml-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-[#D9CFBE] text-[#5A4F42] text-[11px] font-medium">
                Status: {statusFilter}
                <button type="button" onClick={() => setStatusFilter('all')} className="hover:text-red-700">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[11px] text-[#8C2A2A] hover:underline font-semibold ml-1 cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear All Filters</span>
              </button>
            )}
          </div>

          {/* Quick Metrics for Filtered Set */}
          {activeTab === 'paid' && (
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[#73685C]">Paid Sales:</span>
                <strong className="text-emerald-700 font-bold">
                  ₹{filteredTotalRevenue.toLocaleString('en-IN')}
                </strong>
              </div>
              <span className="text-[#D9CFBE]">|</span>
              <div className="flex items-center gap-1 text-[#73685C]">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{filtered.length} Paid Orders</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Orders List View */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-[#73685C]">
            <div className="w-8 h-8 border-2 border-[#BA9541] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Loading orders...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF6EE] text-[#BA9541] flex items-center justify-center mx-auto border border-[#E8DCBE]">
              <Calendar className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-base text-[#1E1A17]">
                {selectedDate
                  ? `No ${activeTab === 'paid' ? 'paid' : ''} orders found for ${formatFriendlyDateKey(selectedDate)}`
                  : datePreset === 'today'
                  ? `No ${activeTab === 'paid' ? 'paid' : ''} orders placed today yet`
                  : datePreset === 'yesterday'
                  ? `No ${activeTab === 'paid' ? 'paid' : ''} orders found for yesterday`
                  : `No ${activeTab === 'paid' ? 'paid' : ''} orders found matching your criteria`}
              </h3>
              <p className="text-xs text-[#73685C] max-w-md mx-auto">
                {selectedDate
                  ? 'Try selecting another date from the calendar picker or reset the date filter to see all orders.'
                  : 'Try adjusting your search keywords or date range filters.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-4 py-2 rounded-xl bg-[#1E1A17] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
              >
                View All {activeTab === 'paid' ? 'Paid' : ''} Orders
              </button>
              {selectedDate !== todayKey && (
                <button
                  type="button"
                  onClick={() => handlePresetSelect('today')}
                  className="px-4 py-2 rounded-xl bg-[#FAF3E0] text-[#805E25] border border-[#E8DCBE] text-xs font-bold hover:bg-[#F3E7C9] transition-colors cursor-pointer"
                >
                  Show Today's Orders
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Cards View (< 768px) */}
            <div className="md:hidden divide-y divide-[#F2ECE1]">
              {filtered.map((order) => {
                const dateDisplay = formatOrderDate(order.createdAt, {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });
                const dateTimeDisplay = formatOrderDateTime(order.createdAt);
                const orderDateKey = getLocalDateKey(order.createdAt);

                const customerPhone = order.customerSnapshot?.whatsapp || order.customerSnapshot?.mobile;
                const customerName = order.customerSnapshot?.name || 'Customer';
                const waChatLink = customerPhone
                  ? getAdminToCustomerWhatsAppLink(customerPhone, order.orderNumber, customerName)
                  : '#';

                return (
                  <div key={order.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#1E1A17]">{order.orderNumber}</span>
                        {order.paymentStatus === 'paid' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            PAID
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOrderDateClick(order.createdAt)}
                        className="text-[11px] text-[#8C8072] hover:text-[#BA9541] hover:underline flex items-center gap-1 cursor-pointer"
                        title={`Filter by this date (${orderDateKey})`}
                      >
                        <Calendar className="w-3 h-3 text-[#BA9541]" />
                        <span>{dateDisplay}</span>
                      </button>
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
                        <p className="text-sm font-bold text-[#1E1A17] mt-0.5">
                          ₹{order.total.toLocaleString('en-IN')} (Qty: {order.quantity})
                        </p>
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
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Customer & Contact</th>
                    <th className="py-3.5 px-4">Product Details</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Fulfillment Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE1]">
                  {filtered.map((order) => {
                    const dateDisplay = formatOrderDate(order.createdAt);
                    const dateTimeDisplay = formatOrderDateTime(order.createdAt);
                    const orderDateKey = getLocalDateKey(order.createdAt);

                    const customerPhone = order.customerSnapshot?.whatsapp || order.customerSnapshot?.mobile;
                    const customerName = order.customerSnapshot?.name || 'Customer';
                    const waChatLink = customerPhone
                      ? getAdminToCustomerWhatsAppLink(customerPhone, order.orderNumber, customerName)
                      : '#';

                    return (
                      <tr key={order.id} className="hover:bg-[#FAF8F5] transition-colors">
                        {/* Order Number */}
                        <td className="py-3 px-4 font-mono font-bold text-[#1E1A17]">
                          {order.orderNumber}
                        </td>

                        {/* Date with quick filter click */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleOrderDateClick(order.createdAt)}
                            className="group flex flex-col text-left cursor-pointer"
                            title={`Click to filter by ${orderDateKey}`}
                          >
                            <span className="font-semibold text-[#1E1A17] group-hover:text-[#BA9541] group-hover:underline flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[#BA9541]" />
                              <span>{dateDisplay}</span>
                            </span>
                            <span className="text-[10px] text-[#8C8072]">
                              {dateTimeDisplay.split(', ')[1] || ''}
                            </span>
                          </button>
                        </td>

                        {/* Customer */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-sm text-[#1E1A17]">{order.customerSnapshot?.name}</div>
                          <div className="text-[11px] text-[#8C8072] flex items-center gap-1">
                            <span>{order.customerSnapshot?.mobile}</span>
                          </div>
                        </td>

                        {/* Product */}
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

                        {/* Amount */}
                        <td className="py-3 px-4 font-bold text-sm text-[#1E1A17]">
                          ₹{order.total.toLocaleString('en-IN')}
                        </td>

                        {/* Payment Status */}
                        <td className="py-3 px-4">
                          <Badge status={order.paymentStatus} type="payment" />
                        </td>

                        {/* Order Fulfillment Status */}
                        <td className="py-3 px-4">
                          <Badge status={order.orderStatus} type="order" />
                        </td>

                        {/* Actions */}
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
