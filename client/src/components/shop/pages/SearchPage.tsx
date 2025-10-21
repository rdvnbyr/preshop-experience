"use client";

import React, { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useShopware";
import ProductCard from "../products/ProductCard";
import ProductsLoading from "../products/ProductsLoading";
import Button from "@/components/ui/button/Button";

interface SearchPageProps {
  initialQuery?: string;
}

const SearchPage: React.FC<SearchPageProps> = ({ initialQuery = "" }) => {
  const [searchTerm, setSearchTerm] = useState<string>(initialQuery);
  const [query, setQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<string>("name");
  const [limit, setLimit] = useState<number>(12);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetch products based on search
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useProducts({
    page: currentPage,
    limit,
    sort: sortBy,
    search: query,
  });

  // Update search term when initialQuery changes
  useEffect(() => {
    if (initialQuery) {
      setSearchTerm(initialQuery);
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(searchTerm);
    setCurrentPage(1);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
    setCurrentPage(1);
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Search Products
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Find exactly what you&apos;re looking for
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button type="submit" variant="primary" size="md">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Results Header */}
        {query && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Search Results
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Results for: &quot;{query}&quot;
              </p>
            </div>
          </div>
        )}

        {/* Filters and Sorting */}
        {query && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Sort By */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={handleSortChange}
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">By Name (A-Z)</option>
                  <option value="-name">By Name (Z-A)</option>
                  <option value="price">By Price (Low to High)</option>
                  <option value="-price">By Price (High to Low)</option>
                  <option value="createdAt">By Newest</option>
                  <option value="-createdAt">By Oldest</option>
                </select>
              </div>

              {/* Items per page */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="limit"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Show:
                </label>
                <select
                  id="limit"
                  value={limit}
                  onChange={handleLimitChange}
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={12}>12 items</option>
                  <option value={24}>24 items</option>
                  <option value={48}>48 items</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {productsData && (
                <p className="text-gray-600 dark:text-gray-400">
                  {productsData?.meta?.total || 0} products found
                </p>
              )}
            </div>
          </div>
        )}

        {/* Search Results */}
        {!query ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M16.65 11a5.65 5.65 0 11-11.3 0 5.65 5.65 0 0111.3 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Start your search
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Enter keywords to find the products you&apos;re looking for.
              </p>
            </div>
          </div>
        ) : productsLoading ? (
          <ProductsLoading />
        ) : productsError ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">
              An error occurred while searching. Please try again.
            </p>
          </div>
        ) : !productsData?.data?.length ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M16.65 11a5.65 5.65 0 11-11.3 0 5.65 5.65 0 0111.3 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No products found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                No products found for &quot;{query}&quot;. Try adjusting your
                search or using different keywords.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {productsData.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {productsData?.meta && productsData.meta.total > limit && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {(currentPage - 1) * limit + 1} to{" "}
                  {Math.min(currentPage * limit, productsData.meta.total)} of{" "}
                  {productsData.meta.total} results
                </div>

                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from(
                      {
                        length: Math.min(
                          5,
                          Math.ceil(productsData.meta.total / limit),
                        ),
                      },
                      (_, index) => {
                        const totalPages = Math.ceil(
                          productsData.meta.total / limit,
                        );
                        let pageNumber;

                        if (totalPages <= 5) {
                          pageNumber = index + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = index + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + index;
                        } else {
                          pageNumber = currentPage - 2 + index;
                        }

                        return (
                          <Button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            variant={
                              currentPage === pageNumber ? "primary" : "outline"
                            }
                            size="sm"
                            className="min-w-[40px]"
                          >
                            {pageNumber}
                          </Button>
                        );
                      },
                    )}
                  </div>

                  {/* Next Button */}
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={
                      currentPage >= Math.ceil(productsData.meta.total / limit)
                    }
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
