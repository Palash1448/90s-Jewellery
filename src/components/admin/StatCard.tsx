import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  subtitle?: string;
  colorVariant?: 'gold' | 'emerald' | 'blue' | 'rose' | 'amber';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  colorVariant = 'gold',
}) => {
  const colorMap = {
    gold: 'bg-[#FAF3E0] text-[#947127] border-[#E8DCBE]',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
  }[colorVariant];

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E8E2D8] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-[#73685C] uppercase tracking-wider block">
            {title}
          </span>
          <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#1E1A17] mt-1">
            {value}
          </h3>
        </div>

        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${colorMap}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(trend || subtitle) && (
        <div className="mt-3.5 pt-3 border-t border-[#F0EAE0] flex items-center justify-between text-xs">
          {subtitle && <span className="text-[#8A7D6E]">{subtitle}</span>}
          {trend && <span className="font-semibold text-emerald-600">{trend}</span>}
        </div>
      )}
    </div>
  );
};
