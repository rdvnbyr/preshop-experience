import { createAPIClient } from "@shopware/api-client";

// Create API client instance
export const swApiClient = createAPIClient({
  baseURL: process.env.NEXT_PUBLIC_SHOPWARE_ENDPOINT,
  accessToken: process.env.NEXT_PUBLIC_SHOPWARE_ACCESS_TOKEN,
});

// Export the client for direct usage
export type ApiClient = typeof swApiClient;

/**
 * Simple helper class for common Shopware API operations
 * Handles errors and provides easy-to-use methods
 */
export class SwApiClientHelper {
  /**
   * Get products with basic filtering
   */
  static async getProducts(params?: {
    limit?: number;
    page?: number;
    search?: string;
  }) {
    try {
      const body: Record<string, unknown> = {
        limit: params?.limit || 20,
        page: params?.page || 1,
        associations: {
          media: {},
          manufacturer: {},
          cover: {},
          categories: {},
          tax: {},
        },
      };

      if (params?.search) {
        body.term = params.search;
      }

      const response = await swApiClient.invoke("readProduct post /product", {
        body,
      });

      return response;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  /**
   * Search products
   */
  static async searchProducts(searchTerm: string, limit: number = 20) {
    try {
      const response = await swApiClient.invoke("searchPage post /search", {
        body: {
          search: searchTerm,
          limit,
          associations: {
            media: {},
            manufacturer: {},
            cover: {},
            categories: {},
          },
        },
      });

      return response;
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  }

  /**
   * Get single product by ID
   */
  static async getProduct(productId: string) {
    try {
      const response = await swApiClient.invoke("readProduct post /product", {
        body: {
          filter: [{ type: "equals", field: "id", value: productId }],
          associations: {
            media: {},
            manufacturer: {},
            cover: {},
            categories: {},
            tax: {},
            unit: {},
            crossSellings: {},
            productReviews: {},
          },
        },
      });

      return response;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }

  /**
   * Get cart
   */
  static async getCart() {
    try {
      const response = await swApiClient.invoke("readCart get /checkout/cart");
      return response;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  }

  /**
   * Add product to cart
   */
  static async addToCart(productId: string, quantity: number = 1) {
    try {
      const response = await swApiClient.invoke(
        "addLineItem post /checkout/cart/line-item",
        {
          body: {
            items: [
              {
                id: productId, // Use productId as id
                type: "product",
                referencedId: productId,
                quantity,
              },
            ],
          },
        },
      );

      return response;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  }

  /**
   * Customer login
   */
  static async loginCustomer(username: string, password: string) {
    try {
      const response = await swApiClient.invoke(
        "loginCustomer post /account/login",
        {
          body: {
            username,
            password,
          },
        },
      );

      return response;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  /**
   * Customer logout
   */
  static async logoutCustomer() {
    try {
      const response = await swApiClient.invoke(
        "logoutCustomer post /account/logout",
      );
      return response;
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }

  /**
   * Get customer profile
   */
  static async getCustomer() {
    try {
      const response = await swApiClient.invoke(
        "readCustomer post /account/customer",
      );
      return response;
    } catch (error) {
      console.error("Error fetching customer:", error);
      throw error;
    }
  }

  /**
   * Create order from current cart
   */
  static async createOrder(customerComment?: string) {
    try {
      const response = await swApiClient.invoke(
        "createOrder post /checkout/order",
        {
          body: {
            customerComment: customerComment || "",
          },
        },
      );

      return response;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  /**
   * Get customer orders
   */
  static async getOrders() {
    try {
      const response = await swApiClient.invoke("readOrder post /order", {
        body: {
          limit: 10,
          associations: {
            lineItems: {},
            addresses: {},
            deliveries: {},
            transactions: {},
          },
        },
      });

      return response;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  /**
   * Get countries for forms
   */
  static async getCountries() {
    try {
      const response = await swApiClient.invoke("readCountry post /country", {
        body: {
          filter: [{ type: "equals", field: "active", value: true }],
        },
      });

      return response;
    } catch (error) {
      console.error("Error fetching countries:", error);
      throw error;
    }
  }

  /**
   * Get salutations
   */
  static async getSalutations() {
    try {
      const response = await swApiClient.invoke(
        "readSalutation post /salutation",
        {
          body: {},
        },
      );

      return response;
    } catch (error) {
      console.error("Error fetching salutations:", error);
      throw error;
    }
  }
}

export default SwApiClientHelper;
