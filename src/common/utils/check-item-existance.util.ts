import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomLogger } from '../loggers/winston.logger';

export const CheckItemExistance = (
  item,
  customMessage?: string,
  logger?: CustomLogger,
) => {
  if (!item) {
    const message = customMessage || 'Item not found';
    if (logger) {
      logger.error(message);
    }
    throw new HttpException(message, HttpStatus.NOT_FOUND);
  }
};
