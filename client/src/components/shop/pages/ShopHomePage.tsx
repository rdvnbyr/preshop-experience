'use client';

import React, { useState } from 'react';
import { useProducts } from '@/hooks/useShopware';
import { ShopwareProduct } from '@/types/shopware';
import ProductCard from '../products/ProductCard';
import ProductsLoading from '../products/ProductsLoading';
import Button from '@/components/ui/button/Button';

const ShopHomePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const pageSize = 12;

  const { data: productsData, isLoading, error } = useProducts({
    page: currentPage,
    limit: pageSize,
    sort: sortBy,
    associations: {
      media: {},
      manufacturer: {},
      categories: {},
    },
  });

  // Handle both possible response structures
  const responseData = productsData as unknown as { elements?: unknown[]; data?: unknown[]; total?: number; meta?: { total?: number } };
  const products = responseData?.elements || responseData?.data || [];
  const totalCount = responseData?.total || responseData?.meta?.total || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Bir hata oluştu</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ürünler yüklenirken bir sorun meydana geldi. Lütfen daha sonra tekrar deneyin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Best Products, Best Prices
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Discover the most suitable ones for you among thousands of products
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="md">
                Explore Categories
              </Button>
              <Button variant="outline" size="md">
                View Deals
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              All Products
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {totalCount} products found
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="mt-4 sm:mt-0">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">By Name (A-Z)</option>
              <option value="-name">By Name (Z-A)</option>
              <option value="price">By Price (Low to High)</option>
              <option value="-price">By Price (High to Low)</option>
              <option value="createdAt">By Newest</option>
              <option value="-createdAt">By Oldest</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <ProductsLoading />
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product: unknown) => {
                const prod = product as { id?: string };
                return (
                  <ProductCard key={prod.id || Math.random()} product={product as ShopwareProduct} />
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (page > totalPages) return null;
                  
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === page
                          ? 'text-blue-600 bg-blue-50 border border-blue-300 dark:bg-blue-900 dark:text-blue-300'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0H4m16 0l-2-2m0 0l-2-2m2 2l2-2m-2 2l2 2M4 13l2-2m0 0l2-2m-2 2l-2-2m2 2l-2 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Ürün bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Aradığınız kriterlere uygun ürün bulunmuyor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopHomePage;