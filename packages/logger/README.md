# @exp-places-app/logger

Professional Winston-based logging infrastructure with channel support for structured, scalable logging.

## Features

- ✅ **Channel-based logging** - Separate log channels for different application areas
- ✅ **Winston integration** - Professional logging with multiple transports
- ✅ **TypeScript support** - Full type safety and IDE support
- ✅ **File rotation** - Daily log rotation with configurable retention
- ✅ **Console migration** - Drop-in replacement for console.log/warn/error
- ✅ **Structured metadata** - Rich context and metadata support
- ✅ **Environment-aware** - Different configurations for dev/staging/prod

## Installation

```bash
npm install @exp-places-app/logger
```

## Quick Start

```typescript
import { setupLogger, systemLogger } from "@exp-places-app/logger";

// Initialize logger
setupLogger({
  level: "info",
  environment: "development",
  enableFileLogging: true,
});

// Use system logger
systemLogger.get().info("Application started", { port: 3000 });
systemLogger
  .get()
  .error("Database connection failed", { error: "Connection timeout" });
```

## Available Channels

- **CHECKOUT** - Shopping cart and checkout processes
- **PRODUCT_CATALOG** - Product browsing and catalog operations
- **ACCOUNT** - User account management
- **INTERSHOP_API** - External Intershop API calls
- **STORYBLOK_CMS** - Storyblok CMS interactions
- **SYSTEM** - General system and application logs
- **DEFAULT** - Fallback channel

## Usage Examples

### Channel-specific logging

```typescript
import {
  checkoutLogger,
  productCatalogLogger,
  accountLogger,
  intershopApiLogger,
} from "@exp-places-app/logger";

// Checkout process
checkoutLogger.get().info("Cart updated", {
  userId: "12345",
  itemsCount: 3,
  total: 129.99,
});

// Product catalog
productCatalogLogger.get().debug("Product search executed", {
  query: "nike shoes",
  resultsCount: 42,
  duration: 150,
});

// Account operations
accountLogger.get().warn("Failed login attempt", {
  email: "user@example.com",
  ip: "192.168.1.100",
  reason: "Invalid password",
});

// API calls
intershopApiLogger.get().error("API request failed", {
  endpoint: "/api/products",
  status: 500,
  responseTime: 5000,
});
```

### Direct logger instance

```typescript
import logger, { LogLevel, LogChannel } from "@exp-places-app/logger";

// Using main logger instance
logger.info("App initialization complete");
logger.error("Unexpected error occurred", { error: "Details here" });

// Using specific channel
const channelLogger = logger.getChannel(LogChannel.STORYBLOK_CMS);
channelLogger.info("Content fetched from Storyblok", {
  contentType: "product",
  id: "abc123",
});
```

### Console Migration (Development)

```typescript
import { overrideGlobalConsole, LogChannel } from "@exp-places-app/logger";

// Override global console for seamless migration
overrideGlobalConsole(LogChannel.SYSTEM);

// Now all existing console.log calls use Winston
console.log("This goes through Winston now");
console.error("Error logged via Winston");
console.warn("Warning via Winston");
```

### Advanced Configuration

```typescript
import { setupLogger, LogLevel } from "@exp-places-app/logger";

setupLogger({
  level: LogLevel.DEBUG,
  environment: "production",
  enableFileLogging: true,
  logDir: "./logs",
  maxFiles: "30d",
  maxSize: "100m",
  datePattern: "YYYY-MM-DD-HH",
});
```

## Configuration Options

| Option              | Type    | Default       | Description                                        |
| ------------------- | ------- | ------------- | -------------------------------------------------- |
| `level`             | string  | 'info'        | Minimum log level (error, warn, info, debug, etc.) |
| `environment`       | string  | 'development' | Environment (development, staging, production)     |
| `enableFileLogging` | boolean | true          | Enable file transport                              |
| `logDir`            | string  | './logs'      | Directory for log files                            |
| `maxFiles`          | string  | '14d'         | Maximum number of log files to keep                |
| `maxSize`           | string  | '20m'         | Maximum size per log file                          |
| `datePattern`       | string  | 'YYYY-MM-DD'  | Date pattern for file rotation                     |

## Log Levels

- **error** - Error conditions
- **warn** - Warning conditions
- **info** - Informational messages
- **http** - HTTP request logging
- **verbose** - Verbose informational
- **debug** - Debug messages
- **silly** - Very detailed debug info

## File Output

Logs are written to:

- `./logs/YYYY-MM-DD-combined.log` - All logs
- `./logs/YYYY-MM-DD-error.log` - Error logs only
- `./logs/exceptions.log` - Uncaught exceptions
- `./logs/rejections.log` - Unhandled promise rejections

## Development vs Production

### Development

- Colorized console output
- Detailed formatting
- All log levels enabled

### Production

- JSON structured output
- File logging prioritized
- Higher log level thresholds

## Migration from console.log

Replace existing console calls:

```typescript
// Before
console.log("User logged in", userId);
console.error("Database error:", error);

// After
import { systemLogger } from "@exp-places-app/logger";

systemLogger.get().info("User logged in", { userId });
systemLogger.get().error("Database error", { error });
```

Or use the console override for gradual migration:

```typescript
import { overrideGlobalConsole } from "@exp-places-app/logger";

overrideGlobalConsole(); // All console calls now use Winston
```

## License

MIT
