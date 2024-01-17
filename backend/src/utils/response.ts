import { HttpException, HttpStatus } from '@nestjs/common';


export  interface SuccessMessageResponse<T> {
  message: string;
  data: T;
}


export  interface ErrorMessageResponse {
  reason: string;
  field: string;
}



export function successMessage<T>(message: string, data: T): SuccessMessageResponse<T> {
  return {
    message,
    data,
  };
}

export function errorMessage(reason: string, field: string, ...status: any) {
  throw new HttpException(
    { reason, field } as ErrorMessageResponse, // Ensure the shape of the error message
    status[0] || HttpStatus.BAD_REQUEST,
  )
}
