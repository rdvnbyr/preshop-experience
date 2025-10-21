const Transport = require("winston-transport");
const Sentry = require("@sentry/node");

class SentryTransport extends Transport {
  log(info, cb) {
    setImmediate(() => this.emit("logged", info));

    // only error
    if (info.level === "error" || info.level === "fatal") {
      const err =
        info instanceof Error
          ? info
          : info.error instanceof Error
            ? info.error
            : new Error(info.message);
      Sentry.captureException(err, {
        level: info.level,
        tags: { channel: info.channel || "system" },
        extra: info,
      });
    }

    cb();
  }
}

module.exports = SentryTransport;
