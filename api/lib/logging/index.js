const winston = require("winston");
const createTransports = require("./transports");

const logChannels = {
  checkout: "checkout",
  catalog: "catalog",
  account: "account",
  order: "order",
  system: "system",
  webhook: "webhook",
  payment: "payment",
  shipping: "shipping",
};

const env = process.env.NODE_ENV || "development";
const logLevelByEnv = {
  development: "debug",
  staging: "info",
  production: "warn",
};

const logLevel = logLevelByEnv[env];

const ignoredFormat = winston.format((info) => {
  if (info.message.startsWith("Server running in")) {
    return false;
  }
  return info;
});

const baseFormat = winston.format.combine(
  ignoredFormat(),
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf((info) => {
    const { timestamp, level, message, channel, ...meta } = info;
    const metaStr =
      meta && Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    const channelStr = channel ? ` [${channel}]` : "";
    return `${timestamp} ${level.toUpperCase()} ${channelStr}${message}${metaStr}`;
  }),
);

const createLogger = () => {
  return winston.createLogger({
    level: logLevel ?? "info",
    format: baseFormat,
    transports: createTransports(env),
    exitOnError: false,
  });
};

// Root logger (no channel)
const logger = createLogger();

module.exports = {
  createLogger,
  logger,
  logChannels,
};
