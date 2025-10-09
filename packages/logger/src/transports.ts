import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { LoggerConfig, LogLevel } from './types';

export class TransportManager {
  private static createConsoleTransport(config: LoggerConfig): winston.transports.ConsoleTransportInstance {
    const format = this.getConsoleFormat(config);
    
    return new winston.transports.Console({
      level: config.level || LogLevel.INFO,
      format,
      handleExceptions: true,
      handleRejections: true
    });
  }

  private static createFileTransport(config: LoggerConfig): DailyRotateFile {
    const logDir = config.logDir || './logs';
    const format = this.getFileFormat(config);
    
    return new DailyRotateFile({
      filename: `${logDir}/%DATE%-combined.log`,
      datePattern: config.datePattern || 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: config.maxSize || '20m',
      maxFiles: config.maxFiles || '14d',
      level: config.level || LogLevel.INFO,
      format,
      handleExceptions: true,
      handleRejections: true
    });
  }

  private static createErrorFileTransport(config: LoggerConfig): DailyRotateFile {
    const logDir = config.logDir || './logs';
    
    return new DailyRotateFile({
      filename: `${logDir}/%DATE%-error.log`,
      datePattern: config.datePattern || 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: config.maxSize || '20m',
      maxFiles: config.maxFiles || '14d',
      level: LogLevel.ERROR,
      format: this.getFileFormat(config),
      handleExceptions: true,
      handleRejections: true
    });
  }

  private static getConsoleFormat(config: LoggerConfig): winston.Logform.Format {
    const isDevelopment = config.environment === 'development';
    
    if (isDevelopment) {
      return winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.colorize({ all: true }),
        winston.format.printf(({ timestamp, level, message, channel, ...meta }: any) => {
          const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
          const channelStr = channel ? `[${channel}]` : '';
          return `${timestamp} ${level} ${channelStr}: ${message}${metaStr}`;
        })
      );
    }

    return winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    );
  }

  private static getFileFormat(config: LoggerConfig): winston.Logform.Format {
    return winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    );
  }

  public static createTransports(config: LoggerConfig): winston.transport[] {
    const transports: winston.transport[] = [];

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