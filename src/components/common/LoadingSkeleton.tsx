import React from 'react';

export const ProductPageSkeleton: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Gallery Skeleton */}
        <div>
          <div className="w-full aspect-square bg-[#E8E2D8] rounded-2xl mb-4"></div>
          <div className="flex gap-3">
            <div className="w-20 h-20 bg-[#E8E2D8] rounded-lg"></div>
            <div className="w-20 h-20 bg-[#E8E2D8] rounded-lg"></div>
            <div className="w-20 h-20 bg-[#E8E2D8] rounded-lg"></div>
          </div>
        </div>

        {/* Right: Info Skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-[#E8E2D8] rounded w-1/4"></div>
          <div className="h-8 bg-[#E8E2D8] rounded w-3/4"></div>
          <div className="h-6 bg-[#E8E2D8] rounded w-1/3"></div>
          <div className="h-20 bg-[#E8E2D8] rounded-xl w-full"></div>
          <div className="h-12 bg-[#E8E2D8] rounded-full w-full"></div>
          <div className="h-12 bg-[#E8E2D8] rounded-full w-full"></div>
          <div className="h-40 bg-[#E8E2D8] rounded-xl w-full"></div>
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-3 animate-pulse">
      <div className="h-10 bg-[#E8E2D8] rounded-lg w-full"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 bg-[#F2EDE4] rounded-lg w-full"></div>
      ))}
    </div>
  );
};
