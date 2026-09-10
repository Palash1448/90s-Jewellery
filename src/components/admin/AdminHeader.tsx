import React from 'react';
import { Menu, Bell, ExternalLink, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminHeaderProps {
  onToggleMobileSidebar: () => void;
  title: string;
  subtitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleMobileSidebar,
  title,
  subtitle,
}) => {
  return (
    <header className="bg-white border-b border-[#E8E2D8] px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-[#1E1A17] hover:bg-[#F5EFE6] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="font-display font-bold text-lg sm:text-xl text-[#1E1A17]">{title}</h1>
          {subtitle && <p className="text-xs text-[#73685C] mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Firebase Secure Admin</span>
        </span>

        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs font-semibold bg-[#FAF6EE] hover:bg-[#F3EBDB] text-[#805E25] px-3 py-1.5 rounded-lg border border-[#E0D4BD] transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Customer Store</span>
        </Link>
      </div>
    </header>
  );
};
