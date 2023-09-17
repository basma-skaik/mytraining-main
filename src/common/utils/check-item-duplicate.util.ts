import { HttpException, HttpStatus } from '@nestjs/common';

export const checkItemDuplicate = (item, customMessage?: string) => {
  if (item) {
    throw new HttpException(
      customMessage || 'Item is already used',
      HttpStatus.BAD_REQUEST,
    );
  }
};
