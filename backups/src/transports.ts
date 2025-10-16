import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { LoggerConfig, LogLevel } from "./types";

export class TransportManager {

  // Static method to create console transport
  private static createConsoleTransport(config: LoggerConfig): winston.transports.ConsoleTransportInstance {
    const format = this.getConsoleFormat(config);

    return new winston.transports.Console({
      level: config.level || LogLevel.INFO,
      format,
      handleExceptions: true,
      handleRejections: true,
    });
  }

  private static createFileTransport(config: LoggerConfig): DailyRotateFile {
    const logDir = config.logDir || "./logs";
    const format = this.getFileFormat(config);

    return new DailyRotateFile({
      // Later, for channel-specific files:
      // filename: `${logDir}/%DATE%-${channel || 'combined'}.log`,
      filename: this.getFilename(logDir),
      datePattern: config.datePattern || "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: config.maxSize || "20m",
      maxFiles: config.maxFiles || "14d",
      level: config.level || LogLevel.INFO,
      format,
      handleExceptions: true,
      handleRejections: true,
    });
  }

  private static createErrorFileTransport(config: LoggerConfig): DailyRotateFile {
    const logDir = config.logDir || "./logs";

    return new DailyRotateFile({
      filename: this.getFilename(logDir, "error"),
      datePattern: config.datePattern || "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: config.maxSize || "20m",
      maxFiles: config.maxFiles || "14d",
      level: LogLevel.ERROR,
      format: this.getFileFormat(config),
      handleExceptions: true,
      handleRejections: true,
    });
  }


  //---------- CHANNEL LOGGER METHODS ----------//
  /**
   * Create transports for a specific channel
   */
  public static createChannelTransports(config: LoggerConfig, channel: string): Array<winston.transport> {
    const transports: Array<winston.transport> = [];

    // Console transport (always active)
    transports.push(this.createConsoleTransport(config));

    // File transports (channel-specific)
    if (config.enableFileLogging !== false) {
      transports.push(this.createChannelFileTransport(config, channel));
      transports.push(this.createChannelErrorFileTransport(config, channel));
    }

    return transports;
  }

  /**
   * Channel-specific file transport (all levels except error)
   */
  private static createChannelFileTransport(config: LoggerConfig, channel: string): DailyRotateFile {
    const logDir = config.logDir || "./logs";
    const format = this.getFileFormat(config);

    return new DailyRotateFile({
      filename: this.getFilename(logDir, channel),
      datePattern: config.datePattern || "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: config.maxSize || "20m",
      maxFiles: config.maxFiles || "14d",
      level: config.level || LogLevel.INFO,
      format,
      handleExceptions: true,
      handleRejections: true,
    });
  }

  /**
   * Channel-specific error file transport (only error level)
   */
  private static createChannelErrorFileTransport(config: LoggerConfig, channel: string): DailyRotateFile {
    const logDir = config.logDir || "./logs";

    return new DailyRotateFile({
      filename: this.getFilename(logDir, `${channel}-error`),
      datePattern: config.datePattern || "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: config.maxSize || "20m",
      maxFiles: config.maxFiles || "14d",
      level: LogLevel.ERROR,
      format: this.getFileFormat(config),
      handleExceptions: true,
      handleRejections: true,
    });
  }


  private static getConsoleFormat(config: LoggerConfig): winston.Logform.Format {
    const isDevelopment = config.environment === "development";

    if (isDevelopment) {
      return winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        winston.format.colorize({ all: true }),
        winston.format.printf(({ timestamp, level, message, channel, ...meta }: any) => {
          const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
          const channelStr = channel ? `[${channel}]` : "";
          return `${timestamp} ${level} ${channelStr}: ${message}${metaStr}`;
        }),
      );
    }

    return winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json(),
    );
  }

  /**
   * File format (Production: human-readable, Development: JSON)
   */
  private static getFileFormat(config: LoggerConfig): winston.Logform.Format {
    const isProduction = config.environment === "production";

    // Base format - All time needed
    const baseFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.metadata({ fillExcept: ["message", "level", "timestamp"] })
    );

    if (isProduction) {
      // Production: Human-readable string format (easier for ops team)
      return winston.format.combine(
        baseFormat,
        winston.format.printf(({ timestamp, level, message, metadata, ...rest }: any) => {
          const meta = metadata || rest;
          const channelStr = meta?.channel ? `[${meta.channel}]` : "";

          // Delete channel from meta to avoid duplication
          const cleanMeta = { ...meta };
          if (cleanMeta.channel) delete cleanMeta.channel;

          const metaStr = Object.keys(cleanMeta).length ? ` | ${JSON.stringify(cleanMeta)}` : "";
          return `${timestamp} ${level.toUpperCase()} ${channelStr}: ${message}${metaStr}`;
        })
      );
    } else {
      // Development/Staging: Structured JSON format (better for debugging)
      return winston.format.combine(
        baseFormat,
        winston.format.json()
      );
    }
  }

  private static getFilename(logDir: string, channel?: string): string {
    return channel ? `${logDir}/%DATE%-${channel}.log` : `${logDir}/%DATE%-combined.log`;
  }

  // Main method to create all transports based on config
  public static createTransports(config: LoggerConfig): Array<winston.transport> {
    const transports: Array<winston.transport> = [];

    // Console Transport (immer aktiv)
    transports.push(this.createConsoleTransport(config));

    // File Transports (optional)
    if (config.enableFileLogging !== false) {
      transports.push(this.createFileTransport(config));
      transports.push(this.createErrorFileTransport(config));
    }

    return transports;
  }
}
