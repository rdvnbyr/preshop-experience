import { WinstonLogger } from './logger';
import { ChannelLogger, LogChannel, LoggerConfig } from './types';

// Factory class to manage and provide loggers for different channels
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


// Ensure the logger is initialized with default config if not already done
function createChannelLogger(channel: LogChannel): ChannelLogger {
    let caschedLogger: ChannelLogger | null = null;

    return new Proxy({} as ChannelLogger, {
        get(_, prop: keyof ChannelLogger) {
            if (!caschedLogger) {
                caschedLogger = ChannelFactory.getCustomChannel(channel);
            }
            return caschedLogger[prop];
        }
    });
}

// Exporting pre-configured loggers for different channels
export const checkoutLogger = createChannelLogger(LogChannel.CHECKOUT);
export const productCatalogLogger = createChannelLogger(LogChannel.PRODUCT_CATALOG);
export const accountLogger = createChannelLogger(LogChannel.ACCOUNT);
export const intershopApiLogger = createChannelLogger(LogChannel.INTERSHOP_API);
export const storyblokCmsLogger = createChannelLogger(LogChannel.STORYBLOK_CMS);
export const systemLogger = createChannelLogger(LogChannel.SYSTEM);
export const defaultLogger = createChannelLogger(LogChannel.DEFAULT);