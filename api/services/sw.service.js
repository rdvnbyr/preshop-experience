const axios = require("axios");

class SWService {
  credential = null;
  constructor(clientId, clientSecret, domain) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.domain = domain;

    this.getToken();
  }

  get credential() {
    return this.credential;
  }

  getAuthHeader(credential) {
    return {
      Authorization: `${credential.token_type} ${credential.access_token}`,
      Accept: "application/json",
    };
  }

  async getToken() {
    try {
      const response = await axios.post(
        `https://${this.domain}/api/oauth/token`,
        {
          grant_type: "client_credentials",
          client_id: this.clientId,
          client_secret: this.clientSecret,
        },
      );

      this.credential = response.data;

      return response.data; // token_type, expires_in, access_token
    } catch (error) {
      const newError = new Error(
        error.message
          ? error.message
          : "Something went wrong while getting sw token",
      );
      throw newError;
    }
  }

  async getOrders(credential) {
    try {
      const response = await axios.get(`https://${this.domain}/api/order`, {
        headers: this.getAuthHeader(credential),
      });
      /* if (response.data && response.data.data.length > 0) {
        fs.writeFileSync("orders.json", JSON.stringify(response.data.data));
      } */
      return response.data;
    } catch (error) {
      console.error("Get orders error:", error);
      throw error;
    }
  }

  async getAPIRoutes(credential) {
    try {
      const response = await axios.get(
        `https://${this.domain}/api/_info/routes`,
        {
          headers: this.getAuthHeader(credential),
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getWebhookInfo(credential) {
    try {
      const response = await axios.get(`https://${this.domain}/api/webhook`, {
        headers: this.getAuthHeader(credential),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createWebhook(credential) {
    try {
      const response = await axios.post(`https://${this.domain}/api/webhook`, {
        headers: this.getAuthHeader(credential),
        body: {
          id: "0199abcd1234567890abcdef12345678",
          name: "ShopPay16 Order Created",
          eventName: "order.placed",
          url: "https://api.shoppay16.com/webhooks/order-created",
          onlyLiveVersion: true,
          active: true,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SWService;
