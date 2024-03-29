import { HttpException, HttpStatus } from '@nestjs/common';

export interface SuccessMessageResponse<T> {
  message: string;
  data: T;
}

export interface ErrorMessageResponse<T> {
  reason: string;
  field: string;
}

export function successMessage<T>(
  message: string,
  data: T,
): SuccessMessageResponse<T> {
  return {
    message,
    data,
  };
}

export function errorMessage<T>(
  reason: string,
  field: string,
  ...status: any
): ErrorMessageResponse<T> {
  throw new HttpException(
    { reason, field } as ErrorMessageResponse<void>, // Ensure the shape of the error message
    status[0] || HttpStatus.BAD_REQUEST,
  );
}
