export interface LoggerConfig {
  level?: string;
  environment?: "development" | "staging" | "production";
  enableFileLogging?: boolean;
  logDir?: string;
  maxFiles?: string;
  maxSize?: string;
  datePattern?: string;
  format?: "json" | "simple" | "detailed";
}

export enum LogChannel {
  CHECKOUT = "checkout",
  PRODUCT_CATALOG = "product-catalog",
  ACCOUNT = "account",
  INTERSHOP_API = "intershop-api",
  STORYBLOK_CMS = "storyblok-cms",
  SYSTEM = "system",
  DEFAULT = "default",
}

export enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  HTTP = "http",
  VERBOSE = "verbose",
  DEBUG = "debug",
  SILLY = "silly",
}

export interface LogContext {
  [key: string]: any;
  timestamp?: string;
  level?: string;
  message?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
}

// Channel Logger Interface
export interface ChannelLogger {
  error(message: string, meta?: LogContext): void;
  warn(message: string, meta?: LogContext): void;
  info(message: string, meta?: LogContext): void;
  http(message: string, meta?: LogContext): void;
  verbose(message: string, meta?: LogContext): void;
  debug(message: string, meta?: LogContext): void;
  silly(message: string, meta?: LogContext): void;
  log(level: LogLevel, message: string, meta?: LogContext): void;
}

// Console-Shim (migration)
export interface ConsoleShim {
  log: (message?: any, ...optionalParams: any[]) => void;
  warn: (message?: any, ...optionalParams: any[]) => void;
  error: (message?: any, ...optionalParams: any[]) => void;
  info: (message?: any, ...optionalParams: any[]) => void;
}
