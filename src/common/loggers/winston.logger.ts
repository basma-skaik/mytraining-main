import { ConsoleLogger } from '@nestjs/common';
const winston = require('winston');
const { combine, timestamp, printf, colorize, align } = winston.format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
  ),
  transports: [new winston.transports.Console()],
});
export class CustomLogger extends ConsoleLogger {
  debug(message: string) {
    logger.error(message);
  }

  error(message: string) {
    logger.error(message);
  }

  log(message: string) {
    logger.info(message);
  }

  info(message: string) {
    logger.info(message);
  }

  warn(message: string) {
    logger.warn(message);
  }
}