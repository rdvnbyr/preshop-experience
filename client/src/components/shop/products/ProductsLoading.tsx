'use client';

import React from 'react';

const ProductsLoading: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(12)].map((_, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
          {/* Image Skeleton */}
          <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
          
          {/* Content Skeleton */}
          <div className="p-4">
            {/* Manufacturer */}
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/3" />
            
            {/* Product Name */}
            <div className="space-y-2 mb-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </div>
            
            {/* Price */}
            <div className="flex items-center gap-2 mb-3">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              ))}
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8 ml-1" />
            </div>
            
            {/* Button */}
            <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsLoading;