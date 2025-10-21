import winston from "winston";
import {
  LoggerConfig,
  LogChannel,
  LogLevel,
  ChannelLogger,
  LogMetadata,
} from "./types";
import { TransportManager } from "./transports";

export class ChannelLoggerImpl implements ChannelLogger {
  private logger: winston.Logger;
  private channel: LogChannel;

  constructor(logger: winston.Logger, channel: LogChannel) {
    this.logger = logger;
    this.channel = channel;
  }

  private formatMessage(
    message: string,
    meta?: LogMetadata,
  ): [string, LogMetadata] {
    const enrichedMeta: LogMetadata = {
      ...meta,
      channel: this.channel,
      timestamp: new Date().toISOString(),
    };

    return [message, enrichedMeta];
  }

  error(message: string, meta?: LogMetadata): void {
    const [msg, enrichedMeta] = this.formatMessage(message, meta);
    this.logger.error(msg, enrichedMeta);
  }

  warn(message: string, meta?: LogMetadata): void {
    const [msg, enrichedMeta] = this.formatMessage(message, meta);
    this.logger.warn(msg, enrichedMeta);
  }

  info(message: string, meta?: LogMetadata): void {
    const [msg, enrichedMeta] = this.formatMessage(message, meta);
    this.logger.info(msg, enrichedMeta);
  }

  http(message: string, meta?: LogMetadata): void {
    const [msg, enrichedMeta] = this.formatMessage(message, meta);
    this.logger.http(msg, enrichedMeta);
  }

  verbose(message: string, meta?: LogMetadata): void {
    const [msg, enrichedMeta] = this.formatMessage(message, meta);
    this.logger.verbose(msg, enrichedMeta);
  }

  debug(message: string, meta?: LogMetadata): void {
    const [msg, enrichedMeta] = this.formatMessage(message, meta);
    this.logger.debug(msg, enrichedMeta);
  }

  silly(message: string, meta?: LogMetadata): void {
    const [msg, enrichedMeta] = this.formatMessage(message, meta);
    this.logger.silly(msg, enrichedMeta);
  }

  log(level: LogLevel, message: string, meta?: LogMetadata): void {
    const [msg, enrichedMeta] = this.formatMessage(message, meta);
    this.logger.log(level, msg, enrichedMeta);
  }
}

export class WinstonLogger {
  private static instance: WinstonLogger;
  private winstonLogger!: winston.Logger;
  private config: LoggerConfig;
  private channels: Map<LogChannel, ChannelLogger> = new Map();

  constructor(config: LoggerConfig = {}) {
    this.config = {
      level: LogLevel.INFO,
      environment: "development",
      enableFileLogging: true,
      logDir: "./logs",
      maxFiles: "14d",
      maxSize: "20m",
      datePattern: "YYYY-MM-DD",
      format: "detailed",
      ...config,
    };

    this.initializeLogger();
    this.initializeChannels();
  }

  public static getInstance(config?: LoggerConfig): WinstonLogger {
    if (!WinstonLogger.instance) {
      WinstonLogger.instance = new WinstonLogger(config);
    }
    return WinstonLogger.instance;
  }

  private initializeLogger(): void {
    const transports = TransportManager.createTransports(this.config);

    this.winstonLogger = winston.createLogger({
      level: this.config.level,
      transports,
      exitOnError: false,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.metadata({
          fillExcept: ["message", "level", "timestamp"],
        }),
      ),
    });

    // Handle uncaught exceptions and unhandled rejections
    this.winstonLogger.exceptions.handle(
      new winston.transports.File({
        filename: `${this.config.logDir}/exceptions.log`,
      }),
    );

    this.winstonLogger.rejections.handle(
      new winston.transports.File({
        filename: `${this.config.logDir}/rejections.log`,
      }),
    );
  }

  private initializeChannels(): void {
    Object.values(LogChannel).forEach((channel) => {
      this.channels.set(
        channel,
        new ChannelLoggerImpl(this.winstonLogger, channel),
      );
    });
  }

  public getChannel(channel: LogChannel): ChannelLogger {
    const channelLogger = this.channels.get(channel);
    if (!channelLogger) {
      throw new Error(`Channel ${channel} not found`);
    }
    return channelLogger;
  }

  public updateConfig(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.initializeLogger();
  }

  public getConfig(): LoggerConfig {
    return { ...this.config };
  }

  // Convenience methods for direct logging
  public error(message: string, meta?: LogMetadata): void {
    this.getChannel(LogChannel.SYSTEM).error(message, meta);
  }

  public warn(message: string, meta?: LogMetadata): void {
    this.getChannel(LogChannel.SYSTEM).warn(message, meta);
  }

  public info(message: string, meta?: LogMetadata): void {
    this.getChannel(LogChannel.SYSTEM).info(message, meta);
  }

  public debug(message: string, meta?: LogMetadata): void {
    this.getChannel(LogChannel.SYSTEM).debug(message, meta);
  }
}
