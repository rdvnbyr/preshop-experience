"use client";

import React, { useState } from "react";
import { useProducts } from "@/hooks/useShopware";
import { ShopwareProduct } from "@/types/shopware";
import ProductCard from "../products/ProductCard";
import ProductsLoading from "../products/ProductsLoading";
import Button from "@/components/ui/button/Button";
import { ShopwareAdminApiClient } from "@/services/shopware/admin-api";

const ShopHomePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const pageSize = 12;

  const {
    data: productsData,
    isLoading,
    error,
  } = useProducts({
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
  const responseData = productsData as unknown as {
    elements?: unknown[];
    data?: unknown[];
    total?: number;
    meta?: { total?: number };
  };
  const products = responseData?.elements || responseData?.data || [];
  const totalCount = responseData?.total || responseData?.meta?.total || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">
            Bir hata oluştu
          </h1>
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              const adminApiClient = new ShopwareAdminApiClient();
              adminApiClient.testConnection();
            }}
          >
            Testing
          </Button>
          <p className="text-gray-600 dark:text-gray-400">
            Ürünler yüklenirken bir sorun meydana geldi. Lütfen daha sonra
            tekrar deneyin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
              Best Products, Best Prices
            </h1>
            <p className="mb-8 text-xl text-gray-600 dark:text-gray-400">
              Discover the most suitable ones for you among thousands of
              products
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
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
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
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
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product: unknown) => {
                const prod = product as { id?: string };
                return (
                  <ProductCard
                    key={prod.id || Math.random()}
                    product={product as ShopwareProduct}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page =
                    Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (page > totalPages) return null;

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`rounded-md px-3 py-2 text-sm font-medium ${
                        currentPage === page
                          ? "border border-blue-300 bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                          : "border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-16 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0H4m16 0l-2-2m0 0l-2-2m2 2l2-2m-2 2l2 2M4 13l2-2m0 0l2-2m-2 2l-2-2m2 2l-2 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Ürün bulunamadı
            </h3>
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
