import winston from "winston";
import { TransportManager } from './transports';
import { ChannelLogger, LogChannel, LogContext, LoggerConfig, LogLevel } from "./types";

export class ChannelLoggerImpl implements ChannelLogger {
  private logger: winston.Logger;
  private channel: LogChannel;

  constructor(parentLogger: winston.Logger, channel: LogChannel) {
    this.channel = channel;
    // Create a channel-specific logger
    this.logger = this.createChannelSpecificLogger(channel);
  }

  private createChannelSpecificLogger(channel: LogChannel): winston.Logger {
    const config = WinstonLogger.getInstance().getConfig();

    // TransportManager'dan channel-specific transports al
    const channelTransports = TransportManager.createChannelTransports(config, channel);

    // Yeni winston logger oluştur
    return winston.createLogger({
      level: config.level || LogLevel.INFO,
      transports: channelTransports,
      defaultMeta: { channel },
      exitOnError: false,
    });
  }

  private formatMessage(message: string, meta?: LogContext): [string, LogContext] {
    const enrichedMeta: LogContext = {
      ...meta,
      channel: this.channel
    };

    return [message, enrichedMeta];
  }

  error(message: string, meta?: LogContext): void {
    const [msg, enrichedMeta] = this.formatMessage(message, meta);
    this.logger.error(msg, enrichedMeta);
  }

  warn(message: string, meta?: LogContext): void {
    const [msg, enrichedMeta] = this.formatMessage(message, meta);
    this.logger.warn(msg, enrichedMeta);
  }

  info(message: string, meta?: LogContext): void {
    const [msg, enrichedMeta] = this.formatMessage(message, meta);
    this.logger.info(msg, enrichedMeta);
  }

  http(message: string, meta?: LogContext): void {
    const [msg, enrichedMeta] = this.formatMessage(message, meta);
    this.logger.http(msg, enrichedMeta);
  }

  verbose(message: string, meta?: LogContext): void {
    const [msg, enrichedMeta] = this.formatMessage(message, meta);
    this.logger.verbose(msg, enrichedMeta);
  }

  debug(message: string, meta?: LogContext): void {
    const [msg, enrichedMeta] = this.formatMessage(message, meta);
    this.logger.debug(msg, enrichedMeta);
  }

  silly(message: string, meta?: LogContext): void {
    const [msg, enrichedMeta] = this.formatMessage(message, meta);
    this.logger.silly(msg, enrichedMeta);
  }

  log(level: LogLevel, message: string, meta?: LogContext): void {
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
      maxFiles: "14d", // Jira: max. 14 days
      maxSize: "20m", // There is no definition in Jira, setting to 20MB
      datePattern: "YYYY-MM-DD",
      format: "detailed", // "simple" | "detailed" | "json"
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
        winston.format.metadata({ fillExcept: ["message", "level", "timestamp"] }),
      ),
    });

    // Handle uncaught exceptions and unhandled rejections
    this.winstonLogger.exceptions.handle(
      new winston.transports.File({ filename: `${this.config.logDir}/exceptions.log` }),
    );

    this.winstonLogger.rejections.handle(
      new winston.transports.File({ filename: `${this.config.logDir}/rejections.log` }),
    );
  }

  private initializeChannels(): void {
    Object.values(LogChannel).forEach((channel) => {
      this.channels.set(channel, new ChannelLoggerImpl(this.winstonLogger, channel));
    });
  }

  // Get logger for a specific channel
  public getChannel(channel: LogChannel): ChannelLogger {
    const channelLogger = this.channels.get(channel);
    if (!channelLogger) {
      throw new Error(`Channel ${channel} not found`);
    }
    return channelLogger;
  }

  // Update configuration and reinitialize logger
  public updateConfig(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.initializeLogger();
  }

  // Get current configuration
  public getConfig(): LoggerConfig {
    return this.config;
  }

  // Convenience methods for direct logging
  public error(message: string, meta?: LogContext): void {
    this.getChannel(LogChannel.SYSTEM).error(message, meta);
  }

  public warn(message: string, meta?: LogContext): void {
    this.getChannel(LogChannel.SYSTEM).warn(message, meta);
  }

  public info(message: string, meta?: LogContext): void {
    this.getChannel(LogChannel.SYSTEM).info(message, meta);
  }

  public debug(message: string, meta?: LogContext): void {
    this.getChannel(LogChannel.SYSTEM).debug(message, meta);
  }
}
