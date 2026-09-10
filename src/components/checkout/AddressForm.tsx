import React from 'react';
import { Home, MapPin, Building, Navigation, Globe } from 'lucide-react';
import type { Address } from '../../types';

interface AddressFormProps {
  data: Address;
  onChange: (data: Address) => void;
  errors: Record<string, string>;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir'
];

export const AddressForm: React.FC<AddressFormProps> = ({ data, onChange, errors }) => {
  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    onChange({ ...data, pincode: val });
  };

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
              value={data.state}
              onChange={(e) => onChange({ ...data, state: e.target.value })}
              className={`w-full px-4 py-3 bg-white border ${
                errors.state ? 'border-rose-500 ring-1 ring-rose-300' : 'border-[#D9CFBE] focus:border-[#BA9541]'
              } rounded-xl text-base sm:text-sm text-[#1E1A17] focus:outline-none transition-all`}
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
      </div>
    </div>
  );
};
