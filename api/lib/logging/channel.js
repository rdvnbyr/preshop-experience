const { logger, logChannels } = require("./index");

const getLoggerByChannel = (channel) => {
  if (!logChannels[channel]) {
    return logger.child({ channel: "system" });
  }
  return logger.child({ channel });
};

const log = {
  checkout: getLoggerByChannel("checkout"),
  catalog: getLoggerByChannel("catalog"),
  account: getLoggerByChannel("account"),
  order: getLoggerByChannel("order"),
  system: getLoggerByChannel("system"),
  webhook: getLoggerByChannel("webhook"),
  payment: getLoggerByChannel("payment"),
  shipping: getLoggerByChannel("shipping"),
};

module.exports = {
  getLoggerByChannel,
  logChannels,
  log,
};
