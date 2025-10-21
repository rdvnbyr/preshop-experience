# Logger Package Integration Beispiele

## Verwendung in API Controllern

### Checkout Controller

```javascript
const { log } = require("../lib/logger");

// In placeController.js oder checkoutController.js
exports.createOrder = async (req, res) => {
  const { userId, items } = req.body;

  log.checkout.info("Order creation started", {
    userId,
    itemCount: items.length,
    requestId: req.id,
  });

  try {
    // Order processing logic
    const order = await processOrder(items);

    log.checkout.info("Order created successfully", {
      orderId: order.id,
      userId,
      total: order.total,
      items: items.length,
    });

    res.json({ success: true, order });
  } catch (error) {
    log.checkout.error("Order creation failed", {
      userId,
      error: error.message,
      stack: error.stack,
    });

    res.status(500).json({ error: "Order creation failed" });
  }
};
```

### Product Catalog Controller

```javascript
const { productCatalogLogger } = require("../lib/logger");

exports.getProducts = async (req, res) => {
  const { category, search } = req.query;

  productCatalogLogger.info("Product search initiated", {
    category,
    search,
    userAgent: req.get("User-Agent"),
  });

  try {
    const products = await Product.find(searchQuery);

    productCatalogLogger.debug("Products retrieved", {
      count: products.length,
      category,
      search,
      duration: Date.now() - startTime,
    });

    res.json(products);
  } catch (error) {
    productCatalogLogger.error("Product search failed", {
      category,
      search,
      error: error.message,
    });

    res.status(500).json({ error: "Search failed" });
  }
};
```

### Account Controller

```javascript
const { accountLogger } = require("../lib/logger");

exports.login = async (req, res) => {
  const { email, ip } = req.body;

  accountLogger.info("Login attempt", {
    email: email.toLowerCase(),
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  try {
    const user = await User.findOne({ email });

    if (!user) {
      accountLogger.warn("Login failed - user not found", {
        email: email.toLowerCase(),
        ip: req.ip,
      });
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Password verification...

    accountLogger.info("Login successful", {
      userId: user.id,
      email: email.toLowerCase(),
      lastLogin: user.lastLogin,
    });

    res.json({ user, token });
  } catch (error) {
    accountLogger.error("Login error", {
      email: email.toLowerCase(),
      error: error.message,
      stack: error.stack,
    });

    res.status(500).json({ error: "Login failed" });
  }
};
```

### External API Calls

```javascript
const { intershopApiLogger } = require("../lib/logger");
const axios = require("axios");

exports.syncProducts = async () => {
  const startTime = Date.now();

  intershopApiLogger.info("Intershop sync started");

  try {
    const response = await axios.get("https://api.intershop.com/products");

    intershopApiLogger.info("Intershop API call successful", {
      endpoint: "/products",
      status: response.status,
      productCount: response.data.length,
      duration: Date.now() - startTime,
    });

    return response.data;
  } catch (error) {
    intershopApiLogger.error("Intershop API call failed", {
      endpoint: "/products",
      status: error.response?.status,
      message: error.message,
      duration: Date.now() - startTime,
    });

    throw error;
  }
};
```

### CMS Operations

```javascript
const { storyblokCmsLogger } = require("../lib/logger");

exports.getContent = async (slug) => {
  storyblokCmsLogger.info("Fetching content from Storyblok", { slug });

  try {
    const content = await storyblokClient.get(`cdn/stories/${slug}`);

    storyblokCmsLogger.info("Content retrieved successfully", {
      slug,
      contentType: content.data.story.content.component,
      lastModified: content.data.story.published_at,
    });

    return content.data.story;
  } catch (error) {
    storyblokCmsLogger.error("Failed to fetch content", {
      slug,
      error: error.message,
      status: error.response?.status,
    });

    throw error;
  }
};
```

## Middleware Logging

```javascript
const { systemLogger } = require("../lib/logger");

// HTTP Request Logger Middleware
app.use((req, res, next) => {
  const startTime = Date.now();

  systemLogger.http("HTTP Request", {
    method: req.method,
    url: req.url,
    userAgent: req.get("User-Agent"),
    ip: req.ip,
  });

  res.on("finish", () => {
    systemLogger.http("HTTP Response", {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: Date.now() - startTime,
    });
  });

  next();
});
```

## Verfügbare Commands

### Development

```bash
# Alle Services starten
npm run dev

# Nur API
npm run dev:api

# Nur Client
npm run dev:client

# Nur Logger (Watch Mode)
npm run dev:logger
```

### Production

```bash
# Alle Services bauen
npm run build

# Services starten
npm run start
```

### Logger spezifisch

```bash
# Logger Package bauen
npm run build:logger

# Logger Tests
cd packages/logger && npm test
```

## Log Files

- `./api/logs/YYYY-MM-DD-combined.log` - Alle Logs
- `./api/logs/YYYY-MM-DD-error.log` - Nur Fehler
- `./api/logs/exceptions.log` - Uncaught Exceptions
- `./api/logs/rejections.log` - Unhandled Promise Rejections
