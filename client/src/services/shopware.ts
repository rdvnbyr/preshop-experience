/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ShopwareProduct,
  ShopwareCategory,
  ShopwareCart,
  ShopwareCustomer,
  ShopwareOrder,
  ShopwareApiResponse,
  ShopwareListResponse,
  ShopwareProductListParams,
  ShopwareAssociation,
  ShopwareCategoryListParams,
  ShopwareCartLineItemRequest,
  ShopwareCustomerRegistrationRequest,
  ShopwareCustomerLoginRequest,
  ShopwareOrderRequest,
  ShopwareProductListingResponse,
  ShopwareProductListingParams,
  ShopwareProductDetailResponse,
} from "@/types/shopware";

class ShopwareApiService {
  private baseUrl: string;
  private storeApiKey: string;
  private contextToken: string | null = null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_SHOPWARE_ENDPOINT || "";
    this.storeApiKey = process.env.NEXT_PUBLIC_SHOPWARE_ACCESS_TOKEN || "";
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "sw-access-key": this.storeApiKey,
      // 'sw-language-id': 'b7d2554b0ce847cd82f3ac9bd1c0dfca', // Default language ID, adjust as needed
      ...(options.headers as Record<string, string>),
    };

    if (this.contextToken) {
      headers["sw-context-token"] = this.contextToken;
    }

    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    // Update context token if provided in response
    const newContextToken = response.headers.get("sw-context-token");
    if (newContextToken) {
      this.contextToken = newContextToken;
    }

    return response.json();
  }

  // Context management
  async createContext(): Promise<string> {
    const response = await this.makeRequest<{ "sw-context-token": string }>(
      "store-api/context",
    );
    this.contextToken = response["sw-context-token"];
    return this.contextToken;
  }

  setContextToken(token: string): void {
    this.contextToken = token;
  }

  getContextToken(): string | null {
    return this.contextToken;
  }

  // Product API
  async getProducts(
    params: ShopwareProductListParams = {},
  ): Promise<ShopwareListResponse<ShopwareProduct>> {
    return this.makeRequest<ShopwareListResponse<ShopwareProduct>>(
      "store-api/product",
      {
        method: "POST",
        body: JSON.stringify(params),
      },
    );
  }

  async getProduct(
    productId: string,
    options: {
      associations?: Record<string, any>;
      fields?: string[];
      includes?: Record<string, string[]>;
    } = {},
  ): Promise<ShopwareApiResponse<ShopwareProduct>> {
    const requestBody: any = {
      filter: [{ type: "equals", field: "id", value: productId }],
      associations: {
        media: {},
        manufacturer: {},
        cover: {},
        categories: {},
        tax: {},
        unit: {},
        deliveryTime: {},
        productReviews: {
          limit: 10,
          sort: [{ field: "createdAt", order: "DESC" }],
        },
        properties: {},
        options: {},
        configuratorSettings: {},
        crossSellings: {},
        ...options.associations,
      },
      ...(options.fields && { fields: options.fields }),
      ...(options.includes && { includes: options.includes }),
    };

    const endpoint = `store-api/product/${productId}`;

    // API returns product_detail response, we need to extract the product
    const response = await this.makeRequest<ShopwareProductDetailResponse>(
      endpoint,
      {
        method: "POST",
        body: JSON.stringify(requestBody),
      },
    );

    // Return wrapped in standard API response format for compatibility
    return response as unknown as ShopwareApiResponse<ShopwareProduct>;
  }

  async searchProducts(
    term: string,
    params: Omit<ShopwareProductListParams, "search"> = {},
  ): Promise<ShopwareListResponse<ShopwareProduct>> {
    return this.getProducts({
      ...params,
      search: term,
    });
  }

  // Category API
  async getCategories(
    params: ShopwareCategoryListParams = {},
  ): Promise<ShopwareListResponse<ShopwareCategory>> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.sort) searchParams.append("sort", params.sort);
    if (params["total-count-mode"])
      searchParams.append(
        "total-count-mode",
        params["total-count-mode"].toString(),
      );

    if (params.filter) {
      Object.entries(params.filter).forEach(([key, value]) => {
        searchParams.append(`filter[${key}]`, JSON.stringify(value));
      });
    }

    if (params.associations) {
      Object.entries(params.associations).forEach(([key, value]) => {
        searchParams.append(`associations[${key}]`, JSON.stringify(value));
      });
    }

    // const query = searchParams.toString();
    const endpoint = `store-api/category`;

    return this.makeRequest<ShopwareListResponse<ShopwareCategory>>(endpoint);
  }

  async getCategory(
    categoryId: string,
    associations?: Record<string, any>,
  ): Promise<ShopwareApiResponse<ShopwareCategory>> {
    const searchParams = new URLSearchParams();

    if (associations) {
      Object.entries(associations).forEach(([key, value]) => {
        searchParams.append(`associations[${key}]`, JSON.stringify(value));
      });
    }

    const endpoint = `store-api/category/${categoryId}`;

    return this.makeRequest<ShopwareApiResponse<ShopwareCategory>>(endpoint);
  }

  /**
   * Get products by category ID using product-listing endpoint
   */
  async getCategoryProducts(
    categoryId: string,
    params: ShopwareProductListingParams = {},
  ): Promise<ShopwareProductListingResponse> {
    const searchParams = new URLSearchParams();

    // Add pagination
    if (params.page) searchParams.append("p", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());

    // Add sorting
    if (params.order) searchParams.append("order", params.order);

    // Add search
    if (params.search) searchParams.append("search", params.search);

    // Add filters
    if (params["manufacturer[]"]) {
      params["manufacturer[]"].forEach((m) =>
        searchParams.append("manufacturer[]", m),
      );
    }

    if (params["min-price"] !== undefined)
      searchParams.append("min-price", params["min-price"].toString());
    if (params["max-price"] !== undefined)
      searchParams.append("max-price", params["max-price"].toString());

    if (params.rating) searchParams.append("rating", params.rating.toString());
    if (params["shipping-free"]) searchParams.append("shipping-free", "1");

    if (params["properties[]"]) {
      params["properties[]"].forEach((p) =>
        searchParams.append("properties[]", p),
      );
    }

    // const queryString = searchParams.toString();
    const endpoint = `store-api/product-listing/${categoryId}`;

    return this.makeRequest<ShopwareProductListingResponse>(endpoint, {
      method: "POST",
    });
  }

  async getNavigationCategories(
    depth = 2,
  ): Promise<ShopwareListResponse<ShopwareCategory>> {
    const associations: Record<string, ShopwareAssociation> = {
      children: {
        associations: depth > 1 ? { children: {} } : undefined,
      },
    };

    return this.getCategories({
      filter: [
        {
          type: "equals",
          field: "type",
          value: "page",
        },
        {
          type: "equals",
          field: "level",
          value: 1,
        },
        {
          type: "equals",
          field: "active",
          value: true,
        },
      ],
      associations,
    });
  }

  // Cart API
  async getCart(): Promise<ShopwareApiResponse<ShopwareCart>> {
    return this.makeRequest<ShopwareApiResponse<ShopwareCart>>(
      "store-api/checkout/cart",
    );
  }

  async addToCart(
    items: ShopwareCartLineItemRequest[],
  ): Promise<ShopwareApiResponse<ShopwareCart>> {
    return this.makeRequest<ShopwareApiResponse<ShopwareCart>>(
      "store-api/checkout/cart/line-item",
      {
        method: "POST",
        body: JSON.stringify({ items }),
      },
    );
  }

  async updateCartItem(
    lineItemId: string,
    quantity: number,
  ): Promise<ShopwareApiResponse<ShopwareCart>> {
    return this.makeRequest<ShopwareApiResponse<ShopwareCart>>(
      "store-api/checkout/cart/line-item",
      {
        method: "PATCH",
        body: JSON.stringify({
          items: [
            {
              id: lineItemId,
              quantity,
            },
          ],
        }),
      },
    );
  }

  async removeFromCart(
    lineItemIds: string[],
  ): Promise<ShopwareApiResponse<ShopwareCart>> {
    return this.makeRequest<ShopwareApiResponse<ShopwareCart>>(
      "store-api/checkout/cart/line-item",
      {
        method: "DELETE",
        body: JSON.stringify({ ids: lineItemIds }),
      },
    );
  }

  async clearCart(): Promise<ShopwareApiResponse<ShopwareCart>> {
    const cart = await this.getCart();
    const lineItemIds = cart.data.lineItems.map((item) => item.id);

    if (lineItemIds.length > 0) {
      return this.removeFromCart(lineItemIds);
    }

    return cart;
  }

  // Customer API
  async registerCustomer(
    data: ShopwareCustomerRegistrationRequest,
  ): Promise<ShopwareApiResponse<ShopwareCustomer>> {
    return this.makeRequest<ShopwareApiResponse<ShopwareCustomer>>(
      "store-api/account/register",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  }

  async loginCustomer(
    data: ShopwareCustomerLoginRequest,
  ): Promise<ShopwareApiResponse<ShopwareCustomer>> {
    return this.makeRequest<ShopwareApiResponse<ShopwareCustomer>>(
      "store-api/account/login",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  }

  async logoutCustomer(): Promise<void> {
    await this.makeRequest("store-api/account/logout", {
      method: "POST",
    });
    this.contextToken = null;
  }

  async getCustomerProfile(): Promise<ShopwareApiResponse<ShopwareCustomer>> {
    return this.makeRequest<ShopwareApiResponse<ShopwareCustomer>>(
      "store-api/account/customer",
    );
  }

  async updateCustomerProfile(
    data: Partial<ShopwareCustomer>,
  ): Promise<ShopwareApiResponse<ShopwareCustomer>> {
    return this.makeRequest<ShopwareApiResponse<ShopwareCustomer>>(
      "store-api/account/customer",
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
  }

  // Order API
  async createOrder(
    data: ShopwareOrderRequest = {},
  ): Promise<ShopwareApiResponse<ShopwareOrder>> {
    return this.makeRequest<ShopwareApiResponse<ShopwareOrder>>(
      "store-api/checkout/order",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  }

  async getOrders(
    page = 1,
    limit = 10,
  ): Promise<ShopwareListResponse<ShopwareOrder>> {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      "total-count-mode": "1",
    });

    return this.makeRequest<ShopwareListResponse<ShopwareOrder>>(
      `store-api/order?${searchParams.toString()}`,
    );
  }

  async getOrder(orderId: string): Promise<ShopwareApiResponse<ShopwareOrder>> {
    return this.makeRequest<ShopwareApiResponse<ShopwareOrder>>(
      `store-api/order/${orderId}`,
    );
  }

  // Wishlist API (if available)
  async getWishlist(): Promise<any> {
    return this.makeRequest("store-api/customer/wishlist");
  }

  async addToWishlist(productId: string): Promise<any> {
    return this.makeRequest("store-api/customer/wishlist/add", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
  }

  async removeFromWishlist(productId: string): Promise<any> {
    return this.makeRequest("store-api/customer/wishlist/delete", {
      method: "DELETE",
      body: JSON.stringify({ productId }),
    });
  }
}

// Create singleton instance
const shopwareApi = new ShopwareApiService();

export default shopwareApi;
