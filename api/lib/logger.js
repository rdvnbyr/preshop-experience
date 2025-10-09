// Logger integration for API
const { 
  checkoutLogger,
  productCatalogLogger,
  accountLogger,
  intershopApiLogger,
  storyblokCmsLogger,
  systemLogger,
  LogChannel
} = require("@exp-places-app/logger");

// Export channel loggers for backwards compatibility
const log = {
  checkout: checkoutLogger.get(),
  catalog: productCatalogLogger.get(),
  account: accountLogger.get(),
  order: checkoutLogger.get(), // Order logs go to checkout
  system: systemLogger.get(),
  webhook: systemLogger.get(), // Webhooks go to system
  payment: checkoutLogger.get(), // Payment logs go to checkout
  shipping: checkoutLogger.get(), // Shipping logs go to checkout
  api: intershopApiLogger.get(), // External API calls
  cms: storyblokCmsLogger.get(), // CMS operations
};

// Legacy function for backwards compatibility
const getLoggerByChannel = (channel) => {
  return log[channel] || systemLogger.get();
};

module.exports = {
  log,
  getLoggerByChannel,
  // Direct channel exports
  checkoutLogger: checkoutLogger.get(),
  productCatalogLogger: productCatalogLogger.get(),
  accountLogger: accountLogger.get(),
  intershopApiLogger: intershopApiLogger.get(),
  storyblokCmsLogger: storyblokCmsLogger.get(),
  systemLogger: systemLogger.get()
};