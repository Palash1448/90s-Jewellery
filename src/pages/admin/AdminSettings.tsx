import React, { useState, useEffect } from 'react';
import { Save, Sparkles, Store, Truck, MessageCircle, FileText, CheckCircle2 } from 'lucide-react';
import { getStoreSettings, updateStoreSettings } from '../../services/settingsService';
import type { StoreSettings } from '../../types';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    getStoreSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    try {
      const updated = await updateStoreSettings(settings);
      setSettings(updated);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    } catch (err: any) {
      alert(`Error updating settings: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="p-12 text-center text-xs text-[#73685C]">Loading store settings...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1E1A17]">
            Store & WhatsApp Settings
          </h2>
          <p className="text-xs text-[#73685C]">
            Configure branding, WhatsApp automation numbers, delivery fees & legal policies
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          id="admin-settings-save-btn"
          className="flex items-center justify-center gap-2 bg-[#1E1A17] hover:bg-black text-white px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
        >
          <Save className="w-4 h-4 text-[#D4AF37]" />
          <span>{isSaving ? 'Saving Changes...' : 'Save Settings'}</span>
        </button>
      </div>

      {showSavedToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Settings saved successfully to Firestore database!</span>
        </div>
      )}

      {/* 1. Brand & Store Identity */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#EFE9DF]">
          <Store className="w-4 h-4 text-[#BA9541]" />
          <h3 className="font-display font-bold text-base sm:text-lg text-[#1E1A17]">
            1. Brand & Store Identity
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-[#3B3229] uppercase mb-1">Brand Name</label>
            <input
              type="text"
              value={settings.brandName}
              onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-[#1E1A17] font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-[#3B3229] uppercase mb-1">Customer Support Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-[#1E1A17]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#3B3229] uppercase mb-1">Primary WhatsApp Number (with country code)</label>
            <input
              type="text"
              placeholder="e.g. 919876543210"
              value={settings.whatsappNumber}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-[#1E1A17] font-mono font-bold"
            />
            <p className="text-[10px] text-[#8C8072] mt-0.5">Used for direct WhatsApp product ordering links.</p>
          </div>

          <div>
            <label className="block font-bold text-[#3B3229] uppercase mb-1">Helpline Phone Number</label>
            <input
              type="text"
              value={settings.contactNumber}
              onChange={(e) => setSettings({ ...settings, contactNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-[#1E1A17]"
            />
          </div>
        </div>
      </div>

      {/* 2. Shipping & Delivery Rules */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#EFE9DF]">
          <Truck className="w-4 h-4 text-[#BA9541]" />
          <h3 className="font-display font-bold text-base sm:text-lg text-[#1E1A17]">
            2. Shipping & Delivery Rules
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-[#3B3229] uppercase mb-1">Default Shipping Fee (₹)</label>
            <input
              type="number"
              min="0"
              value={settings.defaultShippingCharge}
              onChange={(e) => setSettings({ ...settings, defaultShippingCharge: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-[#1E1A17] font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-[#3B3229] uppercase mb-1">Free Shipping Order Threshold (₹)</label>
            <input
              type="number"
              min="0"
              value={settings.freeShippingThreshold}
              onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-[#1E1A17] font-bold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-[#3B3229] uppercase mb-1">Courier & Dispatch Summary Info</label>
            <input
              type="text"
              value={settings.deliveryInfo}
              onChange={(e) => setSettings({ ...settings, deliveryInfo: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-[#1E1A17]"
            />
          </div>
        </div>
      </div>

      {/* 3. WhatsApp Message Automation Templates */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#EFE9DF]">
          <MessageCircle className="w-4 h-4 text-[#BA9541]" />
          <h3 className="font-display font-bold text-base sm:text-lg text-[#1E1A17]">
            3. WhatsApp Message Templates
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#3B3229] uppercase mb-1">
              Default Product Inquiry Template
            </label>
            <textarea
              rows={3}
              value={settings.defaultWhatsAppMessage}
              onChange={(e) => setSettings({ ...settings, defaultWhatsAppMessage: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-[#1E1A17] font-mono text-[11px]"
            />
            <p className="text-[10px] text-[#8C8072] mt-0.5">Available placeholders: [PRODUCT_NAME], [PRICE], [PRODUCT_URL]</p>
          </div>

          <div>
            <label className="block font-bold text-[#3B3229] uppercase mb-1">
              Order Confirmation Notification Template
            </label>
            <textarea
              rows={3}
              value={settings.orderConfirmationMessage}
              onChange={(e) => setSettings({ ...settings, orderConfirmationMessage: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-[#1E1A17] font-mono text-[11px]"
            />
            <p className="text-[10px] text-[#8C8072] mt-0.5">Available placeholders: [CUSTOMER_NAME], [ORDER_NUMBER], [PRODUCT_NAME], [TOTAL]</p>
          </div>
        </div>
      </div>

      {/* 4. Store Legal Policies */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#EFE9DF]">
          <FileText className="w-4 h-4 text-[#BA9541]" />
          <h3 className="font-display font-bold text-base sm:text-lg text-[#1E1A17]">
            4. Store Policies
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#3B3229] uppercase mb-1">Shipping Policy</label>
            <textarea
              rows={3}
              value={settings.shippingPolicy}
              onChange={(e) => setSettings({ ...settings, shippingPolicy: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-[#1E1A17]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#3B3229] uppercase mb-1">Return & Replacement Policy</label>
            <textarea
              rows={3}
              value={settings.returnPolicy}
              onChange={(e) => setSettings({ ...settings, returnPolicy: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-[#1E1A17]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#3B3229] uppercase mb-1">Privacy Policy</label>
            <textarea
              rows={3}
              value={settings.privacyPolicy}
              onChange={(e) => setSettings({ ...settings, privacyPolicy: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-[#1E1A17]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#3B3229] uppercase mb-1">Terms of Service</label>
            <textarea
              rows={3}
              value={settings.termsConditions}
              onChange={(e) => setSettings({ ...settings, termsConditions: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-[#1E1A17]"
            />
          </div>
        </div>
      </div>

      {/* Bottom Save */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#1E1A17] hover:bg-black text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-xl transition-all cursor-pointer"
        >
          <Save className="w-4 h-4 text-[#D4AF37]" />
          <span>{isSaving ? 'Saving Changes...' : 'Save All Settings'}</span>
        </button>
      </div>
    </form>
  );
};
