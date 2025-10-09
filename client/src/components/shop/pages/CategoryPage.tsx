'use client';

import React, { useState } from 'react';
import { useCategory, useCategoryProducts } from '@/hooks/useShopware';
import ProductCard from '../products/ProductCard';
import ProductsLoading from '../products/ProductsLoading';
import Button from '@/components/ui/button/Button';

interface CategoryPageProps {
  categorySlug: string;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categorySlug }) => {
  const [sortBy, setSortBy] = useState<string>('name');
  const [limit, setLimit] = useState<number>(12);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetch category
  const { data: category, isLoading: categoryLoading, error: categoryError } = useCategory(categorySlug);

  // Fetch products for this category
  const { 
    data: productsData, 
    isLoading: productsLoading, 
    error: productsError 
  } = useCategoryProducts(categorySlug, {
    page: currentPage,
    limit,
    order: sortBy
  });

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (categoryLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
        </div>
        <ProductsLoading />
      </div>
    );
  }

  if (categoryError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Category could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Category Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">
            The requested category could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {category?.data?.name}
        </h1>
        {category?.data?.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {category.data.description}
          </p>
        )}
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Sort By */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
            <label htmlFor="limit" className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
              {productsData?.total || 0} products found
            </p>
          )}
        </div>
      </div>

      {/* Products */}
      {productsLoading ? (
        <ProductsLoading />
      ) : productsError ? (
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">
            Products could not be loaded.
          </p>
        </div>
      ) : !productsData?.elements?.length ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No products found in this category.
          </p>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {productsData.elements.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {productsData?.total && productsData.total > limit && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, productsData.total)} of {productsData.total} results
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
                    { length: Math.min(5, Math.ceil(productsData.total / limit)) },
                    (_, index) => {
                      const totalPages = Math.ceil(productsData.total / limit);
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
                          variant={currentPage === pageNumber ? 'primary' : 'outline'}
                          size="sm"
                          className="min-w-[40px]"
                        >
                          {pageNumber}
                        </Button>
                      );
                    }
                  )}
                </div>

                {/* Next Button */}
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= Math.ceil(productsData.total / limit)}
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
  );
};

export default CategoryPage;