const { log } = require("./channel");

exports.installConsoleShim = () => {
  const original = { ...console };
  console.log = (...args) =>
    log.system.info(args.map((arg) => JSON.stringify(arg)).join(" "));
  console.info = (...args) =>
    log.system.info(args.map((arg) => JSON.stringify(arg)).join(" "));
  console.warn = (...args) =>
    log.system.warn(args.map((arg) => JSON.stringify(arg)).join(" "));
  console.debug = (...args) =>
    log.system.debug(args.map((arg) => JSON.stringify(arg)).join(" "));
  console.error = (...args) => {
    const [first, ...rest] = args;
    if (first instanceof Error) {
      log.system.error(first.message, { stack: first.stack, extra: rest });
    } else {
      log.system.error(args.map((arg) => JSON.stringify(arg)).join(" "));
    }
  };

  return () => {
    console.log = original.log;
    console.info = original.info;
    console.warn = original.warn;
    console.debug = original.debug;
    console.error = original.error;
  };
};

