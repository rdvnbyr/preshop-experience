'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartContext } from '@/context/CartContext';
import Button from '@/components/ui/button/Button';
import InputField from '@/components/form/input/InputField';
import Navigation from '@/components/shop/navigation/Navigation';

const ShopHeader: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { itemCount, setIsCartOpen } = useCartContext();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/shop/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-50 dark:bg-gray-800 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="text-gray-600 dark:text-gray-300">
              Free shipping on orders over $50
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/shop/account/signin" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Sign In
              </Link>
              <Link href="/shop/account/signup" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/shop" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                Shop
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full flex">
              <InputField
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 rounded-r-none"
              />
              <Button
                type="submit"
                variant="primary"
                className="rounded-l-none px-6"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Button>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.4M7 13h10m-10 0L7 13" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex space-x-8 relative">
            <Link
              href="/shop"
              className="flex items-center px-1 pt-4 pb-4 text-sm font-medium text-gray-900 dark:text-white border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 whitespace-nowrap"
            >
              All Products
            </Link>
            <Navigation />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          {/* Mobile Search */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSearch} className="flex">
              <InputField
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 rounded-r-none"
              />
              <Button
                type="submit"
                variant="primary"
                className="rounded-l-none px-4"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Button>
            </form>
          </div>

          {/* Mobile Navigation */}
          <div className="py-3 space-y-1">
            <Link
              href="/shop"
              className="block px-4 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              All Products
            </Link>
            <Navigation isMobile onNavigate={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
};

export default ShopHeader;