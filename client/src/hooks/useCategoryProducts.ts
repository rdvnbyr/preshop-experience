import { useQuery } from '@tanstack/react-query';
import shopwareApi from '@/services/shopware';
import { ShopwareProductListingResponse, ShopwareProductListingParams } from '@/types/shopware';

export const useCategoryProducts = (
  categoryId: string,
  params: ShopwareProductListingParams = {}
) => {
  return useQuery<ShopwareProductListingResponse>({
    queryKey: ['categoryProducts', categoryId, params],
    queryFn: async () => {
      const response = await shopwareApi.getCategoryProducts(categoryId, params);
      return response;
    },
    enabled: !!categoryId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export default useCategoryProducts;