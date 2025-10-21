import { createAdminAPIClient } from "@shopware/api-client";

const env = process.env;

export class ShopwareAdminApiClient {
  private client: ReturnType<typeof createAdminAPIClient>;

  constructor() {
    this.client = createAdminAPIClient({
      baseURL: `${env.NEXT_PUBLIC_SHOPWARE_ENDPOINT || env.SHOPWARE_ENDPOINT}/api`,
      credentials: {
        client_id: "administration",
        grant_type: "password",
        scopes: "write",
        username:
          env.NEXT_PUBLIC_SHOPWARE_ADMIN_USERNAME ||
          env.SHOPWARE_ADMIN_USERNAME ||
          "",
        password:
          env.NEXT_PUBLIC_SHOPWARE_ADMIN_PASSWORD ||
          env.SHOPWARE_ADMIN_PASSWORD ||
          "",
      },
    });
  }

  getClient() {
    if (!this.client) {
      throw new Error("Shopware Admin API Client is not initialized.");
    }
    return this.client;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.client.invoke("getAppList get /app", {
        limit: 1,
      });
      return true;
    } catch (error) {
        console.error("Error testing Shopware Admin API connection:",error instanceof Error ? error.message : "");
        return false;
    }
  }
}
