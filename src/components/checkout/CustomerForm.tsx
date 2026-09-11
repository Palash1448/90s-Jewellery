import React from 'react';
import { User, Mail } from 'lucide-react';

export interface CustomerFormData {
  name: string;
  mobile: string;
  whatsapp: string;
  email: string;
  isWhatsAppSame: boolean;
}

interface CustomerFormProps {
  data: CustomerFormData;
  onChange: (data: CustomerFormData) => void;
  errors: Record<string, string>;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ data, onChange, errors }) => {
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    const updated: CustomerFormData = {
      ...data,
      mobile: val,
      whatsapp: data.isWhatsAppSame ? val : data.whatsapp,
    };
    onChange(updated);
  };

  const handleWhatsAppSameToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    onChange({
      ...data,
      isWhatsAppSame: checked,
      whatsapp: checked ? data.mobile : data.whatsapp,
    });
  };

  return (
    <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-[#E8E2D8]">
        <div className="w-7 h-7 rounded-full bg-[#1E1A17] text-[#FAF8F5] flex items-center justify-center text-xs font-bold font-sans">
          1
        </div>
        <h2 className="font-display font-bold text-base sm:text-xl text-[#1E1A17]">
          Customer Information
        </h2>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-[#8A7D6E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="name"
              autoComplete="name"
              placeholder="e.g. Ananya Sharma"
              value={data.name}
              onChange={(e) => onChange({ ...data, name: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 bg-white border ${
                errors.name ? 'border-rose-500 ring-1 ring-rose-300' : 'border-[#D9CFBE] focus:border-[#BA9541]'
              } rounded-xl text-base sm:text-sm text-[#1E1A17] focus:outline-none transition-all`}
            />
          </div>
          {errors.name && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.name}</p>}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider mb-1.5">
            Mobile Number (10 Digits) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#7A6E60]">
              +91
            </span>
            <input
              type="tel"
              name="mobile"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              placeholder="98765 43210"
              value={data.mobile}
              onChange={handleMobileChange}
              className={`w-full pl-12 pr-4 py-3 bg-white border ${
                errors.mobile ? 'border-rose-500 ring-1 ring-rose-300' : 'border-[#D9CFBE] focus:border-[#BA9541]'
              } rounded-xl text-base sm:text-sm font-medium text-[#1E1A17] tracking-wide focus:outline-none transition-all`}
            />
          </div>
          {errors.mobile && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.mobile}</p>}
        </div>

        {/* WhatsApp Same Checkbox */}
        <div className="pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              name="isWhatsAppSame"
              checked={data.isWhatsAppSame}
              onChange={handleWhatsAppSameToggle}
              className="w-4 h-4 rounded text-[#BA9541] focus:ring-[#BA9541] border-[#C8BEAD] cursor-pointer"
            />
            <span className="text-xs sm:text-sm text-[#382F26] font-medium leading-snug">
              My WhatsApp number is the same as my mobile number
            </span>
          </label>
        </div>

        {/* Separate WhatsApp Field (if not same) */}
        {!data.isWhatsAppSame && (
          <div className="pt-1">
            <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider mb-1.5">
              WhatsApp Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#7A6E60]">
                +91
              </span>
              <input
                type="tel"
                name="whatsapp"
                inputMode="numeric"
                maxLength={10}
                placeholder="WhatsApp 10 digits"
                value={data.whatsapp}
                onChange={(e) =>
                  onChange({ ...data, whatsapp: e.target.value.replace(/[^0-9]/g, '').slice(0, 10) })
                }
                className={`w-full pl-12 pr-4 py-3 bg-white border ${
                  errors.whatsapp ? 'border-rose-500 ring-1 ring-rose-300' : 'border-[#D9CFBE] focus:border-[#BA9541]'
                } rounded-xl text-base sm:text-sm font-medium text-[#1E1A17] focus:outline-none transition-all`}
              />
            </div>
            {errors.whatsapp && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.whatsapp}</p>}
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-[#3B3229] uppercase tracking-wider mb-1.5">
            Email Address (For Invoice & Tracking)
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#8A7D6E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              name="email"
              inputMode="email"
              autoComplete="email"
              placeholder="ananya@example.com"
              value={data.email}
              onChange={(e) => onChange({ ...data, email: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-white border border-[#D9CFBE] focus:border-[#BA9541] rounded-xl text-base sm:text-sm text-[#1E1A17] focus:outline-none transition-all"
            />
          </div>
          {errors.email && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.email}</p>}
        </div>
      </div>
    </div>
  );
};
