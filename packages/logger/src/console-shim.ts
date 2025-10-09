import { WinstonLogger } from './logger';
import { LogChannel, ConsoleShim } from './types';

/**
 * Console Shim - Drop-in replacement für console.log/warn/error
 * Ermöglicht einfache Migration bestehender console.* Aufrufe
 */
export class ConsoleShimImpl implements ConsoleShim {
  private logger: WinstonLogger;
  private defaultChannel: LogChannel;

  constructor(logger: WinstonLogger, defaultChannel: LogChannel = LogChannel.SYSTEM) {
    this.logger = logger;
    this.defaultChannel = defaultChannel;
  }

  log(message?: any, ...optionalParams: any[]): void {
    const fullMessage = this.formatMessage(message, optionalParams);
    this.logger.getChannel(this.defaultChannel).info(fullMessage);
  }

  warn(message?: any, ...optionalParams: any[]): void {
    const fullMessage = this.formatMessage(message, optionalParams);
    this.logger.getChannel(this.defaultChannel).warn(fullMessage);
  }

  error(message?: any, ...optionalParams: any[]): void {
    const fullMessage = this.formatMessage(message, optionalParams);
    this.logger.getChannel(this.defaultChannel).error(fullMessage);
  }

  info(message?: any, ...optionalParams: any[]): void {
    const fullMessage = this.formatMessage(message, optionalParams);
    this.logger.getChannel(this.defaultChannel).info(fullMessage);
  }

  private formatMessage(message: any, optionalParams: any[]): string {
    let fullMessage = String(message || '');
    
    if (optionalParams.length > 0) {
      const additional = optionalParams.map(param => {
        if (typeof param === 'object') {
          try {
            return JSON.stringify(param, null, 2);
          } catch {
            return String(param);
          }
        }
        return String(param);
      }).join(' ');
      
      fullMessage += ' ' + additional;
    }
    
    return fullMessage;
  }
}

/**
 * Factory function für Console Shim
 */
export function createConsoleShim(channel: LogChannel = LogChannel.SYSTEM): ConsoleShim {
  const logger = WinstonLogger.getInstance();
  return new ConsoleShimImpl(logger, channel);
}

/**
 * Globaler Console Override (nur für Development empfohlen)
 */
export function overrideGlobalConsole(channel: LogChannel = LogChannel.SYSTEM): void {
  const shim = createConsoleShim(channel);
  
  // Backup der originalen Console-Methoden
  (console as any).__original = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info
  };
  
  // Override
  console.log = shim.log.bind(shim);
  console.warn = shim.warn.bind(shim);
  console.error = shim.error.bind(shim);
  console.info = shim.info.bind(shim);
}

/**
 * Restore der originalen Console-Methoden
 */
export function restoreGlobalConsole(): void {
  if ((console as any).__original) {
    console.log = (console as any).__original.log;
    console.warn = (console as any).__original.warn;
    console.error = (console as any).__original.error;
    console.info = (console as any).__original.info;
    delete (console as any).__original;
  }
}