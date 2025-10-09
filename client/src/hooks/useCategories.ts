import React from 'react';
import { useQuery } from '@tanstack/react-query';
import shopwareApi from '../services/shopware';
import { ShopwareListResponse, ShopwareCategory } from '../types/shopware';

export interface CategoryItem {
  id: string;
  name: string;
  translated?: {
    name?: string;
    breadcrumb?: string[];
  };
  breadcrumb: string[];
  path: string | null;
  level: number;
  active: boolean;
  childCount: number;
  visibleChildCount: number;
  parentId: string | null;
  visible: boolean;
  type: string;
  productAssignmentType: string;
  children?: CategoryItem[];
}

export interface CategoryResponse {
  elements: CategoryItem[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Hook to fetch all categories
 */
export const useCategories = () => {
  return useQuery<ShopwareListResponse<ShopwareCategory>>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await shopwareApi.getCategories();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get navigation structure (hierarchical categories)
 */
export const useNavigation = () => {
  const { data: categories, ...query } = useCategories();

  const navigationData = React.useMemo(() => {
    if (!categories?.data) return [];

    // Build hierarchical structure
    const categoryMap = new Map<string, ShopwareCategory & { children: ShopwareCategory[] }>();
    const rootCategories: (ShopwareCategory & { children: ShopwareCategory[] })[] = [];

    // First pass: create all category nodes
    categories.data.forEach((category: ShopwareCategory) => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Second pass: build hierarchy
    categories.data.forEach((category: ShopwareCategory) => {
      const categoryNode = categoryMap.get(category.id)!;
      
      if (category.parent?.id) {
        const parent = categoryMap.get(category.parent.id);
        if (parent) {
          parent.children.push(categoryNode);
        }
      } else {
        rootCategories.push(categoryNode);
      }
    });

    return rootCategories;
  }, [categories]);

  return {
    ...query,
    data: navigationData,
  };
};

/**
 * Hook to get category by ID
 */
export const useCategory = (categoryId: string) => {
  return useQuery<ShopwareCategory>({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const response = await shopwareApi.getCategory(categoryId);
      return response.data;
    },
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
};