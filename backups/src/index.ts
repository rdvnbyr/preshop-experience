// Core Logger
export { ChannelLoggerImpl, WinstonLogger } from "./logger";

// Transport Manager
export { TransportManager } from "./transports";

// Types
export type {
  ChannelLogger,
  ConsoleShim,
  LogChannel,
  LogContext,
  LoggerConfig,
  LogLevel,
} from "./types";

// Channel Factory
export {
  accountLogger,
  ChannelFactory,
  checkoutLogger,
  defaultLogger,
  intershopApiLogger,
  productCatalogLogger,
  storyblokCmsLogger,
  systemLogger,
} from "./channels";

// Console Shim
export {
  ConsoleShimImpl,
  createConsoleShim,
  overrideGlobalConsole,
  restoreGlobalConsole,
} from "./console-shim";

// Import required types and classes for default export
import { ChannelFactory } from "./channels";
import { WinstonLogger } from "./logger";
import type { LoggerConfig } from "./types";

// Default Export - Einfacher Zugang zur Logger-Instanz
const logger = WinstonLogger.getInstance();
export default logger;

/**
 * Quick Setup Function für einfache Initialisierung
 */
export function setupLogger(config?: LoggerConfig): WinstonLogger {
  return WinstonLogger.getInstance(config);
}

/**
 * Initialize Logger mit spezifischer Konfiguration
 */
export function initializeLogger(config: LoggerConfig): void {
  ChannelFactory.initialize(config);
}
