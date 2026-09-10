import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseMobile }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Products Catalog', icon: Package },
    { to: '/admin/products/new', label: '+ Add Product', icon: PlusCircle },
    { to: '/admin/orders', label: 'Orders & Sales', icon: ShoppingBag },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#191512] text-[#E8E2D8] min-h-screen flex flex-col border-r border-[#2C241E]">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#2C241E]">
        <Link to="/" target="_blank" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#947127] to-[#D4AF37] flex items-center justify-center text-white font-serif font-bold text-xs shadow">
            90s
          </div>
          <div>
            <span className="font-display font-bold text-sm text-[#FAF8F5] tracking-wider block">
              90s chya athavani
            </span>
            <span className="text-[10px] text-[#BA9541] tracking-widest uppercase font-semibold block">
              Admin Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? 'bg-[#BA9541] text-[#191512] shadow font-bold'
                  : 'text-[#B8AEA0] hover:bg-[#251E19] hover:text-[#FAF8F5]'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info & Footer */}
      <div className="p-3 border-t border-[#2C241E] space-y-2">
        <div className="px-3 py-2 bg-[#251E19] rounded-xl text-xs">
          <span className="text-[10px] text-[#8C8072] block uppercase tracking-wider">Logged in as</span>
          <span className="font-medium text-[#FAF8F5] truncate block">{user?.email || 'admin@90schyaathavanijewellery.com'}</span>
        </div>

        <Link
          to="/"
          target="_blank"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#D4AF37] bg-[#251E19] hover:bg-[#2F2720] transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View Customer Store</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
