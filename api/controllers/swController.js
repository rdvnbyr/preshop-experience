const SWService = require("../services/sw.service");

const getToken = async (req, res) => {
  try {
    const sw = new SWService(
      process.env.SW_CLIENT_ID,
      process.env.SW_CLIENT_SECRET,
      process.env.SW_DOMAIN
    );
    const token = await sw.getToken();
    res.json(token);
  } catch (error) {
    console.error("Get token error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const sw = new SWService(
      process.env.SW_CLIENT_ID,
      process.env.SW_CLIENT_SECRET,
      process.env.SW_DOMAIN
    );
    const credential = await sw.getToken();
    const orders = await sw.getOrders(credential);
    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getAPIRoutes = async (req, res) => {
  try {
    const sw = new SWService(
      process.env.SW_CLIENT_ID,
      process.env.SW_CLIENT_SECRET,
      process.env.SW_DOMAIN
    );
    const credential = await sw.getToken();
    const routes = await sw.getAPIRoutes(credential);
    res.json(routes);
  } catch (error) {
    console.error("Get API routes error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getWebhookInfo = async (req, res) => {
  try {
    const sw = new SWService(
      process.env.SW_CLIENT_ID,
      process.env.SW_CLIENT_SECRET,
      process.env.SW_DOMAIN
    );
    const credential = await sw.getToken();
    const webhookInfo = await sw.getWebhookInfo(credential);
    res.json(webhookInfo);
  } catch (error) {
    console.error("Get webhook info error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const createWebhook = async (req, res) => {
  try {
    const sw = new SWService(
      process.env.SW_CLIENT_ID,
      process.env.SW_CLIENT_SECRET,
      process.env.SW_DOMAIN
    );
    const credential = await sw.getToken();
    const webhookInfo = await sw.createWebhook(credential);
    res.json(webhookInfo);
  } catch (error) {
    console.error("Create webhook error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getToken,
  getOrders,
  getAPIRoutes,
  getWebhookInfo,
  createWebhook,
};
