// Logger Types
export interface LoggerConfig {
  level?: string;
  environment?: 'development' | 'staging' | 'production';
  enableFileLogging?: boolean;
  logDir?: string;
  maxFiles?: string;
  maxSize?: string;
  datePattern?: string;
  format?: 'json' | 'simple' | 'detailed';
}

export interface LogMetadata {
  [key: string]: any;
  timestamp?: string;
  requestId?: string;
  userId?: string;
  sessionId?: string;
}

// Log Channels
export enum LogChannel {
  CHECKOUT = 'checkout',
  PRODUCT_CATALOG = 'product-catalog',
  ACCOUNT = 'account',
  INTERSHOP_API = 'intershop-api',
  STORYBLOK_CMS = 'storyblok-cms',
  SYSTEM = 'system',
  DEFAULT = 'default'
}

// Log Levels
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  SILLY = 'silly'
}

// Channel Logger Interface
export interface ChannelLogger {
  error(message: string, meta?: LogMetadata): void;
  warn(message: string, meta?: LogMetadata): void;
  info(message: string, meta?: LogMetadata): void;
  http(message: string, meta?: LogMetadata): void;
  verbose(message: string, meta?: LogMetadata): void;
  debug(message: string, meta?: LogMetadata): void;
  silly(message: string, meta?: LogMetadata): void;
  log(level: LogLevel, message: string, meta?: LogMetadata): void;
}

// Console Shim Interface für Migration
export interface ConsoleShim {
  log: (message?: any, ...optionalParams: any[]) => void;
  warn: (message?: any, ...optionalParams: any[]) => void;
  error: (message?: any, ...optionalParams: any[]) => void;
  info: (message?: any, ...optionalParams: any[]) => void;
}