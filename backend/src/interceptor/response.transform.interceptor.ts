import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  success: boolean;
  message: T;
}

/**
 *
 */
@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  private logger: Logger = new Logger('RESPONSE ERROR INTERCEPTOR');
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        success: true,
        message: data.message,
        data: data.data,
      })),
      catchError((err) => {
        this.logger.log(err);
        const success = false;
        let statusCode, reason, field;

        // to catch Type Error
        if (err instanceof TypeError) {
          statusCode: HttpStatus.BAD_REQUEST;
          reason = err.message;
          field = err;
        } else {
          statusCode = err.status || HttpStatus.FORBIDDEN;
          reason = err.response || err.message;
        }
        return throwError(
          new HttpException(
            {
              statusCode,
              success,
              message: {
                reason,
                field,
              },
            },
            statusCode,
          ),
        );
      }),
    );
  }
}
