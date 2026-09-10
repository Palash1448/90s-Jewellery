import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  description = 'There are no items matching your criteria at the moment.',
  actionText,
  actionHref,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-[#FAF8F5] rounded-2xl border border-[#E8E2D8] my-6">
      <div className="w-16 h-16 rounded-full bg-[#F3ECE0] flex items-center justify-center text-[#BA9541] mb-4">
        {icon || <PackageOpen className="w-8 h-8" />}
      </div>
      <h3 className="font-display font-bold text-lg sm:text-xl text-[#1E1A17] mb-2">{title}</h3>
      <p className="text-sm text-[#73685C] max-w-md mb-6">{description}</p>

      {actionText && actionHref && (
        <Link
          to={actionHref}
          className="bg-gold-gradient text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow hover:opacity-95 transition-opacity"
        >
          {actionText}
        </Link>
      )}

      {actionText && !actionHref && onAction && (
        <button
          onClick={onAction}
          className="bg-gold-gradient text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow hover:opacity-95 transition-opacity"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
