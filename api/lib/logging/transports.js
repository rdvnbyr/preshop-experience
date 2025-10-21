const winston = require("winston");
const dailyRotateFile = require("winston-daily-rotate-file");
const SentryTransport = require("./sentry-transport");

const createTransports = (env) => {
  const consoleTransport = new winston.transports.Console({
    level: env === "development" ? "debug" : "info",
  });

  const dailyRotateFileTransport = new dailyRotateFile({
    filename: "logs/combined.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "10m",
    maxFiles: "14d",
  });

  const sentryTransport = new SentryTransport({ level: "error" });

  return [consoleTransport, dailyRotateFileTransport, sentryTransport];
};

module.exports = createTransports;
