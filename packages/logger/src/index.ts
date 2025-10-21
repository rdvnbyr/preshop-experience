// Core Logger
export { WinstonLogger, ChannelLoggerImpl } from "./logger";

// Types
export type {
  LoggerConfig,
  LogMetadata,
  ChannelLogger,
  ConsoleShim,
} from "./types";

export { LogChannel, LogLevel } from "./types";

// Channel Factory
export {
  ChannelFactory,
  checkoutLogger,
  productCatalogLogger,
  accountLogger,
  intershopApiLogger,
  storyblokCmsLogger,
  systemLogger,
  defaultLogger,
} from "./channels";

// Console Shim
export {
  ConsoleShimImpl,
  createConsoleShim,
  overrideGlobalConsole,
  restoreGlobalConsole,
} from "./console-shim";

// Transport Manager
export { TransportManager } from "./transports";

// Import required types and classes for default export
import { WinstonLogger } from "./logger";
import { ChannelFactory } from "./channels";
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
