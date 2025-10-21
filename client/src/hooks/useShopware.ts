import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import shopwareApi from "@/services/shopware";
import {
  ShopwareCustomer,
  ShopwareProductListParams,
  ShopwareCategoryListParams,
  ShopwareProductDetailResponse,
  ShopwareCartLineItemRequest,
  ShopwareCustomerRegistrationRequest,
  ShopwareCustomerLoginRequest,
  ShopwareOrderRequest,
  ShopwareProductListingResponse,
  ShopwareProductListingParams,
} from "@/types/shopware";

// Query Keys
export const queryKeys = {
  products: ["products"] as const,
  productsList: (params: ShopwareProductListParams) =>
    ["products", "list", params] as const,
  product: (id: string) => ["products", id] as const,
  categories: ["categories"] as const,
  categoriesList: (params: ShopwareCategoryListParams) =>
    ["categories", "list", params] as const,
  category: (id: string) => ["categories", id] as const,
  categoryProducts: (
    categoryId: string,
    params: ShopwareProductListingParams,
  ) => ["categories", categoryId, "products", params] as const,
  navigationCategories: ["categories", "navigation"] as const,
  cart: ["cart"] as const,
  customer: ["customer"] as const,
  customerProfile: ["customer", "profile"] as const,
  orders: ["orders"] as const,
  ordersList: (page: number, limit: number) =>
    ["orders", "list", page, limit] as const,
  order: (id: string) => ["orders", id] as const,
  wishlist: ["wishlist"] as const,
};

// Product Hooks
export const useProducts = (params: ShopwareProductListParams = {}) => {
  return useQuery({
    queryKey: queryKeys.productsList(params),
    queryFn: () => shopwareApi.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProduct = (
  productId: string,
  associations?: Record<string, unknown>,
) => {
  return useQuery<ShopwareProductDetailResponse>({
    queryKey: queryKeys.product(productId),
    queryFn: () => shopwareApi.getProduct(productId, associations),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSearchProducts = (
  searchTerm: string,
  params: Omit<ShopwareProductListParams, "search"> = {},
) => {
  return useQuery({
    queryKey: ["products", "search", searchTerm, params],
    queryFn: () => shopwareApi.searchProducts(searchTerm, params),
    enabled: !!searchTerm && searchTerm.length >= 3,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Category Hooks
export const useCategories = (params: ShopwareCategoryListParams = {}) => {
  return useQuery({
    queryKey: queryKeys.categoriesList(params),
    queryFn: () => shopwareApi.getCategories(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCategory = (
  categoryId: string,
  associations?: Record<string, unknown>,
) => {
  return useQuery({
    queryKey: queryKeys.category(categoryId),
    queryFn: () => shopwareApi.getCategory(categoryId, associations),
    enabled: !!categoryId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useNavigationCategories = (depth = 2) => {
  return useQuery({
    queryKey: queryKeys.navigationCategories,
    queryFn: () => shopwareApi.getNavigationCategories(depth),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useCategoryProducts = (
  categoryId: string,
  params: ShopwareProductListingParams = {},
) => {
  return useQuery<ShopwareProductListingResponse>({
    queryKey: queryKeys.categoryProducts(categoryId, params),
    queryFn: () => shopwareApi.getCategoryProducts(categoryId, params),
    enabled: !!categoryId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Cart Hooks
export const useCart = () => {
  return useQuery({
    queryKey: queryKeys.cart,
    queryFn: () => shopwareApi.getCart(),
    staleTime: 0, // Always fresh
    refetchOnWindowFocus: true,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: ShopwareCartLineItemRequest[]) =>
      shopwareApi.addToCart(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lineItemId,
      quantity,
    }: {
      lineItemId: string;
      quantity: number;
    }) => shopwareApi.updateCartItem(lineItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lineItemIds: string[]) =>
      shopwareApi.removeFromCart(lineItemIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => shopwareApi.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
};

// Customer Hooks
export const useCustomerProfile = () => {
  return useQuery({
    queryKey: queryKeys.customerProfile,
    queryFn: () => shopwareApi.getCustomerProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry if not authenticated
  });
};

export const useRegisterCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ShopwareCustomerRegistrationRequest) =>
      shopwareApi.registerCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customer });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
};

export const useLoginCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ShopwareCustomerLoginRequest) =>
      shopwareApi.loginCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customer });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
};

export const useLogoutCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => shopwareApi.logoutCustomer(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKeys.customer });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
};

export const useUpdateCustomerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ShopwareCustomer>) =>
      shopwareApi.updateCustomerProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customerProfile });
    },
  });
};

// Order Hooks
export const useOrders = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: queryKeys.ordersList(page, limit),
    queryFn: () => shopwareApi.getOrders(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: queryKeys.order(orderId),
    queryFn: () => shopwareApi.getOrder(orderId),
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ShopwareOrderRequest = {}) =>
      shopwareApi.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
};

// Wishlist Hooks
export const useWishlist = () => {
  return useQuery({
    queryKey: queryKeys.wishlist,
    queryFn: () => shopwareApi.getWishlist(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: false, // Don't retry if not authenticated
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => shopwareApi.addToWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) =>
      shopwareApi.removeFromWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist });
    },
  });
};
