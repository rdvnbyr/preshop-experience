import { WinstonLogger } from "./logger";
import { LogChannel, ChannelLogger, LoggerConfig } from "./types";

/**
 * Channel Factory - Erstellt vorkonfigurierte Logger für spezifische Bereiche
 */
export class ChannelFactory {
  private static logger: WinstonLogger;

  public static initialize(config?: LoggerConfig): void {
    ChannelFactory.logger = WinstonLogger.getInstance(config);
  }

  public static getCheckoutLogger(): ChannelLogger {
    return this.getLogger().getChannel(LogChannel.CHECKOUT);
  }

  public static getProductCatalogLogger(): ChannelLogger {
    return this.getLogger().getChannel(LogChannel.PRODUCT_CATALOG);
  }

  public static getAccountLogger(): ChannelLogger {
    return this.getLogger().getChannel(LogChannel.ACCOUNT);
  }

  public static getIntershopApiLogger(): ChannelLogger {
    return this.getLogger().getChannel(LogChannel.INTERSHOP_API);
  }

  public static getStoryblokCmsLogger(): ChannelLogger {
    return this.getLogger().getChannel(LogChannel.STORYBLOK_CMS);
  }

  public static getSystemLogger(): ChannelLogger {
    return this.getLogger().getChannel(LogChannel.SYSTEM);
  }

  public static getDefaultLogger(): ChannelLogger {
    return this.getLogger().getChannel(LogChannel.DEFAULT);
  }

  public static getCustomChannel(channel: LogChannel): ChannelLogger {
    return this.getLogger().getChannel(channel);
  }

  private static getLogger(): WinstonLogger {
    if (!ChannelFactory.logger) {
      ChannelFactory.logger = WinstonLogger.getInstance();
    }
    return ChannelFactory.logger;
  }
}

/**
 * Convenience Exports für direkte Channel-Nutzung
 */
export const checkoutLogger = {
  get: () => ChannelFactory.getCheckoutLogger(),
};

export const productCatalogLogger = {
  get: () => ChannelFactory.getProductCatalogLogger(),
};

export const accountLogger = {
  get: () => ChannelFactory.getAccountLogger(),
};

export const intershopApiLogger = {
  get: () => ChannelFactory.getIntershopApiLogger(),
};

export const storyblokCmsLogger = {
  get: () => ChannelFactory.getStoryblokCmsLogger(),
};

export const systemLogger = {
  get: () => ChannelFactory.getSystemLogger(),
};

export const defaultLogger = {
  get: () => ChannelFactory.getDefaultLogger(),
};
