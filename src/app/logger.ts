import winston from "../../node_modules/winston/index";

export const logger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  transports: [new winston.transports.Console({})],
});
