'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface NavigationProps {
  isMobile?: boolean;
  onNavigate?: () => void;
}

// Basit chevron down SVG icon component'i
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

// Verdiğiniz kategorileri statik olarak tanımlayalım
const categories = [
  {
    id: '018c1cf11c3c704097cf9dab8bc32237',
    name: 'Catalogue #1',
    level: 1,
    children: [
      {
        id: '77b959cf66de4c1590c7f9b7da3982f3',
        name: 'Food',
        level: 2,
        children: [
          {
            id: '19ca405790ff4f07aac8c599d4317868',
            name: 'Bakery products',
            level: 3,
            children: []
          },
          {
            id: '48f97f432fd041388b2630184139cf0e',
            name: 'Fish',
            level: 3,
            children: []
          },
          {
            id: 'bb22b05bff9140f3808b1cff975b75eb',
            name: 'Sweets',
            level: 3,
            children: []
          }
        ]
      },
      {
        id: 'a515ae260223466f8e37471d279e6406',
        name: 'Clothing',
        level: 2,
        children: [
          {
            id: '8de9b484c54f441c894774e5f57e485c',
            name: 'Women',
            level: 3,
            children: []
          },
          {
            id: '2185182cbbd4462ea844abeb2a438b33',
            name: 'Men',
            level: 3,
            children: []
          }
        ]
      },
      {
        id: '251448b91bc742de85643f5fccd89051',
        name: 'Free time & electronics',
        level: 2,
        children: []
      }
    ]
  }
];

interface Category {
  id: string;
  name: string;
  level: number;
  children: Category[];
}

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ isMobile = false, onNavigate, className = '' }) => {
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  const toggleDropdown = (categoryId: string) => {
    console.log('Toggling dropdown for category:', categoryId);
    const newOpenDropdowns = new Set(openDropdowns);
    if (newOpenDropdowns.has(categoryId)) {
      newOpenDropdowns.delete(categoryId);
    } else {
      newOpenDropdowns.add(categoryId);
    }
    setOpenDropdowns(newOpenDropdowns);
    console.log('Open dropdowns after toggle:', Array.from(newOpenDropdowns));
  };

  const renderCategory = (category: Category, isTopLevel = false) => {
    const hasChildren = category.children.length > 0;
    const isOpen = openDropdowns.has(category.id);

    return (
      <div key={category.id} className="relative">
        <div className="flex items-center">
          <Link
            href={`/shop/category/${category.id}`}
            onClick={onNavigate}
            className={`
              ${isTopLevel 
                ? isMobile 
                  ? 'block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                  : 'flex items-center px-1 pt-4 pb-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 whitespace-nowrap transition-colors duration-200'
                : 'block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200'
              }
            `}
          >
            {category.name}
          </Link>
          
          {hasChildren && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown(category.id);
              }}
              className={`
                ml-1 p-1 rounded-md transition-colors duration-200
                ${isTopLevel 
                  ? 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }
              `}
            >
              <ChevronDownIcon 
                className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
          )}
        </div>

        {hasChildren && isOpen && (
          <div className={`
            ${isTopLevel 
              ? 'absolute left-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[9999] py-2' 
              : 'ml-4 mt-1 space-y-1'
            }
          `}>
            {category.children.map((child) => renderCategory(child, false))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={`navigation ${className}`}>
      <div className={isMobile ? "space-y-1" : "flex items-center space-x-6"}>
        {categories[0]?.children.map((category) => renderCategory(category, true))}
      </div>
    </nav>
  );
};

export default Navigation;