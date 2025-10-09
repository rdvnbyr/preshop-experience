const { log } = require("../lib/logging/channel");

const getHttpChannel = (req) => {
  const splittedPath = req.path.split("/");
  if (splittedPath.includes("webhook")) {
    return "webhook";
  } else if (splittedPath.includes("api")) {
    return "api";
  } else {
    return "http";
  }
};

const httpLogger = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const meta = {
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      durationMs: duration,
    };

    const channel = getHttpChannel(req);
    const info = `HTTP ${req.method} ${req.url} ${res.statusCode} ${duration}ms`;
    if (log[channel]) {
      log[channel].info(info, meta);
    } else {
      log.system.info(info, meta);
    }
  });
  next();
};

module.exports = httpLogger;
