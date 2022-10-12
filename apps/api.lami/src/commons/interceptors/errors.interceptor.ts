import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

//# See more info https://docs.nestjs.com/interceptors#exception-mapping
@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      // map((response) => {
      //   console.log({response})
      //   return response;
      // }),
      catchError((err) => {
        
        console.log('Enter error', { err });

        const message = err?.response?.message || err?.message || err?.toString();
        
        return throwError(() =>
          new HttpException(
            {
              status: 'error',
              message
            },
            err?.status || 500
          )
        );
      }),
    );
  }
}
