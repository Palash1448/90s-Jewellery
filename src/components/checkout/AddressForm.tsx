import React from 'react';
import { Home, MapPin, Building, Navigation, Globe, Sparkles, Truck } from 'lucide-react';
import type { Address } from '../../types';

interface AddressFormProps {
  data: Address;
  onChange: (data: Address) => void;
  errors: Record<string, string>;
}

const INDIAN_STATES = [
  'Andaman & Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chandigarh', 'Chhattisgarh', 'Dadra & Nagar Haveli and Daman & Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka',
  'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal'
];

export const AddressForm: React.FC<AddressFormProps> = ({ data, onChange, errors }) => {
  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    
    // Auto-detect Maharashtra if pincode starts with 40-44 and state is empty
    let autoState = data.state;
    if (!data.state && val.length >= 2) {
      const prefix = parseInt(val.substring(0, 2), 10);
      if (!isNaN(prefix) && prefix >= 40 && prefix <= 44) {
        autoState = 'Maharashtra';
      }
    }

    onChange({ ...data, pincode: val, state: autoState });
  };

  const isMaharashtra = (data.state || '').trim().toLowerCase() === 'maharashtra';

  return (
    <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-[#E8E2D8]">
        <div className="w-7 h-7 rounded-full bg-[#1E1A17] text-[#FAF8F5] flex items-center justify-center text-xs font-bold font-sans">
          2
        </div>
        <h2 className="font-display font-bold text-base sm:text-xl text-[#1E1A17]">
          Delivery Address
        </h2>
      </div>

      <div className="space-y-4">
        {/* House / Flat / Building */}
        <div>
          <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider mb-1.5">
            Flat / House No. / Building Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Home className="w-4 h-4 text-[#8A7D6E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="addressLine"
              autoComplete="address-line1"
              placeholder="e.g. Flat 402, Royal Palms Residency"
              value={data.addressLine}
              onChange={(e) => onChange({ ...data, addressLine: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 bg-white border ${
                errors.addressLine ? 'border-rose-500 ring-1 ring-rose-300' : 'border-[#D9CFBE] focus:border-[#BA9541]'
              } rounded-xl text-base sm:text-sm text-[#1E1A17] focus:outline-none transition-all`}
            />
          </div>
          {errors.addressLine && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.addressLine}</p>}
        </div>

        {/* Area / Street */}
        <div>
          <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider mb-1.5">
            Area / Street / Colony <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-[#8A7D6E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="area"
              autoComplete="address-line2"
              placeholder="e.g. 14th Main, Indiranagar"
              value={data.area}
              onChange={(e) => onChange({ ...data, area: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 bg-white border ${
                errors.area ? 'border-rose-500 ring-1 ring-rose-300' : 'border-[#D9CFBE] focus:border-[#BA9541]'
              } rounded-xl text-base sm:text-sm text-[#1E1A17] focus:outline-none transition-all`}
            />
          </div>
          {errors.area && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.area}</p>}
        </div>

        {/* Landmark */}
        <div>
          <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider mb-1.5">
            Landmark (Optional)
          </label>
          <div className="relative">
            <Navigation className="w-4 h-4 text-[#8A7D6E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="landmark"
              placeholder="e.g. Near HDFC Bank / Opp. Metro Station"
              value={data.landmark || ''}
              onChange={(e) => onChange({ ...data, landmark: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-white border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-base sm:text-sm text-[#1E1A17] focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* City & State */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider mb-1.5">
              City <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-[#8A7D6E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="city"
                autoComplete="address-level2"
                placeholder="e.g. Bengaluru / Mumbai"
                value={data.city}
                onChange={(e) => onChange({ ...data, city: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 bg-white border ${
                  errors.city ? 'border-rose-500 ring-1 ring-rose-300' : 'border-[#D9CFBE] focus:border-[#BA9541]'
                } rounded-xl text-base sm:text-sm text-[#1E1A17] focus:outline-none transition-all`}
              />
            </div>
            {errors.city && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.city}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider mb-1.5">
              State <span className="text-rose-500">*</span>
            </label>
            <select
              name="state"
              autoComplete="address-level1"
              value={data.state}
              onChange={(e) => onChange({ ...data, state: e.target.value })}
              className={`w-full px-4 py-3 bg-white border ${
                errors.state ? 'border-rose-500 ring-1 ring-rose-300' : 'border-[#D9CFBE] focus:border-[#BA9541]'
              } rounded-xl text-base sm:text-sm text-[#1E1A17] focus:outline-none transition-all cursor-pointer`}
            >
              <option value="">Select State</option>
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            {errors.state && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.state}</p>}
          </div>
        </div>

        {/* Pincode & Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider mb-1.5">
              Pincode (6 Digits) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="pincode"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={6}
              placeholder="e.g. 560038"
              value={data.pincode}
              onChange={handlePincodeChange}
              className={`w-full px-4 py-3 bg-white border ${
                errors.pincode ? 'border-rose-500 ring-1 ring-rose-300' : 'border-[#D9CFBE] focus:border-[#BA9541]'
              } rounded-xl text-base sm:text-sm font-semibold tracking-wider text-[#1E1A17] focus:outline-none transition-all`}
            />
            {errors.pincode && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.pincode}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider mb-1.5">
              Country
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-[#8A7D6E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="country"
                value="India"
                disabled
                className="w-full pl-10 pr-4 py-3 bg-[#F2EDE4] border border-[#D9CFBE] rounded-xl text-base sm:text-sm font-medium text-[#4A4036] cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Shipping Fee Banner based on State */}
        <div className="pt-1">
          {isMaharashtra ? (
            <div className="flex items-center gap-2 text-xs text-emerald-900 bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-xl font-medium">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Maharashtra Special:</strong> You qualify for <strong>FREE Insured Delivery (₹0)</strong>!
              </span>
            </div>
          ) : data.state ? (
            <div className="flex items-center gap-2 text-xs text-[#524436] bg-[#FAF3E0] border border-[#E8DCBE] px-3.5 py-2.5 rounded-xl font-medium">
              <Truck className="w-4 h-4 text-[#BA9541] shrink-0" />
              <span>
                <strong>{data.state}:</strong> Flat <strong>₹50 Standard Insured Delivery</strong> applied.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-[#73685C] bg-[#F5EFE6]/60 border border-[#E8E2D8] px-3.5 py-2.5 rounded-xl">
              <Truck className="w-4 h-4 text-[#BA9541] shrink-0" />
              <span>
                <strong>Free Delivery</strong> across Maharashtra • Flat <strong>₹50</strong> for other states.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
