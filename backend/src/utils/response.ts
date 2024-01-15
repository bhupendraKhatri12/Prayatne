import { HttpException, HttpStatus } from '@nestjs/common';

export function successMessage(message: string, data: any) {
  return {
    message,
    data,
  };
}

export function errorMessage(reason: string, field: string, ...status: any) {
  throw new HttpException(
    { reason, field },
    status[0] || HttpStatus.BAD_REQUEST,
  );
}
