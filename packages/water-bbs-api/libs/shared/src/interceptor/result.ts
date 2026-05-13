import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { isObject } from 'class-validator';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import { AppError, isOk, isResult } from 'water-bbs-shared';

@Injectable()
export class ResultInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        if (isResult(data)) {
          if (isOk(data)) {
            return isObject(data.value) ? data.value : {};
          }
          const err = data.error as AppError;
          console.log(data.error);
          throw new HttpException(err.message, err.code, {
            cause: err.code >= 499 ? {} : err.cause,
          });
        }
        if (isObject(data)) {
          return data;
        }
        return {};
      }),
    );
  }
}
