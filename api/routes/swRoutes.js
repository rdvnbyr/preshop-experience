const express = require("express");
const router = express.Router();
const httpLogger = require("../middleware/http-logger");

router.use(httpLogger);

const {
  getToken,
  getOrders,
  getAPIRoutes,
  getWebhookInfo,
  createWebhook,
} = require("../controllers/swController.js");

router.route("/token").get(getToken);
router.route("/orders").get(getOrders);
router.route("/info").get(getAPIRoutes);
router.route("/webhook").get(getWebhookInfo).post(createWebhook);

module.exports = router;
