import { error, info, warn, log } from "firebase-functions/logger";

export const Logger = {
  info: (msg, data) => info(msg, data),
  warn: (msg, data) => warn(msg, data),
  error: (msg, data) => error(msg, data),
  debug: (msg, data) => log(msg, data),
};
